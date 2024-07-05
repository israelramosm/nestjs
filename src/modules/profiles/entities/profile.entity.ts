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
export class Profile {
  /**
   * this decorator will help to auto generate id for the table.
   */
  @PrimaryGeneratedColumn('uuid')
  profile_id: string;

  @OneToOne(() => User, (user) => user.profile) // specify inverse side as a second parameter
  user: User;

  @CreateDateColumn()
  created_at: Date; // Creation date

  @UpdateDateColumn()
  updated_at: Date; // Last updated date

  @DeleteDateColumn()
  deleted_at: Date; // Deletion date - when soft delete is enable

  @Column({ type: 'varchar' })
  username: string;

  @Column({ type: 'varchar', nullable: true })
  photo_url: string;

  @Column({ type: 'enum', enum: ['m', 'f', 'u'], nullable: true })
  gender!: string;

  @Column({ type: 'date', nullable: true })
  birthday: string;
}
