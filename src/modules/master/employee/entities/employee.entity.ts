import { Expose, Exclude } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { Users } from '../../../users/entities/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';

export enum EmploymentStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  RESIGNED = 'resigned',
  ONLEAVE = 'onleave',
}
@Entity()
export class Employee {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column()
  nip?: string;

  @Expose()
  @Column()
  first_name?: string;

  @Expose()
  @Column()
  last_name?: string;

  @Expose()
  @Column()
  division?: string;

  @Expose()
  @Column()
  position?: string;

  @Expose()
  @Column()
  sallary?: string;

  @Column({
    type: 'enum',
    enum: EmploymentStatus,
    default: EmploymentStatus.ACTIVE,
  })
  status: EmploymentStatus;

  @Exclude()
  @Column()
  createdBy?: number;

  @Exclude()
  @CreateDateColumn()
  createdAt: Date;

  @Exclude()
  @Column()
  updatedBy?: number;

  @Exclude()
  @UpdateDateColumn()
  updatedAt: Date | null;

  @Exclude()
  @Column({ type: 'int', nullable: true })
  deletedBy?: number | null;

  @Exclude()
  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany(() => Users, (user) => user.employees)
  users?: Users[];
}
