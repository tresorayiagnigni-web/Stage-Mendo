import { Entity, Column, PrimaryGeneratedColumn, Index, CreateDateColumn } from 'typeorm';

@Entity('tokens')
export class Token {
  @PrimaryGeneratedColumn()
  id?: number;

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

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  cree_le?: Date;
}