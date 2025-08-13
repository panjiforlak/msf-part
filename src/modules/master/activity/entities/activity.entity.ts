import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export enum EnumCategory {
  BREAKDOWN = 'breakdown',
  WORKING = 'working',
  DELAY = 'delay',
}

@Entity('m_activities')
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({
    type: 'enum',
    enum: EnumCategory,
    default: EnumCategory.BREAKDOWN,
  })
  category: EnumCategory;

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
