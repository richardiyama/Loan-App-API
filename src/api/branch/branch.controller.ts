/* eslint-disable @typescript-eslint/ban-ts-ignore */
/* eslint-disable no-restricted-syntax */
/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/prefer-default-export */
import { Request, Response } from 'express';
import Branch from './branch.model';

import logger from '../../util/logger/logger';

// const { JWT_SECRET, API_URL } = config;

export const registerBranch = async (req, res): Promise<any> => {
  let obj: any = req.body;

  try {
    const branch: any = await new Branch(obj).save();

    return res.status(200).json({
      status: true,
      message: 'Branch created successfully',
      data: {
        _id: branch._id,
        branchCode: branch.branchCode,
        branchName: branch.branchName,
        state: branch.state,
        createdAt: branch.state,
      },
    });
  } catch (error) {
    logger.log('warn', `internal server error: ${error}`);

    return res.status(500).json({
      status: false,
      message: 'if this persit, please contact support',
      data: null,
    });
  }
};

export const getBranches = async (req, res): Promise<any> => {
  // const obj = req.body;

  // setting default limit to 50 and page to 1
  let { limit, page } = req.query;
  limit = Number(limit) || 50;
  page = Number(page) || 1;

  try {
    const options = {
      page,
      limit,
      sort: { createdAt: 'desc' },
      collation: {
        locale: 'en',
      },
      projection: {},
    };
    // @ts-ignore
    const branches: any = await Branch.paginate({}, options);

    return res.status(200).json({
      status: true,
      message: 'operation successful',
      data: branches.docs,
      meta: {
        total: branches.totalDocs,
        skipped: branches.page * branches.limit,
        perPage: branches.limit,
        page: branches.page,
        pageCount: branches.totalPages,
        hasNextPage: branches.hasNextPage,
        hasPrevPage: branches.hasPrevPage,
      },
    });
  } catch (error) {
    logger.log('warn', `internal server error: ${error}`);

    return res.status(500).json({
      status: false,
      message: 'if this persit, please contact support',
      data: null,
    });
  }
};

export const updateBranch = async (req, res): Promise<any> => {
  const obj = req.body;
  try {
    const query = { _id: obj._id };

    const branch: any = await Branch.findOneAndUpdate(query, obj);

    if (!branch) {
      return res.status(404).json({
        status: false,
        message: 'Branch not found',
        data: 'Branch not exist',
      });
    }

    return res.status(200).json({
      status: true,
      message: 'updated Branch successfully',
      data: {
        _id: branch._id,
        branchCode: branch.branchCode,
        branchName: branch.branchName,
        state: branch.state,
      },
    });
  } catch (error) {
    logger.log('warn', `internal server error: ${error}`);

    return res.status(500).json({
      status: false,
      message: 'if this persit, please contact support',
      data: null,
    });
  }
};

export const deleteBranch = async (req: Request, res: Response): Promise<any> => {
  const obj = req.body;
  try {
    const query = { _id: obj._id };

    const branch: any = await Branch.findOneAndDelete(query);

    if (!branch) {
      return res.status(404).json({
        status: false,
        message: 'Branch not found',
        data: 'Branch not exist',
      });
    }

    return res.status(200).json({
      status: true,
      message: 'Branch deleted successfully',
      data: {
        _id: branch._id,
        branchCode: branch.branchCode,
        branchName: branch.branchName,
        state: branch.state,
      },
    });
  } catch (error) {
    logger.log('warn', `internal server error: ${error}`);

    return res.status(500).json({
      status: false,
      message: 'if this persit, please contact support',
      data: null,
    });
  }
};
