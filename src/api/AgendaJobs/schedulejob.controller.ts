// // import { NextFunction, Request, Response } from 'express';
// // import { UniversalsController } from '../../@core/common/universals.controller';
// // const agenda = require('./schedulejob.service');
// // import uniqid from 'uniqid';
// // // import JobRef from './job.model';
// // import { UniversalsService } from '../../@core/common/universals.service';
// // import bcrypt from 'bcrypt';





// export class ScheduleJobController extends UniversalsController {
//     // public scheduleAccionTransfer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     //     const { startDate, endDate, frequency, userId, pin: xpin } = req.body;
//     //     // const { endDate, userId, pin: xpin } = req.body;

//     //     const body = { scheduled: true, ...req.body };
//     //     const isAllowed = await new UniversalsService().isUser(null, userId);
//     //     const { data } = isAllowed;
//     //     const isValidPin = await bcrypt.compare(xpin, data.pin);
//     //     if (!isValidPin) {
//     //         return this.controllerResponseHandler({ status: false, statusCode: 400, data: null, message: "Wrong PIN supplied" }, res);
//     //     }

//     //     const { ip, method, hostname, url } = req
//     //     try {
//     //         const reference1 = uniqid();
//     //         const reference2 = uniqid();
//     //         const startRef = JobRef.create({ reference: reference1, start: true, end: false });
//     //         const endRef = JobRef.create({ reference: reference2, end: true, start: false });
//     //         await Promise.all([startRef, endRef]);
//     //         require('./jobs/start-transfer')(agenda);
//     //         require('./jobs/end-transfer')(agenda);
//     //         const jobStart = agenda.every(await this.getCronExpression(frequency, startDate), reference1, { body, ip, hostname, url, method });
//     //         const jobEnd = agenda.schedule(new Date(endDate), reference2, { name: reference1 });
//     //         await Promise.all([jobStart, jobEnd])
//     //         return this.controllerResponseHandler({ status: true, statusCode: 200, data: null, message: "Transfer scheduled" }, res);

//     //     } catch (error) {
//     //         this.controllerErrorHandler(req, res, error);
//     //     }
//     // }

//     // protected getCronExpression = async (frequency, date) => {
//     //     const curdate = new Date(date);
//     //     console.log(curdate, "curDatecurDatecurDate");

//     //     const hour = curdate.getHours();
//     //     const min = curdate.getMinutes()
//     //     const day = curdate.getDay();
//     //     const month = curdate.getMonth();
//     //     const dayOfMonth = curdate.getDate();
//     //     console.log("nnnnnnnnnnnnnnnnn");

//     //     switch (frequency) {
//     //         case "daily":
//     //             console.log(hour, min, `${min} ${hour} * * *`, "ppppppppppppppppppppp");

//     //             return `${min} ${hour} * * *`;
//     //         case "weekly":
//     //             return `${min} ${hour} * * ${day}`;
//     //         case "monthly":
//     //             return `${min} ${hour} ${dayOfMonth} * *`;
//     //         case "quarterly":
//     //             return `${min} ${hour} ${dayOfMonth} */3 *`;
//     //         default:
//     //             return `${min} ${hour} ${dayOfMonth} ${month} *`;
//     //     }
//     // }


// }
