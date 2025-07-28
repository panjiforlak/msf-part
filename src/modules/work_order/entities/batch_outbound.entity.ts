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

  // Audit fields commented out - will be added back once database structure is confirmed
  // @ApiProperty()
  // @Column({ name: 'created_by', type: 'int', default: 0 })
  // createdBy: number;

  // @ApiProperty()
  // @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  // createdAt: Date;

  // @ApiProperty()
  // @Column({ name: 'updated_by', type: 'int', default: 0 })
  // updatedBy: number;

  // @ApiProperty()
  // @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', nullable: true })
  // updatedAt: Date;

  // @ApiProperty()
  // @Column({ name: 'deleted_by', type: 'int', default: 0 })
  // deletedBy: number;

  // @ApiProperty()
  // @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  // deletedAt: Date;
} 