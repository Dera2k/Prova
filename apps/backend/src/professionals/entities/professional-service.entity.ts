import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('professional_services')
export class ProfessionalService {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  professionalId: string;

  @Column({ type: 'uuid' })
  serviceId: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}