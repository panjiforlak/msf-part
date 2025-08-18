import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum enumFormOrderStatus {
  ORDERED = 'ordered',
  PENDING = 'pending',
  PACKING = 'packing',
  INORDER = 'in-order',
  FINISHED = 'finished',
}

@Entity('h_form_order')
export class FormOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'text',
    unique: true,
    nullable: false,
    default: () => "encode(gen_random_bytes(4), 'hex')",
  })
  uuid: string;

  @Column()
  inventory_id: number;

  @Column()
  form_order_number: string;

  @Column()
  quantity: number;

  @Column({
    type: 'enum',
    enum: enumFormOrderStatus,
    default: enumFormOrderStatus.ORDERED,
  })
  status: enumFormOrderStatus;

  @Column()
  createdBy: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  updatedBy: number;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  deletedBy: number;

  @DeleteDateColumn()
  deletedAt: Date;
}
