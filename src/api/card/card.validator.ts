import joi from '@hapi/joi';



export const cardSchema = joi.object({
  bankCode: joi.string(),
  accountNo: joi.string().length(10).regex(/^\d+$/),
  authorizationCode: joi.string().required(),
  bin: joi.string().required(),
  last4: joi.string().required().length(4),
  expMonth: joi.string().required(),
  expYear: joi.string().required(),
  channel: joi.string().only().allow("web", "mobile").required(),
  cardType: joi.string().required(),
  bank: joi.string().required(),
  countryCode: joi.string().required(),
  brand: joi.string().required(),
  default: joi.boolean().required(),
  userCode: joi.string().required(),
  userId: joi.string().required(),
  userMobile: joi.string().length(11).required(),
  firstName: joi.string().required(),
  lastName: joi.string().required(),
  email: joi.string().email().required()
});

export const deleteCardSchema = joi.object({
  last4: joi.string().length(4).regex(/^\d+$/),
  cardId: joi.string().required()
});

export const fetchCardSchema = joi.object({
  last4: joi.string().length(4).regex(/^\d+$/),
  userId: joi.string(),
  userMobile: joi.string()
});

export const fetchAllCardsSchema = joi.object({
  limit: joi.number().required(),
  page: joi.number().required(),
});
export const refSchema = joi.object({
  ref: joi.string().required()
});

export const addCardSchema = joi.object({
  email: joi.string().email().required(),
  ref: joi.string().required(),
  userId: joi.string().required(),
  firstName: joi.string().required(),
  lastName: joi.string().required(),
  channel: joi.string().required(),
  default: joi.boolean().required()
});
