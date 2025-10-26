
import { object, string } from 'yup';

export const restaurantYup = object({
  name: string()
    .trim()
    .required(),
  address: string()
    .trim()
    .required(),
  phone: string()
    .trim()
    .required(),
  opening_hours: string()
    .trim()
    .required(),
}).noUnknown(true, 'Unknown keys are not allowed');

export const restaurantInputSchema = restaurantYup;
export const restaurantUpdateYup = restaurantYup.partial().noUnknown(true, 'Unknown keys are not allowed');