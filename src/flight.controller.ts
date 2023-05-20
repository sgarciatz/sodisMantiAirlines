import { ConsoleLogger, Controller, Get, Logger, Param, Post, Query } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { FlightService } from './flight.service';
import { Flight } from './flight.entity';
import { DLMService } from './dlm.service';

@Controller('flights')
export class FlightController {
  public log: Logger;
  constructor(private readonly appService: FlightService, private readonly dlmService: DLMService) {
    this.log = new Logger('AppController', { timestamp: true });

  }

  @Get()
  async getFlights(): Promise<Flight[]> {
    return await this.appService.getFlights();;
  }

  @Get(':id')
  async getFlight(@Param('id') flight_id): Promise<Flight> {
    return await this.appService.getFlight(new ObjectId(flight_id));
  }

  @Get(':id/book/:seat')
  async holdFlightSeat(@Param('id') flight_id, @Param('seat') seatNumber, @Query('userid') userId): Promise<boolean> {    
    return await this.dlmService.holdFlightSeat(new ObjectId(flight_id), seatNumber, userId);
  }

  @Post(':id/book/:seat')
  async bookFlightSeat(@Param('id') flight_id, @Param('seat') seatNumber, @Query('userid') userId): Promise<boolean> {
    return await this.dlmService.bookFlightSeat(new ObjectId(flight_id), seatNumber, userId);
  }
}
