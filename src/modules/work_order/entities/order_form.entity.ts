import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum WorkOrderStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'on progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REJECTED = 'rejected',
}

export enum OrderType {
  SPAREPART = 'sparepart',
  NON_SPAREPART = 'non sparepart',
}

@Entity('order_form')
export class OrderForm {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  // @ApiProperty()
  // @Column({ type: 'uuid', default: () => 'gen_random_uuid()', unique: true })
  // uuid: string;

  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  vehicle_id: number;

  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  admin_id: number;

  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  driver_id: number;

  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  mechanic_id: number;

  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  picker_id: number;

  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  request_id: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  departement: string;

  @ApiProperty()
  @Column({ type: 'text' })
  remark: string;

  @ApiProperty({ enum: OrderType })
  @Column({
    type: 'enum',
    enum: OrderType,
    default: OrderType.SPAREPART,
  })
  order_type: OrderType;

  @ApiProperty()
  @Column({ type: 'timestamptz' })
  start_date: Date;

  @ApiProperty({ required: false })
  @Column({ type: 'timestamptz', nullable: true })
  end_date: Date | null;

  @ApiProperty({ enum: WorkOrderStatus })
  @Column({
    type: 'enum',
    enum: WorkOrderStatus,
    default: WorkOrderStatus.PENDING,
  })
  status: WorkOrderStatus;

  @ApiProperty()
  @Column({ name: 'createdby', type: 'int', default: 0 })
  createdBy: number;

  @ApiProperty()
  @CreateDateColumn({ name: 'createdat', type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty()
  @Column({ name: 'updatedby', type: 'int', default: 0 })
  updatedBy: number;

  @ApiProperty()
  @UpdateDateColumn({ name: 'updatedat', type: 'timestamptz', nullable: true })
  updatedAt: Date;

  @ApiProperty()
  @Column({ name: 'deletedby', type: 'int', default: 0 })
  deletedBy: number;

  @ApiProperty()
  @DeleteDateColumn({ name: 'deletedat', type: 'timestamptz', nullable: true })
  deletedAt: Date;

  @ApiProperty()
  @Column({ name: 'approval_by', type: 'int', nullable: true })
  approvalBy: number | null;

  @ApiProperty()
  @Column({ name: 'approval_at', type: 'timestamptz', nullable: true })
  approvalAt: Date | null;

  @ApiProperty()
  @Column({ name: 'approval_remark', type: 'text', nullable: true })
  approvalRemark: string | null;
}
