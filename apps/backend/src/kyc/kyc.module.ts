import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KycController } from './kyc.controller';
import { KycService } from './kyc.service';
import { KycDocument } from './entities/kyc-document.entity';
import { Professional } from '../professionals/entities/professional.entity';

@Module({
  imports: [TypeOrmModule.forFeature([KycDocument, Professional])],
  controllers: [KycController],
  providers: [KycService],
  exports: [KycService],
})
export class KycModule {}