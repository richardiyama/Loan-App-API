import * as handlebars from "handlebars";
import * as path from "path";
import * as fs from "fs";
import * as nodemailer from "nodemailer";
import { config } from "secreta";
const { SMTP_USER, SMTP_PASS } = config;

export class EmailService {

  public zohoMail = async (req, emailAddress, emailTemplate, details, subject): Promise<void> => {
    try {
      const emailTemplateSource = fs.readFileSync(path.join(__dirname, '../../..', 'templates', `${emailTemplate}.hbs`), "utf8")
      const template = handlebars.compile(emailTemplateSource);
      const htmlToSend = template(details);
      const transporter = nodemailer.createTransport({
        host: "smtp.zoho.com",
        secure: true,
        port: 465,
        // port: 587,

        auth: {
          user: SMTP_USER,
          pass: SMTP_PASS,
        }
      });
      const mailOptions = {
        from: SMTP_USER, // sender address
        to: emailAddress,
        subject, // Subject line
        html: htmlToSend, // plain text body
      };
      await transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
          // console.log(err, "errror")
          // handle error
        }

        // console.log(info, "infofofofofofo")
      })
      // const a = await transporter.sendMail(mailOptions)
      // console.log(a, "lllllllllllllllllllllllllllllllllll");

    } catch (error) {
      // return {status:false, message:"internal server error", data:null, statusCode:500}
      // this.serviceErrorHandler(req, error);
    }
  }

  public sendEmail = async (req, emailAddress, emailTemplate, user, subject, code?, accountNumber?): Promise<void> => {
    try {
      // const emailTemplateSource = fs.readFileSync(path.join(__dirname, '../../..', 'templates', `${emailTemplate}.hbs`), "utf8")
      // const template = handlebars.compile(emailTemplateSource);
      // console.log(accountNumber, "accountNumber");
      // const htmlToSend = template({ user, code, accountNumber });
      // sgMail.setApiKey(SG_KEY)
      // const msg = {
      //   to: emailAddress,
      //   from: 'accion@rubikpay.net',
      //   subject,
      //   html: htmlToSend
      // };
      // await sgMail.send(msg)
    } catch (error) {
      // this.serviceErrorHandler(req, error);
    }
  }


  public sendEmailLoan = async (req, emailAddress, emailTemplate, details, subject): Promise<void> => {
    try {
      // const emailTemplateSource = fs.readFileSync(path.join(__dirname, '../../..', 'templates', `${emailTemplate}.hbs`), "utf8")
      // const template = handlebars.compile(emailTemplateSource);
      // console.log(accountNumber, "accountNumber");
      // const htmlToSend = template(details);
      // sgMail.setApiKey(SG_KEY)
      // const msg = {
      //   to: emailAddress,
      //   from: 'accion@rubikpay.net',
      //   subject,
      //   html: htmlToSend
      // };
      // await sgMail.send(msg);
    } catch (error) {
      // this.serviceErrorHandler(req, error);
    }
  }


}
