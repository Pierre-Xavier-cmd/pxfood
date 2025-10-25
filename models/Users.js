import mongoose from 'mongoose'

const UsersSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, required: true }
        
    },
    { timestamps: true }
)

const Users = mongoose.model('Users', UsersSchema)

export default Users