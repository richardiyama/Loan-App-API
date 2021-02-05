import { addRoleSchema, getRoleSchema, assignRoleSchema, addPermissionSchema, approveAdminSchema } from './permission.validator';
import { PermissionController } from './permission.controller';
import express from 'express';
import { inputValidator } from '../../util/middleware';


export const permissionRouter = express.Router();

permissionRouter.get('/', (_req, res) => {
  return res.status(200).json({
    message: 'welcome to permissions api',
  });
});

permissionRouter.post(
  '/addRole',
  inputValidator({body: addRoleSchema}),
  // isAuthenticated,
  new PermissionController().addRole
);

permissionRouter.post(
  '/addPermission',
  inputValidator({body: addPermissionSchema}),
  // isAuthenticated,
  new PermissionController().addPermission
);

permissionRouter.get(
  '/getRole',
  inputValidator({query: getRoleSchema}),
  new PermissionController().getRole,
);

permissionRouter.post(
  '/deleteRole',
  inputValidator({body: getRoleSchema}),
  new PermissionController().deleteRole,
);
permissionRouter.get(
  '/getAllRoles',
  // inputValidator({query: getRoleSchema}),
  new PermissionController().getAllRoles,
);

permissionRouter.get(
  '/getAllPermissions',
  new PermissionController().getAllPermissions,
);

permissionRouter.post(
  '/assignRole',
  inputValidator({body: assignRoleSchema}),
  new PermissionController().assignRole,
);

permissionRouter.post(
  '/approveAdmin',
  inputValidator({body: approveAdminSchema}),
  new PermissionController().approveAdmin,
);

permissionRouter.post(
  '/updateRole',
  inputValidator({body: addRoleSchema}),
  new PermissionController().updateRole,
);