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

@Entity('reloc_outbound')
export class RelocOutbound {
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
  uuid: string;

  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  batch_out_id: number;

  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  reloc_from: number;

  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  reloc_to: number;

  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  quantity: number;

  @ApiProperty()
  @Column({ type: 'int', nullable: true })
  picker_id: number;

  // Audit fields commented out - will be added back once database structure is confirmed
  // @ApiProperty({ required: false })
  // @Column({ name: 'created_by', type: 'int', nullable: true, default: 0 })
  // createdBy: number;

  // @ApiProperty()
  // @CreateDateColumn({ name: 'created_at' })
  // createdAt: Date;

  // @ApiProperty({ required: false })
  // @Column({ name: 'updated_by', type: 'int', nullable: true, default: 0 })
  // updatedBy: number;

  // @ApiProperty({ required: false })
  // @UpdateDateColumn({ name: 'updated_at' })
  // updatedAt: Date;

  // @ApiProperty({ required: false })
  // @Column({ name: 'deleted_by', type: 'int', nullable: true, default: 0 })
  // deletedBy: number;

  // @ApiProperty({ required: false })
  // @DeleteDateColumn({ name: 'deleted_at' })
  // deletedAt: Date;
}
