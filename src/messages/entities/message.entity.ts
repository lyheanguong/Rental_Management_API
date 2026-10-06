import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
} from 'typeorm';

@Entity('messages')
export class Message {

    @PrimaryGeneratedColumn()
    id?: number;

    @Column()
    sender_id?: number;

    @Column()
    receiver_id?: number;

    @Column({
        type: 'text',
    })
    message?: string;

    @Column({
        default: false,
    })
    is_read?: boolean;

    @CreateDateColumn()
    created_at?: Date;
}   