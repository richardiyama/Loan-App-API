import joi from '@hapi/joi';


export const createFeedbackSchema = joi.object({
  userId: joi.string().required(),
  rating: joi.number().required(),
  fullname: joi.string().required(),
  comment: joi.string().max(100)
});

export const fetchFeedbacksSchema = joi.object({
  limit: joi.number(),
  page: joi.number()
});
