import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('inventory')
export class Inventory {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'uuid', default: () => 'gen_random_uuid()', unique: true })
  uuid: string;

  @ApiProperty({ required: false })
  @Column({ type: 'varchar', length: 30, nullable: true, unique: true })
  inventory_code: string;

  @ApiProperty({ required: false })
  @Column({ type: 'varchar', length: 30, nullable: true, unique: true })
  inventory_internal_code: string;

  @ApiProperty({ required: false })
  @Column({ type: 'varchar', length: 65, nullable: true })
  inventory_name: string;

  @ApiProperty()
  @Column()
  component_id: number;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  weight: number;

  @ApiProperty({ required: false })
  @Column({ type: 'varchar', length: 30, nullable: true })
  uom: string;

  @ApiProperty()
  @Column({ name: 'quantity', type: 'int', nullable: true, default: 0 })
  quantity: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  remarks: string;

  @ApiProperty({ required: false })
  @Column({ name: 'createdBy', type: 'int', nullable: true, default: 0 })
  createdBy: number;

  @ApiProperty()
  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @ApiProperty({ required: false })
  @Column({ name: 'updatedBy', type: 'int', nullable: true, default: 0 })
  updatedBy: number;

  @ApiProperty({ required: false })
  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @ApiProperty({ required: false })
  @Column({ name: 'deletedBy', type: 'int', nullable: true, default: 0 })
  deletedBy: number;

  @ApiProperty({ required: false })
  @DeleteDateColumn({ name: 'deletedAt' })
  deletedAt: Date;
}
