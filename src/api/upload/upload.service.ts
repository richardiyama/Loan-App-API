
import { Request } from "express";
import { UniversalsService } from '../../@core/common/universals.service';
import * as AWS from "aws-sdk";
// import { IResponse } from '../account/account.interface';



export class UploadService extends UniversalsService {

  public processGetFile = async (req: Request) => {
    const { folder, filename, userMobile, role, mobileNumber } = req.params;
    const dir = role === "user" ? `public/${mobileNumber}/${folder}/` : `public/${userMobile}/${folder}/`;
    try {
      const options = {
        root: dir,
        dotfiles: 'deny',
        headers: {
          'x-timestamp': Date.now(),
          'content-disposition': `attachment; filename=${filename}`,
          'x-sent': true
        }
      };

      const fileName = `${filename}`;
      return this.successResponse(null, { fileName, options })
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  }

  public processUploadFile = async (req, res): Promise<any> => {
    try {
      const { key, imageData, folder, fileName } = req.body;
      const base64Data = Buffer.from(imageData.replace(/^data:image\/\w+;base64,/, ""), 'base64')
      const type = imageData.split(';')[0].split('/')[1];
      const spacesEndpoint = new AWS.Endpoint(`ams3.digitaloceanspaces.com/${folder}`);
      const s3 = new AWS.S3({
        // @ts-ignore
        endpoint: spacesEndpoint,
        accessKeyId: "UZ7GMAUK5GPDYTMDM6CQ",
        secretAccessKey: "TDyykJZH386f1QLYqRVKn6gCQspY/aigCe2MGwRDZ80"
      });
      const params = {
        Bucket: 'rubikpay',
        Key: `${key}/${fileName}`,
        Body: base64Data,
        ACL: 'public-read',
        ContentEncoding: 'base64',
        ContentType: `image/${type}`
      };
      s3.upload(params, (err, data) => {
        console.log(params, "entered herhehrhehrh")
        if (err) return res.status(400).json({ status: false, message: "File upload failed", data: null });

        data.Location = data.Location.replace("ams3", "ams3.cdn");
        console.log(data.Location, "data.Location")
        return res.status(200).json({ status: true, message: "File uploaded", data });
      });
    } catch (error) {
      console.log(error, "++++++++++++++++++++++++++++")
      return this.serviceErrorHandler(req, error);
    }
  }
}
