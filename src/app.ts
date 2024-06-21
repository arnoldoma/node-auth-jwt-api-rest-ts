import dotenv from 'dotenv';
dotenv.config()
import express from 'express';
import authRoutes from './routes/authRoutes';
import usersRoutes from './routes/userRoutes';

const app = express()

app.use(express.json())

// Routes
app.use('/auth', authRoutes)
// Autenticacion

// Usuarios
//Hacer una api-rest de usuarios
app.use('/users', usersRoutes)


export default app


// https://www.youtube.com/watch?v=I17ln313Pjk
// Video minuto 4:44:06
// 