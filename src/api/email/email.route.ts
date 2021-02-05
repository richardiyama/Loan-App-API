/* eslint-disable import/first */
// /* eslint-disable import/prefer-default-export */

import express from 'express';
import { EmailController } from './email.controller';
// import { inputValidator } from '../../util/middleware';
// import { deleteCardSchema, fetchCardSchema, fetchAllCardsSchema, addCardSchema, refSchema } from './card.validator';

export const emailRouter = express.Router();

emailRouter.get('/', (_req, res) => {
  return res.status(200).json({
    message: 'welcome to email api',
  });
});


emailRouter.post(
  '/send',
  new EmailController().sendEmail
);
