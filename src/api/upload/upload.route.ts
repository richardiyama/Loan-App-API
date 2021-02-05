import * as express from "express";

// import multer from 'multer';
// import mkdirp = require("mkdirp");
import { UploadController } from "./upload.controller";
import { inputValidator, isAuthenticated, uploadFilesUtils } from '../../util/middleware';
import { uploadToDisk, userDoc } from './upload.validator';


export const uploadRouter = express.Router();

uploadRouter.post(
  "/upload", uploadFilesUtils('userImage'),
  new UploadController().uploadToDisk
)

uploadRouter.post(
  "/cloudUpload/:mobileNumber/:folder/:ref",
  inputValidator({ params: uploadToDisk }),
  new UploadController().uploadToDisk
)

uploadRouter.get(
  "/userDoc/:userMobile/:folder/:filename",
  inputValidator({ params: userDoc }),
  isAuthenticated,
  new UploadController().getFile
)
