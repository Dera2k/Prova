import { IsUUID, IsString, IsEnum, IsOptional, Min } from 'class-validator';
import { PricingModel } from '../../common/enums/pricing-model.enum';

export class CreateServiceDto {
  @IsUUID()
  categoryId: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsEnum(PricingModel)
  pricingModel: PricingModel;

  @IsOptional()
  @Min(0)
  startingPrice?: number;
}