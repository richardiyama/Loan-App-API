/* eslint-disable import/prefer-default-export */
import joi from '@hapi/joi';

export const registerBranchSchema = joi.object({
  _id: joi.string(),
  state: joi.string(),
  coordinate: joi.object({
    lattitude: joi.string(),
    longitude: joi.string(),
  }),
  address: joi.string(),
  branchCode: joi.string(),
  branchName: joi.string(),
});

export const getBranchSchema = joi.object({
  _id: joi.string(),
  state: joi.string(),
  coordinate: joi.object({
    lattitude: joi.string(),
    longitude: joi.string(),
  }),
  branchCode: joi.string(),
  branchName: joi.string(),
});

export const updateBranchSchema = joi.object({
  _id: joi.string(),
  state: joi.string(),
  coordinate: joi.object({
    lattitude: joi.string(),
    longitude: joi.string(),
  }),
  address: joi.string(),
  branchCode: joi.string(),
  branchName: joi.string(),
});

export const deleteBranchSchema = joi.object({
  _id: joi.string().required(),
});
