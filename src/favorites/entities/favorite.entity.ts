import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';



@Entity('favorites')
export class Favorite {


  @PrimaryGeneratedColumn()
  id!: number;



  @Column()
  user_id!: number;



  @Column()
  property_id!: number;



  @Column({
    type:'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  created_at!: Date;


}