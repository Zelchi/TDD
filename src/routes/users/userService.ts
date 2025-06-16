import UserRepository from './userRepository';
import { UserEntity } from './userEntity';
import Token from '../../utils/token';
import Password from '../../utils/password';

class UserService {

    public async GetUserById(id: string): Promise<UserEntity | null> {
        return await UserRepository.findById(id);
    }

    public async LoginUser(email: string, password: string): Promise<{ token: string } | null> {
        try {
            const user = await UserRepository.findByEmail(email);

            if (!user) {
                return null;
            }

            const isPasswordValid = await Password.Compare(password, user.password);

            if (!isPasswordValid) {
                return null;
            }

            const token = Token.Generate({ id: user.id, email: user.email });

            return { token };
        } catch (error) {
            console.error('Error during login:', error);
            return null;
        }
    }

    public async CreateUser(name: string, email: string, password: string): Promise<UserEntity | null> {
        try {
            const hashedPassword = await Password.Hash(password);

            const newUser = new UserEntity(name, email, hashedPassword);
            return await UserRepository.create(newUser);
        } catch (error) {
            console.error('Error creating user:', error);
            return null;
        }
    }

    public async UpdateUser(userData: Partial<UserEntity>): Promise<UserEntity | null> {
        try {
            if (userData.password) {
                userData.password = await Password.Hash(userData.password);
            }

            return await UserRepository.update(userData.id!, userData);
        } catch (error) {
            console.error('Error updating user:', error);
            return null;
        }
    }

    public async DeleteUser(email: string, password: string): Promise<boolean> {
        try {
            if (!password) return false;

            const user = await UserRepository.findByEmail(email);
            if (!user) return false;

            const isPasswordValid = await Password.Compare(password, user.password);
            if (!isPasswordValid) return false;

            await UserRepository.delete(user.id);
            return true;
        } catch (error) {
            console.error('Error deleting user:', error);
            return false;
        }
    }

}

export default new UserService();
export { UserService };