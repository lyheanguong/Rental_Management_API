import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  contract_id?: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
  })
  amount?: number;

  @Column({
    type: 'date',
  })
  payment_month?: Date;

  @Column({
    type: 'varchar',
    length: 50,
  })
  payment_method?: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  transaction_reference?: string | null;

  @Column({
    type: 'varchar',
    length: 20,
  })
  status?: string;

  @CreateDateColumn()
  created_at?: Date;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    unique: true,
  })
  invoice_number?: string | null;

  @Column({
    type: 'integer',
    nullable: true,
  })
  tenant_id?: number;

  @Column({
    type: 'integer',
    nullable: true,
  })
  property_id?: number;

  @Column({
    type: 'integer',
    nullable: true,
  })
  owner_id?: number;

  @Column({
    type: 'date',
    nullable: true,
  })
  issue_date?: Date | null;

  @Column({
    type: 'date',
    nullable: true,
  })
  due_date?: Date | null;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    default: 0,
  })
  rent_amount?: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    default: 0,
  })
  electric_amount?: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    default: 0,
  })
  water_amount?: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    default: 0,
  })
  management_fee?: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    default: 0,
  })
  parking_fee?: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    default: 0,
  })
  other_charges?: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    default: 0,
  })
  discount?: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    default: 0,
  })
  subtotal?: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    default: 0,
  })
  total_amount?: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  notes?: string | null;

  @UpdateDateColumn()
  updated_at?: Date;
}