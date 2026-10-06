import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('users')
export class User {

  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  full_name?: string;

  @Column({ unique: true })
  email?: string;

  @Column()
  password?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  avatar?: string | null;

  @Column({ default: 'TENANT' })
  role?: string;

  @Column({ default: true })
  status?: boolean;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  telegram_id?: string | null;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  created_at?: Date;

  @Column({
    type: 'timestamp',
    nullable: true
  })
  updated_at?: Date;

  @Column({
    type: 'text',
    nullable: true,
  })
  fcm_token!: string | null;

  @Column()
  refresh_token?: string;

}