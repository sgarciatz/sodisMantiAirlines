import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId, Timestamp } from 'mongodb';
import { Repository } from 'typeorm';
import { Booking } from './booking.entity';

@Injectable()
export class BookingsService {
    constructor(
        @InjectRepository(Booking) private bookingRepository: Repository<Booking>
    ) { }
    
    async writeBooking(userId: ObjectId, flightId: ObjectId, seatNumber: number) {
        
        this.bookingRepository.insert({
            userId: userId.toString(),
            flightId: flightId,
            seatNumber: seatNumber,
            bookingTime: new Date()
        })
    }
}
