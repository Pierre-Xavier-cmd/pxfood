

import express from 'express'
import User from '../models/Users.js'
import jwt from 'jsonwebtoken'

const router = express.Router()

// Register
router.post('/register', async (req, res) => {

    const { username, email, password } = req.body
    

    try {
        const newUser = new User({
            username,
            email,
            password,
            role: "user",
        })

        const savedUser = await newUser.save()
        res.status(201).json({...savedUser, accessToken: jwt.sign(
            {
                id: savedUser._id,
                role: "user",
            },
            process.env.JWT_SEC,
            { expiresIn: '3d' }
        )})
    } catch (err) {
        res.status(500).json({ response: 'Internal server error: ' + err.message })
    }
})

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body


        const user = await User.findOne({ username: username })


        if (!user) {
            return res.status(401).json('Wrong User Name')
        }


        if (password === user.password ) {
            console.log("ok")
        }

        if (password !== user.password ) {
            return res.status(401).json('Wrong Password')
        }

        const accessToken = jwt.sign(
            {
                id: user._id,
                role: user.role,
            },
            process.env.JWT_SEC,
            { expiresIn: '3d' }
        )

        const { password: _, ...others } = user._doc
        res.status(200).json({ ...others, accessToken })
    } catch (err) {
        console.log(err)
        res.status(500).json({ response: 'Internal server error' })
    }
})

export default router

