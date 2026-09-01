import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ProfessionalVerificationStatus } from '../../common/enums/professional-status.enum';

@Entity('professionals')
export class Professional {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  userId: string;

  @Column({ type: 'text', nullable: true })
  bio: string | null;

  @Column({ type: 'int', default: 0 })
  yearsOfExperience: number;

  @Column({ type: 'enum', enum: ProfessionalVerificationStatus, default: ProfessionalVerificationStatus.PENDING })
  verificationStatus: ProfessionalVerificationStatus;

  @Column({ type: 'boolean', default: false })
  isAvailable: boolean;

  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true })
  latitude: number | null;

  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true })
  longitude: number | null;

  // PostGIS geography column, kept in sync with latitude/longitude via service layer
  @Column({ type: 'geography', spatialFeatureType: 'Point', srid: 4326, nullable: true })
  location: string | null;

  @Column({ type: 'int', default: 10 })
  serviceRadiusKm: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ type: 'int', default: 0 })
  reviewCount: number;

  @Column({ type: 'int', nullable: true })
  responseTimeMinutes: number | null;

  @Column({ type: 'int', default: 0 })
  noShowCount: number;

  @Column({ type: 'varchar', nullable: true })
  bankCode: string | null;

  @Column({ type: 'varchar', nullable: true })
  bankAccountNumber: string | null;

  @Column({ type: 'varchar', nullable: true })
  bankAccountName: string | null;

  @Column({ type: 'varchar', nullable: true })
  paystackRecipientCode: string | null;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}