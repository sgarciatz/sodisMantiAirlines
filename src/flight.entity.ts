import { Entity, ObjectIdColumn, Column } from 'typeorm';
import { FlightSeats } from './seat.entity';
import { ObjectId } from 'mongodb';

@Entity()
export class Flight {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  origin: string;

  @Column()
  destiny: string;

  @Column()
  takeOffTime: Date;

  @Column()
  landTime: Date;

  @Column((type) => FlightSeats)
  seats: FlightSeats;

  constructor(id, origin, destiny, takeOffTime, landTime, seats) {
    this.id = id;
    this.origin = origin;
    this.destiny = destiny;
    this.takeOffTime = takeOffTime;
    this.landTime = landTime;
    this.seats = seats;
  }
}
