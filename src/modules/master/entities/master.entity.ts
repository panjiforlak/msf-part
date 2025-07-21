import { Expose, Exclude, Type } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Categories } from './category.entity';

@Entity()
export class Items {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @Exclude()
  @Column()
  category_id: number;

  @Expose()
  @Column()
  title: string;

  @Expose()
  @Column()
  description: string;

  @Expose()
  @Column()
  icon: string;

  @Expose()
  @Column()
  link: string;

  @Exclude()
  @CreateDateColumn()
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn()
  updatedAt: Date | null;

  @ManyToOne(() => Categories, (category) => category.items)
  @JoinColumn({ name: 'category_id' })
  category?: Categories;
}
