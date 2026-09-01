import { IsNumber, Min } from 'class-validator';

export class UpdateCategoryFeeDto {
  @IsNumber()
  @Min(0)
  inspectionFee: number;
}