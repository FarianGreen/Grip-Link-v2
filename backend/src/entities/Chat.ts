import { Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany } from "typeorm";
import { User } from "./User";
import { Message } from "./Message";

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToMany(() => User)
  @JoinTable()
  users!: User[];

  @OneToMany(() => Message, (message) => message.chat)
  messages!: Message[]; 
}