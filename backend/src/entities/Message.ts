import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { User } from "./User";
import { Chat } from "./Chat";

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  content!: string;

  @Column({ default: false })
  isEdited!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => User, (user) => user.sentMessages, { onDelete: "CASCADE" })
  @JoinColumn({ name: "senderId" })
  sender!: User;

  @ManyToOne(() => User, (user) => user.receivedMessages, { onDelete: "CASCADE", nullable: true })
  @JoinColumn({ name: "receiverId" })
  receiver?: User;

  @ManyToOne(() => Chat, (chat) => chat.messages, { onDelete: "CASCADE" })
  @JoinColumn({ name: "chatId" })
  chat!: Chat;

  @ManyToMany(() => User)
  @JoinTable({
    name: "message_read_by_user",
    joinColumn: { name: "messageId", referencedColumnName: "id" },
    inverseJoinColumn: { name: "userId", referencedColumnName: "id" },
  })
  readBy!: User[];
}