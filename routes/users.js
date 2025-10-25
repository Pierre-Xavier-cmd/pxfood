import express from 'express'
import User from '../models/Users.js'
import { verifyTokenAndAdmin } from '../middlewares/verifyToken.js'

const router = express.Router()
// creer get user

router.get('/:id', async (req, res) => {

    const userId = req.params.id
    console.log('tentative de lecture pour user', userId)
    const user = await User.findOne({ _id: userId})
    console.log(user)
    // TODO mettre a jour le status et renvoyer utilisateur 
    res.status(500).json({message: `en cours de lecture avec user id ${userId}`})

})

// creer update user 

router.put('/:id', async (req, res) => {
    const userId = req.params.id
//    const { username, email, password } = req.body
    const user = { username, email, password } = req.body
    newUser = {}

    await User.updateOne({_id: userId}, user)    
    const updatedUser = User.findById(userId)
    console.log('tentative de modification pour user', userId)
 //   const user = await User.updateOne({_id: userId,})
    console.log(user)
    res.status(200).json({user: updatedUser})
    
})

// creer supprimer user
router.delete('/:id', async (req, res) => {
    const userId = req.params.id
    console.log('tentative de suppression pour user', userId)
    const user = await User.deleteOne({_id: userId})
    console.log(user)
    res.status(200).json({message: `Suppression finie pour user avec id ${userId}`})
})

export default router