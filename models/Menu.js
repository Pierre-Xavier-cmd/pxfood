import mongoose from "mongoose"

const MenuSchema = new mongoose.Schema(
  {
    restaurant_id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true}
  },
  { timestamps: true }
)

const Menu = mongoose.model("Menu", MenuSchema)

export default Menu