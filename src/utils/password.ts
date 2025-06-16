import bcrypt from 'bcrypt';

class Password {

    public async Hash(password: string): Promise<string> {
        try {
            const salt = await bcrypt.genSalt(10);
            return await bcrypt.hash(password, salt);
        } catch (error) {
            throw new Error('Erro ao gerar o hash da senha');
        }
    }

    public async Compare(password: string, hashedPassword: string): Promise<boolean> {
        try {
            return await bcrypt.compare(password, hashedPassword);
        } catch (error) {
            throw new Error('Erro ao comparar a senha');
        }
    }
}

export default new Password();