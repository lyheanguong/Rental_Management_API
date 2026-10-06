import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  property_id?: number;

  @Column()
  user_id?: number;

  @Column()
  username?: string;

  @Column('int')
  rating?: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  title?: string;

  @Column({
    type: 'text',
  })
  comment?: string;

  @CreateDateColumn({
    type: 'timestamp',
  })
  created_at?: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at?: Date;
}