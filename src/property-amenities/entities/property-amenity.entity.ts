import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';



@Entity('property_amenities')
export class PropertyAmenity {


  @PrimaryGeneratedColumn()
  id!: number;



  @Column()
  property_id!: number;



  @Column()
  amenity_id!: number;



  @Column({
    type:'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  created_at!: Date;


}