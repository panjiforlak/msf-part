import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('items_spnum_log')
export class ItemsSpnumLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'item_id', type: 'int', default: 0 })
  item_id: number;

  @Column({
    name: 'inventory_code_old',
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  inventory_code_old?: string;

  @Column({
    name: 'inventory_code_new',
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  inventory_code_new?: string;

  @Column({ name: 'updatedBy', type: 'int', default: 0 })
  updatedBy: number;

  @UpdateDateColumn({ name: 'updatedAt', type: 'timestamptz' })
  updatedAt: Date;

  @Column({ name: 'deletedBy', type: 'int', default: 0 })
  deletedBy: number;

  @DeleteDateColumn({ name: 'deletedAt', type: 'timestamptz', nullable: true })
  deletedAt?: Date;
}
