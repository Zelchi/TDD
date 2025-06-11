import { Request, Response } from 'express';

class UserController {

    public static GetAll(req: Request, res: Response): void {
        res.status(200).json([
            { name: "John Doe", email: "johndoe@mail.com" },
            { name: "Jane Smith", email: "jane@mail.com" },
            { name: "Alice Johnson", email: "alice@mail.com" },
        ]);
    }

    public static GetById(req: Request, res: Response): void {
        const userId = req.params.id;
        res.status(200).json({ name: "John Doe", email: "johndoe@mail.com" });
    }

    public static Create(req: Request, res: Response): void {
        const newUser = req.body;
        res.status(201).json({ message: "User created", user: newUser });
    }

    public static Update(req: Request, res: Response): void {
        const userId = req.params.id;
        const updatedUser = req.body;
        res.status(200).json({ message: `User with ID ${userId} updated`, user: updatedUser });
    }

    public static Delete(req: Request, res: Response): void {
        const userId = req.params.id;
        res.status(200).json({ message: `User with ID ${userId} deleted` });
    }

}

export default UserController;