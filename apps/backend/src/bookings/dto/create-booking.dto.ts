import { IsUUID, IsString, MaxLength, IsArray, IsOptional, IsISO8601, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAddressDto } from '../../addresses/dto/create-address.dto';

class AttachmentDto {
  @IsString()
  url: string;

  @IsString()
  type: 'image' | 'video';
}

export class CreateBookingDto {
  @IsUUID()
  professionalId: string;

  @IsUUID()
  serviceId: string;

  @IsString()
  @MaxLength(1000)
  description: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  attachmentUrls: AttachmentDto[];

  @IsOptional()
  @IsUUID()
  addressId?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  newAddress?: CreateAddressDto;

  @IsOptional()
  @IsISO8601()
  scheduledFor?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}