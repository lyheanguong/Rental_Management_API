import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
} from 'typeorm';

@Entity('property_images')
export class PropertyImage {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: 'integer',
    })
    property_id!: number;

    @Column({
        type: 'varchar',
    })
    image_url!: string;

    @Column({
        type: 'boolean',
        default: false,
    })
    is_cover!: boolean;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    created_at!: Date;
}