import { Entity, PrimaryGeneratedColumn, Column, OneToOne, CreateDateColumn, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('departements')
export class Departments {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ unique: true })
    nom_departement?: string;

    @OneToOne(() => User,{ nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'chefDepartementId' })
    chef_departement?: User;

    @Column({ nullable: true })
    description?: string;

    @OneToMany(() => User, (user) => user.departement)
    users?: User[];

    @CreateDateColumn()
    date_creation?: Date;

    // @OneToOne(() => User, user => user.department, { onDelete: 'SET NULL' })
    // @Column()
    // userId?: number;

}