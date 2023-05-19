import { Module } from '@nestjs/common';
import { FlightController } from './flight.controller';
import { FlightService } from './flight.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Flight } from './flight.entity';
import { DataSource } from 'typeorm';
import { DLMService } from './dlm.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      "type": "mongodb",
      "url": "mongodb://localhost:27017",
      "database": "manti",
      "entities": [Flight],
    }),
    TypeOrmModule.forFeature([Flight])
  ],
  controllers: [FlightController],
  providers: [FlightService, DLMService],
})
export class AppModule {
  constructor(private dataSource: DataSource) { 
  }

}
