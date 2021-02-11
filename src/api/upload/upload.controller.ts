import { UniversalsController } from '../../@core/common/universals.controller';
import { Request, Response, NextFunction } from 'express';
import { UploadService } from './upload.service';
// import multer from 'multer';
// import mkdirp = require("mkdirp");



export class UploadController extends UniversalsController {

  public uploadToDisk = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const fileDetails = req.files;
        let response;
        if (fileDetails?.length > 0) {
          const slashCount = fileDetails[0].path.search(/\\/);
          for (let i = 0; i < slashCount; i ++) {
            fileDetails[0].path = fileDetails[0].path.replace('\\', '/')
          }
          response = { status: true, statusCode: 200, message: "File Uploaded", data: fileDetails };
          this.controllerResponseHandler(response, res);
        } else {
          response = { status: false, statusCode: 400, message: "Upload a file", data: fileDetails }
          this.controllerResponseHandler(response, res);
        }

    } catch (error) {
      this.controllerErrorHandler(req, res, error)
    }
  }

  public uploadFile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await new UploadService().processUploadFile(req, res);
      if (response || response?.status) {
        this.controllerResponseHandler(response, res);
      }
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public getFile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await new UploadService().processGetFile(req);
      const { fileName, options } = response.data;
      res.sendFile(fileName, options)
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }


}
