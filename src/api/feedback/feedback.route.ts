import * as express from 'express';
import { inputValidator } from '../../util/middleware';
import { createFeedbackSchema } from './feedback.validator';
import { FeedbackController } from './feedback.controller';



export const feedbackRouter = express.Router();

// @desc        Route to create feedback
// @route       POST /api/v1/feedbacks/create
// @access      Public
feedbackRouter.post(
  '/create',
  inputValidator({ body: createFeedbackSchema }),
  new FeedbackController().feedback
);

// @desc        Route to get all feedbacks
// @route       GET /api/v1/feedbacks/fetch
// @access      Public
feedbackRouter.post(
  '/fetch',
  // inputValidator({ query: fetchFeedbacksSchema }),
  new FeedbackController().getFeedback
);

feedbackRouter.post(
  '/getAudits',
  // inputValidator({ query: fetchFeedbacksSchema }),
  new FeedbackController().fetchAudit
);

feedbackRouter.post(
  '/getNotifications',
  // inputValidator({ query: fetchFeedbacksSchema }),
  new FeedbackController().fetchNotification
);