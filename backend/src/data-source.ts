import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DATABASE_HOST ,
  port: Number(process.env.DATABASE_PORT) ,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: false,
  logging: true,
  entities: ["src/entities/**/*.ts"],
  migrations: ["src/migrations/**/*.ts"],
  subscribers: [],
});
console.log("Connecting to DB:", process.env.DATABASE_NAME);
AppDataSource.initialize()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch((error) => console.error("❌ Error connecting to DB:", error));

export default AppDataSource;
