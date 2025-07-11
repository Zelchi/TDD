import jwt from 'jsonwebtoken';

interface UserCredentials {
    id: string;
    email: string;
    role?: string;
}

export class Token {

    public Generate(user: UserCredentials): string {
        try {
            return jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET || 'default',
                { expiresIn: '24h' }
            );
        } catch (error) {
            throw new Error('Erro ao gerar o token');
        }
    }

    public Verify(token: string): UserCredentials {
        try {
            return jwt.verify(token, process.env.JWT_SECRET || 'default') as UserCredentials
        } catch (error) {
            return { id: '', email: '' };
        }
    }

}

export default new Token();