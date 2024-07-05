import { Password } from 'src/modules/passwords/entities/password.entity';
import { Profile } from 'src/modules/profiles/entities/profile.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  /**
   * this decorator will help to auto generate id for the table.
   */
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @OneToOne(() => Password, (password) => password.user) // specify inverse side as a second parameter)
  @JoinColumn()
  password: Password;

  @OneToOne(() => Profile, (profile) => profile.user) // specify inverse side as a second parameter
  @JoinColumn()
  profile: Profile;

  @CreateDateColumn()
  created_at: Date; // Creation date

  @UpdateDateColumn()
  updated_at: Date; // Last updated date

  @DeleteDateColumn()
  deleted_at: Date; // Deletion date - when soft delete is enable

  @Column({ type: 'varchar', length: 30 })
  first_name: string;

  @Column({ type: 'varchar', length: 30 })
  last_name: string;

  @Column({ type: 'varchar', length: 40 })
  email: string;

  @Column({ type: 'boolean', default: false })
  is_verified: boolean = false;
}
