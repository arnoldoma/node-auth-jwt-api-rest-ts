import { Request, Response } from "express";
import { comparePassword, hashPassword } from "../services/password.services";
import prisma from '../models/user';
import { generateToken } from "../services/auth.services";

// Registrar usuario
export const register = async (req: Request, res: Response): Promise<void> => {
    // Recibimos 
    const { email, password } = req.body

    try {

        if (!email) {
            res.status(400).json({ message: 'El email es obligatorio' })
            return
        }
        if (!password) {
            res.status(400).json({ message: 'El password es obligatorio' })
            return
        }

        const hashedPassword = await hashPassword(password)
        // console.log(hashedPassword);

        const user = await prisma.create({
            data: {
                email,
                password: hashedPassword
            }
        })

        // Generar token
        const token = generateToken(user)
        res.status(201).json({ token })

    } catch (error: any) {

        // Validar si esta duplicado
        if (error?.code === 'P2002' && error?.meta?.target?.includes('email')) {
            res.status(400).json({ message: 'El email ingresado ya existe.' })
        }

        console.log(error)
        res.status(500).json({ error: 'Hubo un error en el registro' })
    }
}

// Logueo 
export const login = async (req: Request, res: Response): Promise<void> => {
    // Recibimos 
    const { email, password } = req.body

    try {

        if (!email) {
            res.status(400).json({ message: 'El email es obligatorio' })
            return
        }
        if (!password) {
            res.status(400).json({ message: 'El password es obligatorio' })
            return
        }

        // Obtenemos el usuario
        const user = await prisma.findUnique({ where: { email } })

        // Si existe usuario
        if (!user) {
            res.status(404).json({ error: 'Usuario no encontrado' })
            return
        }

        // Comparacion de Contraseña
        const passwordMatch = await comparePassword(password, user.password);
        if (!passwordMatch) {
            res.status(401).json({ error: 'Usuario y contraseña no coinciden' })
        }

        // Generar token
        const token = generateToken(user)
        res.status(200).json({ token })

    } catch (error: any) {

        console.log('Error: ', error)
    }

}