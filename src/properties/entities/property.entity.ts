import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity('properties')
export class Property {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  owner_id!: number;

  @Column()
  title!: string;

  @Column('text')
  description!: string;

  @Column()
  property_type!: string;

  @Column()
  address!: string;

  @Column()
  city!: string;

  @Column()
  province!: string;

  @Column()
  country!: string;

  @Column('decimal')
  latitude!: number;

  @Column('decimal')
  longitude!: number;

  @Column('decimal')
  price!: number;

  @Column()
  bedrooms!: number;

  @Column()
  bathrooms!: number;

  @Column('decimal')
  area!: number;

  @Column()
  property_code!: string;

  @Column({
    nullable: true,
  })
  image?: string;

  @Column({
    default: 'available',
  })
  availability_status!: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at!: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at!: Date;
}