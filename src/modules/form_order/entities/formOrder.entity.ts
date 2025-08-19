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
  WAITSPV = 'waiting-for-spv',
  WAITPJO = 'waiting-for-pjo',
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
  form_order_number: string;

  @Column({
    type: 'enum',
    enum: enumFormOrderStatus,
    default: enumFormOrderStatus.WAITSPV,
  })
  status: enumFormOrderStatus;

  @Column()
  remarks: string;

  @Column()
  approved_spv: number;

  @Column()
  approved_pjo: number;

  @Column()
  approved_date_spv: Date;

  @Column()
  approved_date_pjo: Date;

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
