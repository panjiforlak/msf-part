import { Expose, Exclude } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Settings {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column({ unique: true })
  key: string;

  @Expose()
  @Column()
  value: string;

  @Expose()
  @Column()
  isActive?: boolean;
}
