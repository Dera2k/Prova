import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Professional } from '../professionals/entities/professional.entity';
import { ProfessionalVerificationStatus } from '../common/enums/professional-status.enum';

interface NearbyProfessional {
  id: string;
  userId: string;
  rating: number;
  reviewCount: number;
  distanceMeters: number;
}

@Injectable()
export class LocationsService {
  constructor(@InjectRepository(Professional) private professionals: Repository<Professional>) {}

  async findNearby(serviceId: string, lat: number, lng: number, radiusKm: number, page: number, limit: number): Promise<{ data: NearbyProfessional[]; total: number }> {
    const radiusMeters = radiusKm * 1000;
    const offset = (page - 1) * limit;

    // ST_DWithin filters by radius, ST_Distance orders by proximity - both operate on the geography column, not lat/lng columns directly
    const rows = await this.professionals.query(
      `
      SELECT p.id, p."userId", p.rating, p."reviewCount",
             ST_Distance(p.location, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography) AS "distanceMeters"
      FROM professionals p
      INNER JOIN professional_services ps ON ps."professionalId" = p.id
      WHERE ps."serviceId" = $3
        AND p."verificationStatus" = $4
        AND p."isAvailable" = true
        AND p."isActive" = true
        AND ST_DWithin(p.location, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, $5)
      ORDER BY "distanceMeters" ASC
      LIMIT $6 OFFSET $7
      `,
      [lng, lat, serviceId, ProfessionalVerificationStatus.VERIFIED, radiusMeters, limit, offset],
    );

    const countResult = await this.professionals.query(
      `
      SELECT COUNT(*) as count
      FROM professionals p
      INNER JOIN professional_services ps ON ps."professionalId" = p.id
      WHERE ps."serviceId" = $1
        AND p."verificationStatus" = $2
        AND p."isAvailable" = true
        AND p."isActive" = true
        AND ST_DWithin(p.location, ST_SetSRID(ST_MakePoint($3, $4), 4326)::geography, $5)
      `,
      [serviceId, ProfessionalVerificationStatus.VERIFIED, lng, lat, radiusMeters],
    );

    return { data: rows, total: parseInt(countResult[0].count, 10) };
  }
}