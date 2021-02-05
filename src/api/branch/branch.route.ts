/* eslint-disable import/prefer-default-export */
import express from 'express';

import * as BranchController from './branch.controller';
import {
  registerBranchSchema,
  updateBranchSchema,
  deleteBranchSchema,
  getBranchSchema,
} from './branch.validator';
import {
  inputValidator,
  // isAuthenticated,
  // isPermitted,
} from '../../util/middleware';

export const branchRouter = express.Router();

branchRouter.post(
  '/register',
  inputValidator({ body: registerBranchSchema }),
  BranchController.registerBranch,
);

branchRouter.get(
  '/',
  inputValidator({ query: getBranchSchema }),

  // isAuthenticated,
  // isPermitted(['Branch:read:own']),
  BranchController.getBranches,
);

branchRouter.put(
  '/update',
  inputValidator({ body: updateBranchSchema }),

  // isAuthenticated,
  // isPermitted(['Branch:update:own', 'Branch:update:any']),
  BranchController.updateBranch,
);

branchRouter.delete(
  '/delete',
  inputValidator({ body: deleteBranchSchema }),

  // isAuthenticated,
  // isPermitted(['Branch:delete:any']),
  BranchController.deleteBranch,
);
