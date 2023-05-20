import { Timestamp } from 'mongodb';
import { Entity, ObjectIdColumn, Column, ObjectId, CreateDateColumn } from 'typeorm';

@Entity({database: 'manti', name: 'bookings'})
export class Booking {

    @ObjectIdColumn()
    _id: ObjectId;

    @Column()
    bookingTime: Date; 

    @ObjectIdColumn()
    userId: ObjectId;

    @ObjectIdColumn()
    flightId: ObjectId;

    @Column()
    seatNumber: number;
}
