import { Expose, Exclude } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
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
  @CreateDateColumn()
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn()
  updatedAt: Date | null;
}
