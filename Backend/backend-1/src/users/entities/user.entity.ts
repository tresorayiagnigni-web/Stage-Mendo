import { Entity, PrimaryGeneratedColumn, Column, OneToMany,ManyToOne, UpdateDateColumn, CreateDateColumn } from 'typeorm';
import { Role } from '../../auth/enums/role.enum';
import { Task } from '../../tasks/entities/task.entity';
import { Departments } from '../../departement/entities/departement.entity';
import { Token } from '../../auth/entities/token.entity';



@Entity('users')
export class User {

  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  nom?: string;

  @Column({ unique: true })
  email?: string;

  @Column({ select: false })
  password?: string;

  @Column()
  departement?: string;

  @Column()
  telephone?: string;


  @UpdateDateColumn({ type: 'timestamp' })  

  @CreateDateColumn()
  createdAt?: Date;

  @Column({ default: true })
  status?: boolean;

  // @Column()
  // externalAccessToken?: string;

  // @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIME'})
  // updateAt?: Date;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.EMPLOYER,
  })
  role?: Role;

  @OneToMany(() => Task, (task) => task.user)
  tasks?: Task[];

  // @OneToMany(() => Token, (token) => token.user)
  // tokens?: Token[];

}