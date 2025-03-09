import { Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany } from "typeorm";
import { User } from "./User";
import { Message } from "./Message";

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToMany(() => User, (user) => user.chats, { cascade: true })
  @JoinTable()
  users!: User[];

  @OneToMany(() => Message, (message) => message.chat, { cascade: true })
  messages!: Message[];
}