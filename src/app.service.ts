import { Injectable, Logger } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { Flight } from './flight.entity';
import { FlightSeats } from './seat.entity';

@Injectable()
export class AppService {
  public log: Logger;

  public flights: Array<Flight>;
  constructor() {
    this.flights = new Array<Flight>();

    var seats: FlightSeats = new FlightSeats(
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
    );

    this.flights.push(
      new Flight(
        '645536c565a3827e1114d2aa',
        'Madri',
        'Oportinho',
        new Date(),
        new Date(),
        seats,
      ),
    );
    this.flights.push(
      new Flight(
        '645536cc0fec4d611e2d8418',
        'Zevilla',
        'Tenerife',
        new Date(),
        new Date(),
        seats,
      ),
    );

    this.log = new Logger('AppController', { timestamp: true });
  }
  getFlights(): Array<Flight> {
    return this.flights;
  }

  getFlight(flight_id: ObjectId): Flight {
    this.log.log(typeof flight_id);
    return this.flights.find((flight) =>
      flight.id.toString().localeCompare(flight_id.toString()),
    );
  }
}
