import express from 'express'
import Restaurant from '../models/Restaurant.js'
import { verifyToken, verifyTokenAndAdmin } from '../middlewares/verifyToken.js'
import { restaurantInputSchema, restaurantUpdateYup } from '../validation/restaurant.yup.js'
import { validate } from '../middleware/validate.js';

const router = express.Router()

// Register
router.post('/', verifyTokenAndAdmin, validate(restaurantInputSchema), async (req, res) => {
    const {
        name,
        address,
        phone,
        opening_hours
    } = req.body
    const newRestaurant = new Restaurant({
        name,
        address,
        phone,
        opening_hours
    })
    const savedRestaurant = await newRestaurant.save()
    res.status(201).json(savedRestaurant)
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
    const validatedData = await restaurantUpdateYup.validate(req.body, { abortEarly: false, stripUnknown: true });
    await Restaurant.updateOne({_id: restaurantId}, validatedData)
    const updatedRestaurant = await Restaurant.findById(restaurantId)
    res.status(200).json(updatedRestaurant)
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