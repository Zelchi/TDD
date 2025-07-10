import { UserEntity } from "./userEntity";
import { Repository } from "typeorm";
import Database from "../../utils/Database";

class UserRepository {

    private database: Repository<UserEntity>;
    
    constructor(repository: Repository<UserEntity>) {
        this.database = repository;
    }

    public async create(user: UserEntity): Promise<UserEntity> {
        return await this.database.save(user);
    }
    public async findById(id: string): Promise<UserEntity | null> {
        return await this.database.findOneBy({ id });
    }
    public async findByEmail(email: string): Promise<UserEntity | null> {
        return await this.database.findOneBy({ email });
    }
    public async update(id: string, user: Partial<UserEntity>): Promise<UserEntity | null> {
        await this.database.update(id, user);
        return await this.findById(id);
    }
    public async delete(id: string): Promise<void> {
        await this.database.delete(id);
    }

}

export default new UserRepository(Database.DataSource().getRepository(UserEntity));