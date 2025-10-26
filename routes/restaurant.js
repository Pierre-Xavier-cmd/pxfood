import express from 'express'
import Restaurant from '../models/Restaurant.js'
import { verifyToken, verifyTokenAndAdmin } from '../middlewares/verifyToken.js'

const router = express.Router()

// Register
router.post('/', verifyTokenAndAdmin, async (req, res) => {
    const {  name, address, phone, opening_hours } = req.body
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

router.get('/:id', verifyToken, async (req, res) => {

    const restaurantId = req.params.id
    const restaurant = await Restaurant.findOne({_id: restaurantId})
    res.status(200).json(restaurant)
})

// creer update restaurant

router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
    const restaurantId = req.params.id


    const {  name, address, phone, opening_hours } = req.body

    await Restaurant.updateOne({_id: restaurantId}, { name : name, address : address, phone : phone, opening_hours : opening_hours})
    const restaurant = await Restaurant.findById(restaurantId)
    res.status(200).json(restaurant)
})

// creer supprimer restaurant
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
    const restaurantId = req.params.id
    const restaurant = await Restaurant.deleteOne({_id: restaurantId})
    res.status(200).json({message: `Suppression finie pour restaurant id ${restaurantId}`})
})


// list of restaurant
router.get('/', verifyToken, async (req, res) => {
    const restaurant = await Restaurant.find()
    res.status(200).json(restaurant)
})

export default router