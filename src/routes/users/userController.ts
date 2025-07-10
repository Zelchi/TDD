import { Request, Response } from 'express';
import { UserEntity } from './userEntity';
import UserService from './userService';

class UserController {

    public async Create(req: Request, res: Response) {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                return res.status(400).json({ message: 'Nome, email e senha são obrigatórios' });
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ message: 'Formato de email inválido' });
            }

            const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
            if (!passwordRegex.test(password)) {
                return res.status(400).json({ message: 'Senha muito fraca' });
            }

            console.log('Creating user:', { name, email, password });

            const user = await UserService.CreateUser(name, email, password);

            if (!user) {
                return res.status(400).json({ message: 'Não foi possível criar o usuário' });
            }

            const { password: _, ...userWithoutPassword } = user;
            return res.status(201).json(userWithoutPassword);
        } catch (error) {
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    public async Login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: 'Email e senha são obrigatórios' });
            }

            const loginResult = await UserService.LoginUser(email, password);

            if (!loginResult) {
                return res.status(401).json({ message: 'Credenciais inválidas' });
            }

            return res.status(200).json(loginResult);
        } catch (error) {
            console.error('Login error:', error);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    public async ReadId(req: Request, res: Response) {
        try {
            const { userId } = req.body;

            if (!userId) {
                return res.status(400).json({ message: 'ID é obrigatório' });
            }

            const user = await UserService.GetUserById(userId);

            if (!user) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }

            const { password: _, ...userWithoutPassword } = user;
            return res.status(200).json(userWithoutPassword);
        } catch (error) {
            console.error('Get user error:', error);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    public async Update(req: Request, res: Response) {
        try {
            const { userId, name, email, password } = req.body;

            if (!userId) {
                return res.status(400).json({ message: 'ID é obrigatório' });
            }

            if (!name && !email && !password) {
                return res.status(400).json({ message: 'Dados do usuário são obrigatórios' });
            }

            const userData: Partial<UserEntity> = {
                id: userId,
                name,
                email,
                password
            };

            const updatedUser = await UserService.UpdateUser(userData);
            if (!updatedUser) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }

            const { password: _, ...userWithoutPassword } = updatedUser;
            return res.status(200).json(userWithoutPassword);
        } catch (error) {
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    public async Delete(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: 'Email e senha são obrigatórios' });
            }

            const result = await UserService.DeleteUser(email, password);

            if (!result) {
                return res.status(404).json({ message: 'Usuário não encontrado ou não pode ser excluído' });
            }

            return res.status(204).send();
        } catch (error) {
            console.error('Delete user error:', error);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

}

export default new UserController();

