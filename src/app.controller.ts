import { ConsoleLogger, Controller, Get, Logger, Param } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { AppService } from './app.service';
import { Flight } from './flight.entity';

@Controller('flights')
export class AppController {
  public log: Logger;

  constructor(private readonly appService: AppService) {
    this.log = new Logger('AppController', { timestamp: true });
  }

  @Get()
  getFlights(): Array<Flight> {
    return this.appService.getFlights();
  }

  @Get(':id')
  getFlight(@Param('id') flight_id) {
    this.log.log(`Searching flight ${flight_id}`);

    return this.appService.getFlight(new ObjectId(flight_id));
  }
}
