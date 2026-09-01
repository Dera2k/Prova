import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('professional_availability')
export class ProfessionalAvailability {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  professionalId: string;

  @Column({ type: 'int' })
  dayOfWeek: number;

  @Column({ type: 'varchar' })
  startTime: string;

  @Column({ type: 'varchar' })
  endTime: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  acceptUrgentNightCallouts: boolean;
}