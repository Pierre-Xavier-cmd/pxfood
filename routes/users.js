import express from 'express'
import User from '../models/Users.js'
import { verifyTokenAndAdmin, verifyTokenAndAuthorization } from '../middlewares/verifyToken.js'
import { userUpdateYup } from '../validation/user.yup.js'


const router = express.Router()
// creer get user

router.get('/:id', verifyTokenAndAuthorization, async (req, res) => {

    const userId = req.params.id
    const user = await User.findOne({ _id: userId})
    res.status(200).json(user)
})

// creer update user 

router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
    const validatedData = await userUpdateYup.validate(req.body, { abortEarly: false, stripUnknown: true });

    const userId = req.params.id
    const user = req.body
    await User.updateOne({_id: userId}, user)    
    const updatedUser = await User.findById(userId)
    res.status(200).json(updatedUser)
    
})

// creer supprimer user
router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
    const userId = req.params.id
    await User.deleteOne({_id: userId})
    res.status(200).json({message: `Suppression finie pour user avec id ${userId}`})
})

// list of users
router.get('/', verifyTokenAndAdmin, async (req, res) => {
    const users = await User.find()
    res.status(200).json(users)
})


export default router