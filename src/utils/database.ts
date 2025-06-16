import { DataSource } from "typeorm";
import { UserEntity } from "../routes/users/userEntity";

export class Database {
    private dataSource: DataSource;

    public constructor() {
        this.dataSource = new DataSource({
            type: "sqlite",
            database: "db.sqlite",
            entities: [UserEntity],
            synchronize: true,
        });
    }

    public DataSource(): DataSource {
        return this.dataSource;
    }

    public async Initialize(): Promise<void> {
        try {
            await this.dataSource.initialize();
            console.log("Data Source iniciou com sucesso!");
        } catch (error) {
            console.error("Erro durante a inicialização do Data base:", error);
        }
    }
}

export default new Database();