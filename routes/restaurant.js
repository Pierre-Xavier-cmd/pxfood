import express from 'express'
import Restaurant from '../models/Restaurant.js'
import { verifyTokenAndAdmin } from '../middlewares/verifyToken.js'

const router = express.Router()

// Register
router.post('/', async (req, res) => {
    const { restaurant_id, name, address, phone, opening_hours } = req.body
    try {
// TODO on ne met pas en id pour
//  register un restaurant on laisse mongoDB gerer les IDs

        const newRestaurant = new Restaurant({
            name,
            address,
            phone,
            opening_hours,
        })

        const savedRestaurant = await newRestaurant.save()
        res.status(201).json(savedRestaurant)
    } catch (err) {
        res.status(500).json({ response: 'Internal server error: ' + err.message })
    }
})

// creer get restaurant

router.get('/:id', async (req, res) => {

    const restaurantId = req.params.id
    console.log('tentative de lecture pour restaurant', restaurantId)
    const restaurant = await Restaurant.findOne({_id: restaurantId})
    console.log(restaurant)
    res.status(500).json({message: `en cours de lecture avec restaurant id ${restaurantId}`})
})

// creer update restaurant

router.put('/:id', async (req, res) => {
    const restaurantId = req.params.id



    const {  name, address, phone, opening_hours } = req.body



    console.log('tentative de modification pour restaurant', restaurantId)
    await Restaurant.updateOne({_id: restaurantId}, { name : name, address : address, phone : phone, opening_hours : opening_hours})
    const restaurant = await Restaurant.findById(restaurantId)
    res.status(200).json({restaurant: restaurant})
})

// creer supprimer restaurant
router.delete('/:id', async (req, res) => {
    const restaurantId = req.params.id
    console.log('tentative de suppression pour restaurant', restaurantId)
    const restaurant = await Restaurant.deleteOne({_id: restaurantId})
    console.log(restaurant)
    res.status(200).json({message: `Suppression finie pour restaurant id ${restaurantId}`})
})


// list of restaurant
router.get('/', async (req, res) => {
    const restaurant = await User.find()
    res.status(200).json(restaurant)
})

export default router