import { DataSource } from "typeorm"
import { config } from "dotenv"

config();

export default new DataSource({
    type: "postgres",
    host: process.env.HOST_DB,
    port: parseInt(process.env.PORT_DB || "5432", 10),
    username: process.env.USER_DB,
    password: process.env.PASSWORD_DB,
    database: process.env.NAME_DB,
    entities: ['src/**/*.entity.ts'],
    migrations: ['src/database/migrations/*.ts'],
    synchronize: false,
})