import { Entity, Column, PrimaryGeneratedColumn, Index, CreateDateColumn } from 'typeorm';
import { BaseEntity } from './baseEntity';

@Entity('tokens')
export class Token extends BaseEntity {
  @Column()
  @Index()
  userId?: number;

  @Column({ length: 500 })
  accessToken?: string;

  // @Column({ type: 'timestamp', nullable: false })
  // expire_le?: Date;

  @Column({
  type: 'datetime',
  default: () => 'CURRENT_TIMESTAMP'
  })
  expire_le?: Date;

  @Column({
    type: 'boolean',
    default: true,
  })
  status?: boolean;


}