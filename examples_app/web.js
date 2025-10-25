import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import { config } from 'dotenv'
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from './swagger.json' with { type: 'json' }
import productRoute from './routes/product.js'
import userRoutes from './routes/user.js'
import authRoutes from './routes/auth.js'

const app = express()
const PORT = 8080

config()

// Connect to the MongoDB database
mongoose
.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`)
.then(() => {
    console.log('Connected to the database')
})
.catch((error) => {
    console.error('Error connecting to the database:', error)
})

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use('/api/products', productRoute)
app.use('/api/users', userRoutes)
app.use('/api/auth', authRoutes)
app.use(express.static('public'))

app.use((req, res) => {
    res.status(404).json({ message: `API not found at ${req.url}` });
})

app.listen(8080, () => {
    console.log(`Server started on port http://localhost:${PORT}`)
})

export default app
