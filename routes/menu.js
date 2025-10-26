import express from 'express'
import Menu from '../models/Menu.js'
import { verifyTokenAndAdmin, verifyToken } from '../middlewares/verifyToken.js'

const router = express.Router()




// get menu by restaurant id
// get all menus


router.get('/:id', verifyToken, async (req, res) => {
    const menuId = req.params.id
    const menu = await Menu.findOne({_id: menuId})
    res.status(200).json(menu)
})

router.get('/', verifyToken, async (req, res) => {
        const { sortBy = 'name', order = 'asc', category } = req.query;
        const filter = {};

        // Filtering by category if present in query
        if (category) {
            filter.category = category;
        }

        // Build sort object for Mongoose
        const sortOrder = order === 'desc' ? -1 : 1;
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder;

        const menus = await Menu.find(filter).sort(sortOptions);
        res.status(200).json(menus);
})

// update  menu

router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
    const menuId = req.params.id
    const menu = req.body
    await Menu.updateOne({_id: menuId}, menu)
    const updatedMenu = await Menu.findById(menuId)
    res.status(200).json(updatedMenu)
})


// delete 1 menu
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
    const menuId = req.params.id
    await Menu.deleteOne({_id: menuId})
    res.status(200).json({message: `Suppression finie pour menu avec id ${menuId}`})
})


// create menu

// Register
router.post('/', verifyTokenAndAdmin, async (req, res) => {

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