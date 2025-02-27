import joi from 'joi';
import { CreateThreadDTO } from '../../dtos/thread-dtos';

const createThreadSchema = joi.object<CreateThreadDTO>({
  content: joi.string().max(500),
  images: joi.string(),
});

export { createThreadSchema };
