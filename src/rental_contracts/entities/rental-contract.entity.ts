import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity('rental_contracts')
export class RentalContract {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'integer',
    nullable: true,
  })
  request_id?: number | null;

  @Column({
    type: 'integer',
    nullable: false,
  })
  property_id!: number;

  @Column({
    type: 'integer',
    nullable: false,
  })
  tenant_id!: number;

  @Column({
    type: 'integer',
    nullable: false,
  })
  owner_id!: number;

  @Column({
    type: 'date',
  })
  start_date!: Date;

  @Column({
    type: 'date',
  })
  end_date!: Date;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  monthly_price!: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  deposit_amount!: number;

  @Column({
    type: 'varchar',
    length: 20,
  })
  status!: string;

  @CreateDateColumn({
    type: 'timestamp',
  })
  created_at!: Date;
}