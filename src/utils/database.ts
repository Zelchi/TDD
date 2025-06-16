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
            console.log("Database connection established successfully.");
        } catch (error) {
            console.error("Error during Data Source initialization:", error);
        }
    }
}

export default new Database();