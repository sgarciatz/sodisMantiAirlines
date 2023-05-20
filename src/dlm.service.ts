import { Inject, Injectable, Logger } from '@nestjs/common';

import Redlock, { Lock } from 'redlock';
import Redis from 'ioredis';
import { ObjectId } from 'mongodb';
import { Flight } from './flight.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingsService } from './bookings/bookings.service';

@Injectable()
export class DLMService {
    private readonly timeWindow = 180000;
    private dlm: Redlock;
    private log: Logger;
    private activeLocks: Array<any>;
    constructor(
        @InjectRepository(Flight) private flightRepository: Repository<Flight>,
        @Inject(BookingsService) private bookingService: BookingsService
    ) {
        this.log = new Logger('DLMService', { timestamp: true });

        this.dlm = new Redlock([
            new Redis({ host: "172.16.23.81" , port: 6379 }),
            new Redis({ host: "172.16.23.94" , port: 6379 }),
            new Redis({ host: "172.16.23.227" , port: 6379 }),
            new Redis({ host: "172.16.23.152" , port: 6379 }),
            new Redis({ host: "172.16.23.220" , port: 6379 }),
        ], { driftFactor: 0.01, retryCount: 3, retryDelay: 200, retryJitter: 200, automaticExtensionThreshold: 500 });
        this.activeLocks = new Array();
    }

    async holdFlightSeat(flightId: ObjectId, seatNumber: number, userId: ObjectId) {
        let lock;
        // Firstly, check if the seat is available
        let flight: Flight = await this.flightRepository.findOne({ where: { _id: flightId } });
        if (flight.seats[seatNumber] === true) { return false; }
        
        // Adquire the lock
        const isLockAcquired: boolean = await this.dlm.acquire([flightId.toString() + seatNumber.toString()], this.timeWindow).then((value) =>{
            lock = value;
            return true;
        }, (reason) => {
            return false;
        });
        if (!isLockAcquired) { return false; }

        // Push the lock to the active lock list
        this.activeLocks.push({
            'userId': userId,
            'flightId': flightId,
            'seatNumber': seatNumber,
            'lock': lock
        });
        this.log.debug(this.activeLocks);

        //Set a callback to remove it from the list after its expiration
        setTimeout(() => { 
            let expiringLock = this.activeLocks.find((item) => {
                let isUserIdEquals = userId.toString().localeCompare(item['userId'].toString()) === 0;
                let isFlightIdEquals = flightId.toString().localeCompare(item['flightId'].toString()) === 0;
                let isSeatNumberEquals = seatNumber === item['seatNumber'];
                this.log.debug(`isUserIdEquals ${isUserIdEquals}, isFlightIdEquals ${isFlightIdEquals}, isSeatNumberEquals ${isSeatNumberEquals}`)
                if (isUserIdEquals && isFlightIdEquals && isSeatNumberEquals) {
                    return item
                }
            });
            this.log.debug(`Something found? ${expiringLock}`);
            let index = this.activeLocks.indexOf(expiringLock);
            if (expiringLock !== null) {
                this.activeLocks.splice(index, 1);
            }
        }, lock.expiration - Date.now());
        return true;
    }

    async bookFlightSeat(flightId: ObjectId, seatNumber: number, userId: ObjectId): Promise<boolean> {
        // Try to retrieve the lock created by the user
        let userLock = this.activeLocks.find((item) => {
            let isUserIdEquals = userId.toString().localeCompare(item['userId'].toString()) === 0;
            let isFlightIdEquals = flightId.toString().localeCompare(item['flightId'].toString()) === 0;
            let isSeatNumberEquals = seatNumber === item['seatNumber'];
            this.log.debug(`isUserIdEquals ${isUserIdEquals}, isFlightIdEquals ${isFlightIdEquals}, isSeatNumberEquals ${isSeatNumberEquals}`)
            if (isUserIdEquals && isFlightIdEquals && isSeatNumberEquals) {
                return item
            }
        });     
        // If there is no lock, the user cannot book the flight seat
        if (userLock === null || userLock === undefined) return false;


        const lock: Lock = userLock['lock'];

        let flight: Flight = await this.flightRepository.findOne({ where: { _id: flightId } });

        if (flight.seats[seatNumber] === false) {
            this.log.debug(`Booking flight seat with number ${seatNumber} of flight ${flightId}!`);
            flight.seats[seatNumber] = true;
            this.flightRepository.update({ _id: flightId }, flight).finally(() => {
                let index = this.activeLocks.indexOf(userLock);
                if (index !== -1) {
                    this.activeLocks.splice(index, 1);
                }
                this.dlm.release(lock);
                this.bookingService.writeBooking(userId, flightId, seatNumber);
                return null;
            });

            return true;
        } else {
            this.log.debug(`Tried to book an already booked flight seat with number ${seatNumber} of flight ${flightId}!`);
            let index = this.activeLocks.indexOf(userLock);
            if (index !== -1) {
                this.activeLocks.splice(index, 1);
            }
            this.dlm.release(lock);
            return false;
          }
    }

}