import "reflect-metadata";
import { DataSource } from "typeorm";
import { Postagem } from "./Postagem";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "seu_usuario",
    password: "sua_senha",
    database: "socialifpi",
    synchronize: true, // use com cuidado em produção
    logging: false,
    entities: [Postagem],
    migrations: [],
    subscribers: [],
});
