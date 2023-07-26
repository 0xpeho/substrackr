
import {
  Entity,
  Column,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from "../../user/user.entity";

@Entity({ name: 'notification_tokens' })
export class NotificationToken {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  @ManyToOne(() => User)
  user: User;

  @Column()
  deviceId:string

  @Column()
  notification_token: string;

  @Column({
    nullable: true,
    default: 'ACTIVE',
  })
  status: string;
}
