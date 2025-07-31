import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('sppb')
export class Sppb {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'text',
    unique: true,
    nullable: false,
    default: () => "encode(gen_random_bytes(6), 'hex')",
  })
  uuid: string;

  @Column({ type: 'int', default: 0 })
  order_form_id: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  sppb_number: string;

  @Column({ type: 'text', nullable: true })
  mechanic_photo: string | null;

  @Column({ 
    type: 'enum', 
    enum: ['waiting', 'completed'],
    default: 'waiting'
  })
  status: string;

  @Column({ type: 'int', default: 0 })
  createdBy: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'int', default: 0 })
  updatedBy: number;

  @UpdateDateColumn({ type: 'timestamptz', nullable: true })
  updatedAt: Date;

  @Column({ type: 'int', default: 0 })
  deletedBy: number;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt: Date;
} 