import { Entity, ObjectIdColumn, Column, ObjectId } from 'typeorm';

@Entity({database: 'manti', name: 'flights'})
export class Flight {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  origin: string;

  @Column()
  destiny: string;

  @Column()
  takeOffTime: Date;

  @Column()
  landTime: Date;

  @Column()
  seats: boolean[];

  // constructor(id, origin, destiny, takeOffTime, landTime, seats) {
  //   this.id = id;
  //   this.origin = origin;
  //   this.destiny = destiny;
  //   this.takeOffTime = takeOffTime;
  //   this.landTime = landTime;
  //   this.seats = seats;
  // }
}
