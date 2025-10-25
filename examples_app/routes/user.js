import express from 'express'
import User from '../models/User.js'
import { verifyTokenAndAuthorization, verifyTokenAndAdmin } from '../middlewares/verifyToken.js'

const router = express.Router()

// Get all users
router.get('/', verifyTokenAndAdmin, async (req, res) => {
    try {
        const users = await User.find()
        res.status(200).json(users)
    } catch (error) {
        console.error('Error getting users:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

// Get a specific user by ID
router.get('/:id', verifyTokenAndAuthorization, async (req, res) => {
    const { id } = req.params

    try {
        const user = await User.findById(id)

        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        res.status(200).json(user)
    } catch (error) {
        console.error('Error getting user:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

// Update a user
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
    const { id } = req.params
    const { username, email, password } = req.body

    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { username, email, password },
            { new: true }
        )

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' })
        }

        res.status(200).json(updatedUser)
    } catch (error) {
        console.error('Error updating user:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

// Set or unset a user as admin - should be admin protected - except if there is no admin
router.put('/:id/admin'/*, verifyTokenAndAdmin*/, async (req, res) => {
    const { id } = req.params
    const { isAdmin } = req.body

    try {
        const user = await User.findById(id)

        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        user.isAdmin = isAdmin
        await user.save()
        res.status(200).json(user)
    } catch (error) {
        console.error('Error updating user:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

// Delete a user
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
    const { id } = req.params

    try {
        const deletedUser = await User.findByIdAndDelete(id)

        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' })
        }

        res.status(200).json({ message: 'User deleted successfully' })
    } catch (error) {
        console.error('Error deleting user:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

export default router
