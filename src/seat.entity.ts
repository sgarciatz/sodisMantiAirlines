import { ObjectId, ObjectIdColumn, Column } from 'typeorm';

export class FlightSeats {
  @Column()
  seat1: boolean;

  @Column()
  seat2: boolean;

  @Column()
  seat3: boolean;

  @Column()
  seat4: boolean;

  @Column()
  seat5: boolean;

  @Column()
  seat6: boolean;

  @Column()
  seat7: boolean;

  @Column()
  seat8: boolean;

  @Column()
  seat9: boolean;

  @Column()
  seat10: boolean;

  constructor(
    seat1: boolean,
    seat2: boolean,
    seat3: boolean,
    seat4: boolean,
    seat5: boolean,
    seat6: boolean,
    seat7: boolean,
    seat8: boolean,
    seat9: boolean,
    seat10: boolean,
  ) {
    this.seat1 = seat1;
    this.seat2 = seat2;
    this.seat3 = seat3;
    this.seat4 = seat4;
    this.seat5 = seat5;
    this.seat6 = seat6;
    this.seat7 = seat7;
    this.seat8 = seat8;
    this.seat9 = seat9;
    this.seat10 = seat10;
  }
}
