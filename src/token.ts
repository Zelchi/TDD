import jwt from 'jsonwebtoken';

interface UserCredentials {
    id: string;
    email: string;
}

export class Token {

    static Generate(user: UserCredentials): string {
        try {
            return jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET || 'default',
                { expiresIn: '24h' }
            );
        } catch (error) {
            throw new Error('Error generating token');
        }
    }

    static async Verify(token: string): Promise<UserCredentials> {
        try {
            return (
                jwt.verify(token, process.env.JWT_SECRET || 'default') as UserCredentials
            );
        } catch (error) {
            throw new Error('Invalid token');
        }
    }

}

export default Token;