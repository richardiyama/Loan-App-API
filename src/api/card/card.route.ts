import * as express from 'express';
import { inputValidator, isAuthenticated } from '../../util/middleware';
import { deleteCardSchema, fetchAllCardsSchema, addCardSchema, refSchema } from './card.validator';
import { CardController } from './card.controller';

export const cardRouter = express.Router();


// cardRouter.post(
//   '/addCard',
//   // inputValidator({ body: cardSchema }),
//   new CardController().addCard
// );

cardRouter.post(
  '/addUserCard',
  isAuthenticated,
  inputValidator({ body: addCardSchema }),
  new CardController().verifyAndAddCard
);
cardRouter.post(
  '/deleteCard',
  isAuthenticated,
  inputValidator({ body: deleteCardSchema }),
  new CardController().deleteCard,
);
cardRouter.get(
  '/getCard',
  isAuthenticated,
  // inputValidator({ body: fetchCardSchema }),
  new CardController().getUserCard
);
cardRouter.get(
  '/getCards',
  inputValidator({ query: fetchAllCardsSchema }),
  new CardController().getCards,
);
cardRouter.get(
  '/verifyRef',
  inputValidator({ body: refSchema }),
  new CardController().verifyReference
);

