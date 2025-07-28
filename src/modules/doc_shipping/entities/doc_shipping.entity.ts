import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('doc_shipping')
export class DocShipping {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid', default: () => 'gen_random_uuid()', unique: true })
  uuid: string;

  @Column({ type: 'varchar', length: 35 })
  doc_ship_no: string;

  @Column({ type: 'varchar', length: 255 })
  doc_ship_photo?: string;

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
