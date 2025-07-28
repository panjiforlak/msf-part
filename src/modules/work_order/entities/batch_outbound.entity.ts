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

export enum batchout_type {
  OUTBOUND = 'outbound',
  OTHERS = 'others',
}

@Entity('batch_outbound')
export class BatchOutbound {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({
    type: 'text',
    unique: true,
    nullable: false,
    default: () => "encode(gen_random_bytes(6), 'hex')",
  })
  barcode: string;

  @ApiProperty()
  @Column({
    type: 'text',
    unique: true,
    nullable: false,
    default: () => "encode(gen_random_bytes(6), 'hex')",
  })
  uuid: string;

  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  inventory_id: number;

  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  order_form_id: number;

  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  quantity: number;

  @ApiProperty({ enum: batchout_type })
  @Column({
    type: 'enum',
    enum: batchout_type,
    default: batchout_type.OUTBOUND,
  })
  status: batchout_type;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  remarks: string;

  @ApiProperty()
  @Column({ name: 'createdBy', type: 'int', default: 0 })
  createdBy: number;

  @ApiProperty()
  @CreateDateColumn({ name: 'createdAt', type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty()
  @Column({ name: 'updatedBy', type: 'int', default: 0 })
  updatedBy: number;

  @ApiProperty()
  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamptz', nullable: true })
  updatedAt: Date;

  @ApiProperty()
  @Column({ name: 'deletedBy', type: 'int', default: 0 })
  deletedBy: number;

  @ApiProperty()
  @DeleteDateColumn({ name: 'deletedAt', type: 'timestamptz', nullable: true })
  deletedAt: Date;
}
