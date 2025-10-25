import express from 'express'
import Menu from '../models/Menu.js'
import { verifyTokenAndAdmin } from '../middlewares/verifyToken.js'

const router = express.Router()



// get all menus
router.get('/', async (req, res) => {
    const menu = await Menu.find()
    res.status(200).json(menu)
    
})

// update  menu

router.put('\:id', async (req, res) => {
    const menuId = req.params.id
    const menu = req.body
    await Menu.updateOne({_id: menuId}, menu)
    const updatedMenu = await Menu.findById(menuId)
    res.status(200).json(updatedMenu)
})


// delete 1 menu
router.delete('/:id', async (req, res) => {
    const userId = req.params.id
    console.log('tentative de suppression pour menu', menuId)
    const menu = await Menu.deleteOne({_id: menuId})
    console.log(user)
    res.status(200).json({message: `Suppression finie pour menu avec id ${menuId}`})
})


// create menu

// Register
router.post('/', async (req, res) => {

    const { restaurant_id, name, description, price, category } = req.body
    

    try {
// TODO on ne met pas en id pour
//  register un menu on laisse mongoDB gerer les IDs

        const newMenu = new Menu({
            restaurant_id,
            name,
            description,
            price,
            category,
        })

        const savedMenu = await newMenu.save()
        res.status(201).json(savedMenu)
    } catch (err) {
        res.status(500).json({ response: 'Internal server error: ' + err.message })
    }
})

export default router