/* eslint-disable import/prefer-default-export */
import joi from '@hapi/joi';

export const addRoleSchema = joi.object({
  existingAdminMobileNumber: joi.string().required(),
  role: joi.string().required(),
  permissions: joi.array().required(),
});

export const addPermissionSchema = joi.object({
  existingAdminMobileNumber: joi.string().required(),
  name: joi.string().required(),
  permissions: joi.array().required(),
});

export const getRoleSchema = joi.object({
  existingAdminMobileNumber: joi.string().required(),
  role: joi.string().required(),
});

export const assignRoleSchema = joi.object({
  existingAdminMobileNumber: joi.string().required(),
  role: joi.string(),
  mobileNumber: joi.string().required(),
});

export const approveAdminSchema = joi.object({
  existingAdminMobileNumber: joi.string().required(),
  status: joi.string(),
  mobileNumber: joi.string().required(),
});

export const updateRoleSchema = joi.object({
  existingAdminMobileNumber: joi.string().required(),
  role: joi.string().required(),
  permissions: joi
    .array()
    .items(joi.string())
    .required(),
  isAddition: joi.boolean().required(),
});
