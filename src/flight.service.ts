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
    return await this.flightRepository.find();
  }

  async getFlight(flight_id: ObjectId): Promise<Flight> {
    return await this.flightRepository.findOne({where: {_id: flight_id}});
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
