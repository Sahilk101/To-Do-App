import Joi from 'joi';

interface Schema {
  params?: Joi.ObjectSchema;
  body?: Joi.ObjectSchema;
}


export const registerSchema = Joi.object({
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const addProjectSchema = Joi.object({
  name: Joi.string().trim().min(1).required(),
  description: Joi.string().trim().min(1).required(),
});

export const addTaskSchema = Joi.object({
  title: Joi.string().trim().min(1).required(),
  description: Joi.string().trim().min(1).required(),
});

export const editTaskDetailsSchema = Joi.object().keys({
    name: Joi.string().optional(),
    description: Joi.string().optional(),
    status: Joi.string().required().valid('PENDING', 'COMPLETED', 'ON_HOLD')
  });