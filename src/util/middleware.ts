/* eslint-disable @typescript-eslint/ban-ts-ignore */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/prefer-default-export */
/* eslint-disable consistent-return */
import jwt from 'jsonwebtoken';
import { config } from 'secreta';
import User from '../api/user/user.model';
import Role from '../api/permission/role.model';
import multer from 'multer';
import mkdirp from 'mkdirp';

import aws from 'aws-sdk';

import multerS3 from 'multer-s3';

aws.config.update({
  region: 'us-east-1',
  accessKeyId: "AKIAIYC3OB6CXZHS4IQQ",
  secretAccessKey: "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"
  
  });
  
  
  const s3 = new aws.S3();
  





const { JWT_SECRET } = config;

// helper function
const includesSome = (arr, values) => values.some((v) => arr.includes(v));

export const inputValidator = (schema: any) => {

  return (req, res, next) => {

    // eslint-disable-next-line no-unused-vars
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(schema)) {
      if (key === 'body') {
        // @ts-ignore
        const { error } = value.validate(req.body);

        if (error) {
          return res.status(400).json({
            status: false,
            message: error.message,
            data: 'invalid payload',
            path: error.details[0].path
          });
        }
      } else if (key === 'query') {
        // @ts-ignore
        const { error } = value.validate(req.query);
        if (error) {
          return res.status(400).json({
            status: false,
            message: error.message,
            data: 'invalid payload',
          });
        }
      } else {
        // @ts-ignore
        const { error } = value.validate(req.params);
        if (error) {
          console.log(error, "++++++++++++++++++++++++++++++++++++++++++");

          return res.status(400).json({
            status: false,
            message: error.message,
            data: 'invalid payload',
          });
        }
      }
    }
    next();
  };
};

export const checkQuery = async (req, res, next) => {
  try {
    const obj: any = req.query;
    for (const [key, value] of Object.entries(obj)) {
      const theValue = Number(value);
      if (Number.isNaN(theValue)) {
        return res.status(400).json({
          status: false,
          message: `query parameter ${key}=${value} is invalid`,
          data: 'invalid payload',
        });
      }
      req[key] = theValue;
    }

    next();
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'an unknown error occurred! if this persist, please contact support',
      data: null,
    });
  }
};

export const isAuthenticated = async (req, res, next) => {
  let accessToken = req.headers?.authorization;
  if (!accessToken) {
    return res.status(401).json({
      status: false,
      message: 'please provide authorization token',
      data: 'please provide authorization token',
    });
  }
  try {
    // stripe auth kind (e.g bearer) from the accesstoken
    const auth = accessToken.split(' ');
    // eslint-disable-next-line prefer-destructuring
    accessToken = auth[1];
    const { exp, userId } = jwt.verify(accessToken, JWT_SECRET);

    // convert exp to milliseconds by multiplying by 1000

    if (+new Date() > exp * 1000) {
      return res.status(401).json({
        status: false,
        message: 'access token expired! Please login again',
        data: 'access token expired! Please login again',
      });
    }
    req.user = await User.findById(userId, { password: 0, transactionPin: 0, securityAnswer: 0 });
    next();
  } catch (error) {
    return res.status(401).json({
      status: false,
      message: 'please check your token and re-try again. If this persist, please contact support',
      error
    });
  }
};

export const uploadFilesUtils = (folder)=> {
  const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
      const path = `public/${folder}/${Date.now()}`;
      mkdirp(path).then(() => {
        cb(null, path);
      });
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 6242880,
    },
  }).any();
  return upload
}

export const isPermitted = (permissions: Array<string>) => {
  // eslint-disable-next-line no-unused-vars
  return async (req, res, next) => {
    const rolePermission: any = await Role.findOne({ role: req.user.role }, { permissions: 1 });
    if (!rolePermission || !includesSome(rolePermission.permissions, permissions)) {
      return res.status(401).json({
        status: false,
        message: 'you do not have sufficient permission',
        data: 'unauthorized',
      });
    }

    next();
  };
};



export const isPermittedV2 = (permissions: Array<any>) => {
  // eslint-disable-next-line no-unused-vars
  return async (req, res, next) => {
    const rolePermission: any = await Role.findOne({ role: req.user.role }, { permissions: 1 });
    if (!rolePermission || !includesSome(rolePermission.permissions, permissions)) {
      return res.status(401).json({
        status: false,
        message: 'you do not have sufficient permission',
        data: 'unauthorized',
      });
    }

    next();
  };
};





 export const upload = multer({
      storage:multerS3({
    s3: s3,
    bucket: 'paybuddybucket',
    acl: 'public-read',
    metadata: (req,file,cb) => {
        cb(null,{fieldName: file.fieldname});
    },
  
    key:(req,file,cb) =>{
        cb(null,Date.now().toString() );
    }
      })
  })




  




 