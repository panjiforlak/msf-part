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
export class Suppliers {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column({ type: 'uuid', default: () => 'gen_random_uuid()' })
  uuid: string;

  @Expose()
  @Column()
  item_id?: number;

  @Expose()
  @Column()
  supplier_name?: string;

  @Expose()
  @Column()
  supplier_address?: string;

  @Expose()
  @Column()
  remarks?: string;

  @Exclude()
  @Column()
  createdBy?: number;

  @Exclude()
  @CreateDateColumn()
  createdAt?: Date;

  @Exclude()
  @Column()
  updatedBy?: number;

  @Exclude()
  @UpdateDateColumn()
  updatedAt?: Date | null;

  @Exclude()
  @Column({ type: 'int', nullable: true })
  deletedBy?: number | null;

  @Exclude()
  @DeleteDateColumn()
  deletedAt?: Date | null;
}
