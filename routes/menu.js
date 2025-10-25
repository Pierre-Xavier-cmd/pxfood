import express from 'express'
import Menu from '../models/Menu.js'
import { verifyTokenAndAdmin } from '../middlewares/verifyToken.js'

const router = express.Router()



// get all menus
router.get('/:id', async (req, res) => {

    
})

// update  menu
// delete 1 menu
// create menu

export default router