import express from 'express';
import { MigrationController } from './migration.controller';

export const migrationsRouter = express.Router();



migrationsRouter.get(
  '/addNewField',
  new MigrationController().addNewField
);
