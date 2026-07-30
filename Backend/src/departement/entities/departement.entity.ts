import { Entity, PrimaryGeneratedColumn, Column, OneToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('departements')
export class Departments {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ unique: true })
    nom_departement?: string;

    @OneToOne(() => User,{ nullable: true, onDelete: 'SET NULL' })
    @JoinColumn()
    chef_departement?: User;

    @Column({ nullable: true })
    description?: string;

    @CreateDateColumn()
    date_creation?: Date;

    // @OneToOne(() => User, user => user.department, { onDelete: 'SET NULL' })
    // @Column()
    // userId?: number;

}