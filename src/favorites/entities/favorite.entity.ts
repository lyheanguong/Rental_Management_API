import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Unique,
} from 'typeorm';

@Entity('favorites')
@Unique(['user_id', 'property_id'])
export class Favorite {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  user_id?: number;

  @Column()
  property_id?: number;

  @CreateDateColumn()
  created_at?: Date;
}