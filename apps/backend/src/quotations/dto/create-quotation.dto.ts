import { IsNumber, Min, IsOptional, IsString } from 'class-validator';

export class CreateQuotationDto {
  @IsNumber()
  @Min(0)
  labourCost: number;

  @IsNumber()
  @Min(0)
  materialsCost: number;

  @IsNumber()
  @Min(0)
  serviceFee: number;

  @IsOptional()
  @IsString()
  notes?: string;
}