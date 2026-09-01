import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressesService {
  constructor(@InjectRepository(Address) private addresses: Repository<Address>) {}

  async findAll(userId: string): Promise<Address[]> {
    return this.addresses.find({ where: { userId } });
  }

  async create(userId: string, dto: CreateAddressDto): Promise<Address> {
    const address = this.addresses.create({ ...dto, userId });
    return this.addresses.save(address);
  }

  async update(userId: string, id: string, dto: UpdateAddressDto): Promise<Address> {
    const address = await this.addresses.findOne({ where: { id, userId } });
    if (!address) {
      throw new NotFoundException('Address not found');
    }
    Object.assign(address, dto);
    return this.addresses.save(address);
  }

  async remove(userId: string, id: string): Promise<void> {
    const result = await this.addresses.delete({ id, userId });
    if (result.affected === 0) {
      throw new NotFoundException('Address not found');
    }
  }
}