
import { object, string, number } from 'yup';

export const menuYup = object({
  restaurant_id: string()
    .trim()
    .required('restaurant_id is required'),
  name: string()
    .trim()
    .min(2, 'name must be at least 2 characters')
    .max(64, 'name must be at most 64 characters')
    .required('name is required'),
  description: string()
    .trim()
    .min(2, 'description must be at least 2 characters')
    .max(256, 'description must be at most 256 characters')
    .required('description is required'),
  price: number()
    .typeError('price must be a number')
    .min(0, 'price must be non-negative')
    .required('price is required'),
  category: string()
    .trim()
    .min(2, 'category must be at least 2 characters')
    .max(64, 'category must be at most 64 characters')
    .required('category is required'),
}).noUnknown(true, 'Unknown keys are not allowed');

export const menuInputSchema = menuYup;
export const menuUpdateYup = menuYup.partial().noUnknown(true, 'Unknown keys are not allowed');

