import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "./User";
import { Chat } from "./Chat";

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.sentMessages, { onDelete: "CASCADE" })
  sender!: User; 

  @ManyToOne(() => User, (user) => user.receivedMessages, { onDelete: "CASCADE" })
  receiver!: User; 

  @ManyToOne(() => Chat, (chat) => chat.messages, { onDelete: "CASCADE" })
  chat!: Chat; 

  @Column()
  content!: string; 

  @CreateDateColumn()
  createdAt!: Date; 
}
