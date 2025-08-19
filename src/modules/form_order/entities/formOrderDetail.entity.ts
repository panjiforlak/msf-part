import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('r_form_order_detail')
export class FormOrderDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fo_id: number;

  @Column()
  inventory_id: number;

  @Column()
  quantity: number;

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
