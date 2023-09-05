import { authSchema } from "../models/ValidationSchemas.js";
import { validate } from "../services/validationService.js";

export const authValidation = validate(authSchema);
