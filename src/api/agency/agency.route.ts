import express from 'express';
import { AgencyController } from './agency.controller';

export const agencyRouter = express.Router();

agencyRouter.get(
  '/getFees',
  new AgencyController().getAgencyFees
);
agencyRouter.post(
  '/updateFees',
  new AgencyController().updateAgencyFees
);
