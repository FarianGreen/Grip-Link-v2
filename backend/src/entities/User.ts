import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

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
  
  @Column({ nullable: true })
  refreshToken?: string;

  @Column({ type: "enum", enum: ["user", "admin"], default: "user" })
  role!: "user" | "admin";
}
