import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Password {
  /**
   * this decorator will help to auto generate id for the table.
   */
  @PrimaryGeneratedColumn('uuid')
  password_id: string;

  @OneToOne(() => User, (user) => user.password) // specify inverse side as a second parameter
  user: User;

  @CreateDateColumn()
  created_at: Date; // Creation date

  @UpdateDateColumn()
  updated_at: Date; // Last updated date

  @DeleteDateColumn()
  deleted_at: Date; // Deletion date - when soft delete is enable

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'integer', nullable: true })
  reset_password_code: number;
}
