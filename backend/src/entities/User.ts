import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
} from "typeorm";
import { Message } from "./Message";
import { Chat } from "./Chat";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  passwordHash!: string;

  @Column({ type: "text", nullable: true })
  bio?: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ nullable: true })
  refreshToken?: string;

  @Column({ type: "enum", enum: ["user", "admin"], default: "user" })
  role!: "user" | "admin";

  @OneToMany(() => Message, (message) => message.sender)
  sentMessages!: Message[];

  @OneToMany(() => Message, (message) => message.receiver)
  receivedMessages!: Message[];

  @ManyToMany(() => Chat, (chat) => chat.users)
  chats!: Chat[];
}
