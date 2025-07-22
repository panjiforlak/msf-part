import { Exclude, Expose } from 'class-transformer';
import { Roles } from '../../roles/entities/roles.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Users {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column({ unique: true })
  username: string;

  @Exclude()
  @Column()
  password: string;

  @Expose()
  @Column()
  name: string;

  @Expose()
  @Column()
  roleId: number;

  @Expose()
  @Column()
  email: string;

  @Expose()
  @Column()
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  resetPasswordToken?: string;
  resetPasswordExpires?: Date;

  @Expose()
  @ManyToOne(() => Roles, (role) => role.users)
  @JoinColumn({ name: 'roleId' })
  roles?: Roles;
}
