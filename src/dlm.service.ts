import { Injectable, Logger } from '@nestjs/common';

import Redlock, { Lock } from 'redlock';
import Redis from 'ioredis';
import { ObjectId } from 'mongodb';
import { Flight } from './flight.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DLMService {
    private dlm: Redlock;
    private log: Logger;

    constructor(
        @InjectRepository(Flight) private flightRepository: Repository<Flight>
    ) {
        this.log = new Logger('DLMService', { timestamp: true });

        this.dlm = new Redlock([
            new Redis({ host: "172.16.23.81" , port: 6379 }),
            new Redis({ host: "172.16.23.94" , port: 6379 }),
            new Redis({ host: "172.16.23.227", port: 6379 }),
            new Redis({ host: "172.16.23.152", port: 6382 }),
            new Redis({ host: "172.16.23.220", port: 6383 }),
        ], { driftFactor: 0.01, retryCount: 3, retryDelay: 200, retryJitter: 200, automaticExtensionThreshold: 500 });
            
    }

    async bookFlightSeat(flightId: ObjectId, seatNumber: number): Promise<boolean> {
        let lock;
        const isLockAcquired: boolean = await this.dlm.acquire([flightId.toString() + seatNumber.toString()], 60000).then((value) =>{
            lock = value;
            return true;
        }, (reason) => {
            return false;
        });
        if (isLockAcquired === false) {
            this.log.debug(`Tried to acquire the lock of the seat ${seatNumber} of flight ${flightId} while it is already acquired!`);
            return false;
        } 
        let flight: Flight = await this.flightRepository.findOne({ where: { _id: flightId } });

        if (flight.seats[seatNumber] === false) {
            this.log.debug(`Booking flight seat with number ${seatNumber} of flight ${flightId}!`);
            flight.seats[seatNumber] = true;
            this.flightRepository.update({ _id: flightId }, flight).finally(async () => setTimeout(async() => this.dlm.release(await lock), 30000) );
            return true;
        } else {
            
            this.log.debug(`Tried to book an already booked flight seat with number ${seatNumber} of flight ${flightId}!`);
            setTimeout(async () => this.dlm.release(await lock), 30000);
            return false;
          }
    }

}