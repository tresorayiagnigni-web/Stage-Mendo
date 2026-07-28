import { Entity, PrimaryGeneratedColumn, Column, OneToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('departements')
export class Departments {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ unique: true })
    nom_departement?: string;

    @OneToOne(() => User, user => user.departement, { onDelete: 'SET NULL' })
    @JoinColumn()
    chef_departement?: string;

    @Column({ nullable: true })
    description?: string;

    @CreateDateColumn()
    date_creation?: Date;

    // @OneToOne(() => User, user => user.department, { onDelete: 'SET NULL' })
    // @Column()
    // userId?: number;

}