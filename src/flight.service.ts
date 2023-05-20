import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';
import { Repository } from 'typeorm';
import { Flight } from './flight.entity';

@Injectable()
export class FlightService {
  public log: Logger;

  constructor(
    @InjectRepository(Flight) private flightRepository: Repository<Flight>,
  ) {
    this.log = new Logger('AppController', { timestamp: true });
  }

  async getFlights(): Promise<Flight[]> {
    let flights = (await this.flightRepository.find()).map(flight => {
      return {
        _id: flight['_id'],
        origin: flight['origin'],
        destiny: flight['destiny'],
        landTime: new Date(flight['landTime']['$date']['$numberLong'] * 1),
        takeOffTime: new Date(flight['takeOffTime']['$date']['$numberLong'] * 1),
        seats: flight['seats']
      };
    });
    return flights;
  }

  async getFlight(flight_id: ObjectId): Promise<Flight> {
    let flight = await this.flightRepository.findOne({ where: { _id: flight_id } });
    flight.landTime = new Date(flight['landTime']['$date']['$numberLong'] * 1);
    flight.takeOffTime = new Date(flight['takeOffTime']['$date']['$numberLong'] * 1);
    return flight;
  }

  async bookFlightSeat(flightId: ObjectId, seatNumber: number): Promise<boolean> {
    let flight: Flight = await this.flightRepository.findOne({ where: { _id: flightId } });

    if (flight.seats[seatNumber] === false) {
      flight.seats[seatNumber] = true;
      this.flightRepository.update({ _id: flightId }, flight);
      return true;
    } else {
      return false;
    }
  }
}
