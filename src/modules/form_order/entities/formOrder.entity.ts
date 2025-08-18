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

  @ApiProperty({
    description: 'ID inventory yang terkait dengan form order',
    example: 1,
  })
  @Column()
  inventory_id: number;

  @ApiProperty({
    description: 'Nomor form order',
    example: 'IN-1HGBH41JXMN1918',
  })
  @Column()
  form_order_number: string;

  @ApiProperty({
    description: 'Jumlah item yang dipesan',
    example: 10,
  })
  @Column()
  quantity: number;

  @ApiProperty({
    description: 'Status dari form order',
    example: 'ENUM => ordered | pending | packing | in-order | finished',
  })
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
