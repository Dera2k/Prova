import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UploadsModule } from './uploads/uploads.module';
import { CategoriesModule } from './categories/categories.module';
import { ServicesModule } from './services/services.module';
import { ProfessionalsModule } from './professionals/professionals.module';
import { KycModule } from './kyc/kyc.module';
import { AddressesModule } from './addresses/addresses.module';
import { LocationsModule } from './locations/locations.module';
import { BookingsModule } from './bookings/bookings.module';
import { QuotationsModule } from './quotations/quotations.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    HealthModule,
    AuthModule,
    UsersModule,
    UploadsModule,
    CategoriesModule,
    ServicesModule,
    ProfessionalsModule,
    KycModule,
    AddressesModule,
    LocationsModule,
    BookingsModule,
    QuotationsModule,
  ],
})
export class AppModule {}