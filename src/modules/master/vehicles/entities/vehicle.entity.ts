import { Expose, Exclude } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
export class Vehicles {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column()
  vin_number: string;

  @Expose()
  @Column()
  vehicle_number: string;

  @Expose()
  @Column()
  brand: string;

  @Expose()
  @Column()
  type: string;

  @Expose()
  @Column()
  capacity_ton: string;

  @Expose()
  @Column()
  status: string;

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
  @Column()
  deletedBy?: number;

  @Exclude()
  @DeleteDateColumn()
  deletedAt?: Date | null;
}
