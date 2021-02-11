import { UniversalsService } from '../../@core/common/universals.service';
import { IResponse } from '../account/account.interface';
import Audit from '../audit/audit.model';
import Notification from '../notification/notification.model';
import Feedback from './feedback.model';

export class FeedbackService extends UniversalsService {

  public processFeedback = async (req): Promise<IResponse> => {

    try {
      const feedback = await Feedback.create(req.body);
      if (!feedback) return this.failureResponse("Failed to save feedback");
      return this.successResponse("Feedback recorded");
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  }

  public processGetFeedbacks = async (req): Promise<IResponse> => {
    let {startDate, endDate, rating, fullName: fullname} = req.body;

    const query = {};

    let { limit, page } = req.query;
    limit = Number(limit) || 10;
    page = Number(page) || 1;

    if (startDate) {
      endDate = await endDate ? new Date(endDate) : new Date();
      const incrementedEndDate: any = new Date(endDate.getTime() + 86400000);
      query['createdAt'] = { $gte: new Date(startDate), $lt: new Date(incrementedEndDate) };
    }

    if (fullname) query["fullname"] = { "$regex": fullname, $options: "i" };
    if (rating) query["rating"] = rating;
    const options = {
      page, limit, sort: { createdAt: 'desc' }, collation: { locale: 'en' }
    };

    try {
      // @ts-ignore
      const feedbacks: any = await Feedback.paginate(query, options);
      const data = {
        docs: feedbacks.docs,
        meta: {
          total: feedbacks.totalDocs,
          skipped: feedbacks.page * feedbacks.limit,
          perPage: feedbacks.limit,
          page: feedbacks.page,
          pageCount: feedbacks.totalPages,
          hasNextPage: feedbacks.hasNextPage,
          hasPrevPage: feedbacks.hasPrevPage,
        }
      }
      return this.successResponse("Feedbacks fetched", data)
    } catch (error) {
      return this.serviceErrorHandler(req, error)
    }
  };

  public processFetchingOfAudit = async (req): Promise<IResponse> => {
    let {startDate, endDate, mobileNumber, action} = req.body;

    const query = {};

    let { limit, page } = req.query;
    limit = Number(limit) || 10;
    page = Number(page) || 1;

        if (startDate) {
      endDate = await endDate ? new Date(endDate) : new Date();
      const incrementedEndDate: any = new Date(endDate.getTime() + 86400000);

      query['createdAt'] = { $gte: new Date(startDate), $lt: new Date(incrementedEndDate) };
    }

    if (mobileNumber) query["mobileNumber"] = { "$regex": mobileNumber, $options: "i" };
    if (action) query["action"] = { "$regex": action, $options: "i" };

    const options = {
      page, limit, sort: { createdAt: 'desc' }, collation: { locale: 'en' },
    };

    try {
      // @ts-ignore
      const audit: any = await Audit.paginate(query, options);
      const data = {
        docs: audit.docs,
        meta: {
          total: audit.totalDocs,
          skipped: audit.page * audit.limit,
          perPage: audit.limit,
          page: audit.page,
          pageCount: audit.totalPages,
          hasNextPage: audit.hasNextPage,
          hasPrevPage: audit.hasPrevPage,
        }
      }
      return this.successResponse("Audit fetched", data)
    } catch (error) {
      return this.serviceErrorHandler(req, error)
    }
  };

  public processFetchingOfNotification = async (req): Promise<IResponse> => {
    let {startDate, endDate, status, url, statusText } = req.body;

    const query = {};

    let { limit, page } = req.query;
    limit = Number(limit) || 10;
    page = Number(page) || 1;

        if (startDate) {
      endDate = await endDate ? new Date(endDate) : new Date();
      const incrementedEndDate: any = new Date(endDate.getTime() + 86400000);

      query['createdAt'] = { $gte: new Date(startDate), $lt: new Date(incrementedEndDate) };

    }

    if (status) query["status"] = status;
    if (url) query["url"] = { "$regex": url, $options: "i" };
    if (url) query["statusText"] = { "$regex": statusText, $options: "i" };

    const options = {
      page, limit, sort: { createdAt: 'desc' }, collation: { locale: 'en' },
    };

    try {
      // @ts-ignore
      const notifications: any = await Notification.paginate(query, options);
      const data = {
        docs: notifications.docs,
        meta: {
          total: notifications.totalDocs,
          skipped: notifications.page * notifications.limit,
          perPage: notifications.limit,
          page: notifications.page,
          pageCount: notifications.totalPages,
          hasNextPage: notifications.hasNextPage,
          hasPrevPage: notifications.hasPrevPage,
        }
      }
      return this.successResponse("Log fetched", data)
    } catch (error) {
      return this.serviceErrorHandler(req, error)
    }
  };

}