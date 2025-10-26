
import { object, string } from 'yup';

export const roleValues = ['admin', 'user'];

export const userYup = object({
  email: string()
    .trim()
    .lowercase()
    .email()
    .required(), // email doit être une adresse email valide
  username: string()
    .trim()
    .min(3)
    .max(32)
    .required(), // username doit être entre 3 et 32 caractères
  password: string()
    .min(8)
    .required(), // password doit être au moins 8 caractères
  role: string()
    .oneOf(roleValues)
    .default('user')
    .required(), // role doit être admin ou user, défaut "user"
}).noUnknown(true, 'Unknown keys are not allowed');

export const userInputSchema = userYup;
export const userUpdateYup = userYup.partial().noUnknown(true, 'Unknown keys are not allowed');
