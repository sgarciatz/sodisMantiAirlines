import { Module } from '@nestjs/common';
import { FlightController } from './flight.controller';
import { FlightService } from './flight.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Flight } from './flight.entity';
import { DataSource } from 'typeorm';
import { DLMService } from './dlm.service';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { BookingsModule } from './bookings/bookings.module';
import { Booking } from './bookings/booking.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      "type": "mongodb",
      "url": "mongodb://localhost:27017",
      "database": "manti",
      "entities": [Flight, User, Booking],
    }),
    TypeOrmModule.forFeature([Flight, User, Booking]),
    UsersModule,
    BookingsModule,
    
  ],
  controllers: [FlightController, UsersController],
  providers: [FlightService, DLMService, UsersService],
})
export class AppModule {
  constructor(private dataSource: DataSource) { 
  }

}
