import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  label: string;

  @IsString()
  street: string;

  @IsString()
  area: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsOptional()
  @IsString()
  instructions?: string;
}