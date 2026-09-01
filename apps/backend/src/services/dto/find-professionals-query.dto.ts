import { IsNumber, IsOptional, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindProfessionalsQueryDto {
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  lat: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  lng: number;

  @Transform(({ value }) => (value ? parseInt(value, 10) : 10))
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(50)
  radius?: number;

  @Transform(({ value }) => (value ? parseInt(value, 10) : 1))
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @Transform(({ value }) => (value ? parseInt(value, 10) : 20))
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;
}
