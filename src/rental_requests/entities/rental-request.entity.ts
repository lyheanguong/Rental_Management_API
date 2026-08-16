import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('rental_requests')
export class RentalRequest {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  property_id?: number;

  @Column()
  tenant_id?: number;

  @Column({
    type: 'date',
  })
  start_date?: Date;

  @Column({
    type: 'date',
  })
  end_date?: Date;

  @Column({
    type: 'text',
  })
  message?: string;

  @Column({
    type: 'varchar',
    length: 20,
  })
  status?: string;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}