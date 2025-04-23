import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from "typeorm";
import { User } from "./User";
import { Chat } from "./Chat";

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.sentMessages, { onDelete: "CASCADE" })
  sender!: User;

  @ManyToOne(() => User, (user) => user.receivedMessages, {
    onDelete: "CASCADE",
  })
  receiver!: User;

  @ManyToOne(() => Chat, (chat) => chat.messages, { onDelete: "CASCADE" })
  @JoinColumn({ name: "chatId" })
  chat!: Chat;

  @Column()
  content!: string;

  @Column({ default: false })
  isRead!: boolean;

  @Column({ default: false })
  isEdited!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}
