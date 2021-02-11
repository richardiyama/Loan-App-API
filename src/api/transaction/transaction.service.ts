import { IResponse } from '../account/account.interface';
import { UniversalsService } from '../../@core/common/universals.service';
import Transaction from './transaction.model';
import TxnRule from './transactionRule.model';


export class TransactionService extends UniversalsService {

  public processGetTransactions = async (user, query, body, metaData): Promise<IResponse> => {
    const obj = body;
    let { limit, page } = query;
    limit = Number(limit) || 10;
    page = Number(page) || 1;

    try {
      let query: any = { userId: user._id };
      for (const [key, value] of Object.entries(obj)) {
        query = { ...query, [key]: value };
      }
      const options = {
        page, limit, sort: { createdAt: 'desc' }, collation: { locale: 'en' }, projection: {
          data: 0, transactionData: 0
        }
      };
      // @ts-ignore
      const transactions: any = await Transaction.paginate(query, options);
      return this.successResponse(null, {
        docs: transactions.docs, meta: {
          total: transactions.totalDocs,
          skipped: transactions.page * transactions.limit,
          perPage: transactions.limit,
          page: transactions.page,
          pageCount: transactions.totalPages,
          hasNextPage: transactions.hasNextPage,
          hasPrevPage: transactions.hasPrevPage,
        }
      })
    } catch (error) {
      return this.serviceErrorHandler(metaData, error);
    }
  }

  public processGetTransactionsByDate = async (req): Promise<IResponse> => {
    const { startDate, endDate, userId } = req.body;
    let { limit, page } = req.query;
    limit = Number(limit) || 10;
    page = Number(page) || 1;
    try {
      const createdAt = { $gte: new Date(startDate), $lt: new Date(endDate) };
      const options = {
        page, limit, sort: { createdAt: 'desc' }, collation: { locale: 'en' }, projection: {
          data: 0, transactionData: 0
        }
      };
      // @ts-ignore
      const transactions: any = await Transaction.paginate({ createdAt, userId }, options);
      return this.successResponse(null, {
        docs: transactions.docs, meta: {
          total: transactions.totalDocs,
          skipped: transactions.page * transactions.limit,
          perPage: transactions.limit,
          page: transactions.page,
          pageCount: transactions.totalPages,
          hasNextPage: transactions.hasNextPage,
          hasPrevPage: transactions.hasPrevPage,
        }
      })
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  }

  public processGetTotalTransactionVolumeAndValue = async (req): Promise<any> => {
    try {
      const { startDate, endDate } = req.body;
      const query = { createdAt: { $gte: new Date(startDate), $lt: new Date(endDate) } };

      const transactions = await Transaction.aggregate([
        { $match: query },
        {
          $facet: {
            success: [
              { $match: { status: "success" } },
              {
                $group: {
                  _id: "",
                  value: { $sum: "$amount" },
                  volume: { $sum: 1 }
                }
              }
            ],
            failed: [
              { $match: { status: "failed" } },
              {
                $group: {
                  _id: "",
                  value: { $sum: "$amount" },
                  volume: { $sum: 1 }
                }
              }
            ],
            pending: [
              { $match: { status: "pending" } },
              {
                $group: {
                  _id: "",
                  value: { $sum: "$amount" },
                  volume: { $sum: 1 }
                }
              }
            ]
          }
        }
      ])
      transactions[0]["totalVolume"] = (transactions[0].success[0]?.volume || 0) + (transactions[0].failed[0]?.volume || 0) + (transactions[0].pending[0]?.volume || 0);
      transactions[0]["totalValue"] = (transactions[0].success[0]?.value || 0) + (transactions[0].failed[0]?.value || 0) + (transactions[0].pending[0]?.value || 0);
      return this.successResponse("Transaction Report generated", transactions)
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }

  }
  public processGetTransactionCategories = async (req): Promise<any> => {
    try {
      const transactionCategory = await Transaction.aggregate([
        {
          $group: {
            _id: "$type",
            total: {
              $sum: 1
            }
          }
        }
      ])
      return this.successResponse("Transaction Report generated", transactionCategory)
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }

  }


  public processGetTransactionStatusAdmin = async (req): Promise<any> => {
    const { startDate, endDate } = req.body;
    const query = { createdAt: { $gte: new Date(startDate), $lt: new Date(endDate) } };
    try {
      const transactionCategory = await Transaction.aggregate([
        { $match: query },
        {
          $group: {
            _id: "$status",
            total: {
              $sum: 1
            }
          }
        }
      ])
      return this.successResponse("Transaction Report generated", transactionCategory)
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }

  }


  public processGetAllTransactions = async (req): Promise<IResponse> => {
    const obj = req.body;
    let { limit, page } = req.query;
    limit = Number(limit) || 10;
    page = Number(page) || 1;

    try {
      let query: any = {};
      for (const [key, value] of Object.entries(obj)) {
        query = { ...query, [key]: value };
      }
      const options = {
        page, limit, sort: { createdAt: 'desc' }, collation: { locale: 'en' }, projection: {
          data: 0
        }
      };
      // @ts-ignore
      const transactions: any = await Transaction.paginate(query, options);
      return this.successResponse(null, {
        docs: transactions.docs, meta: {
          total: transactions.totalDocs,
          skipped: transactions.page * transactions.limit,
          perPage: transactions.limit,
          page: transactions.page,
          pageCount: transactions.totalPages,
          hasNextPage: transactions.hasNextPage,
          hasPrevPage: transactions.hasPrevPage,
        }
      })
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  }

  public processTransactionsByDateRange = async (req) => {
    const { startDate, endDate, type, dayRange, channel } = req.body;
    const query = { createdAt: { $gte: new Date(startDate), $lt: new Date(endDate) } };
    if (type) query["type"] = type;
    if (channel) query["channel"] = channel;
    let format = "%Y-%m";
    let groupBy: any = { $month: "$createdAt" };
    if (dayRange) {
      groupBy = { $dayOfYear: "$createdAt" };
      format = "%Y-%m-%d";
    }
    try {
      const transactions = await Transaction.aggregate([
        { $match: query },
        {
          $group: {
            _id: groupBy,
            date: { $first: { $dateToString: { format, date: "$$CURRENT.createdAt" } } },
            transactionValue: { $sum: "$amount" },
            transactionVolume: { $sum: 1 }
          }
        }
      ])
      return this.successResponse("Query successful", transactions)
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  }

  public processTransactionsFilter = async (req) => {
    let { startDate, endDate, status, type, source, reference, customerName, accountNumber, minAmount, maxAmount } = req.body;


    const query = {}

    let { limit, page } = req.query;
    limit = Number(limit) || 10;
    page = Number(page) || 1;

    if (startDate) {
      endDate = await endDate ? new Date(endDate) : new Date();
      const incrementedEndDate: any = new Date(endDate.getTime() + 86400000);

      query['createdAt'] = { $gte: new Date(startDate), $lt: new Date(incrementedEndDate) };
    }

    if (type) query["type"] = type;
    if (status) query["status"] = status;
    if (reference) query["reference"] = reference;
    if (source) query["source"] = source;
    if (accountNumber) query["debitAccount"] = accountNumber;
    if (customerName) query["sender.fullName"] = { "$regex": customerName, $options: "i" };
    if (minAmount && maxAmount) {
      query["amount"] = { $gte: minAmount, $lt: maxAmount }
    } else if (minAmount) {
      query["amount"] = { $gte: minAmount }
    } else if (maxAmount) {
      query["amount"] = { $lte: maxAmount }
    }


    const options = {
      page, limit, sort: { createdAt: 'desc' }, collation: { locale: 'en' },
      projection: {
        data: 0,
      }
    };

    try {

      // @ts-ignore
      const transactions: any = await Transaction.paginate(query, options);
      return this.successResponse(null, {
        docs: transactions.docs, meta: {
          total: transactions.totalDocs,
          skipped: transactions.page * transactions.limit,
          perPage: transactions.limit,
          page: transactions.page,
          pageCount: transactions.totalPages,
          hasNextPage: transactions.hasNextPage,
          hasPrevPage: transactions.hasPrevPage,
        }
      })
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  }

  public processIncomePerTransactionType = async (req) => {
    const { startDate, endDate, dayRange } = req.body;
    const query = { createdAt: { $gte: new Date(startDate), $lt: new Date(endDate) } };
    let format = "%Y-%m";
    let groupBy: any = { $month: "$createdAt" };
    if (dayRange) {
      groupBy = { $dayOfYear: "$createdAt" };
      format = "%Y-%m-%d";
    }

    query['AMFB'] = { "$exists": true }
    try {
      const income = await Transaction.aggregate([
        { $match: query },
        {
          $group: {
            _id: groupBy,
            date: { $first: { $dateToString: { format, date: "$$CURRENT.createdAt" } } },
            airtime: {
              $sum: {
                $cond: { if: { "$eq": ["$type", "airtime"] }, then: "$AMFB", else: 0 }
              }
            },
            transfer: {
              $sum: {
                $cond: { if: { "$eq": ["$type", "transfer"] }, then: "$AMFB", else: 0 }
              }
            },
            data: {
              $sum: {
                $cond: { if: { "$eq": ["$type", "data"] }, then: "$AMFB", else: 0 }
              }
            },
            electricity: {
              $sum: {
                $cond: { if: { "$eq": ["$type", "electricity"] }, then: "$AMFB", else: 0 }
              }
            },
            cableTV: {
              $sum: {
                $cond: { if: { "$eq": ["$type", "cableTV"] }, then: "$AMFB", else: 0 }
              }
            },
            all: { $sum: "$AMFB" }
          }
        }
      ])
      return this.successResponse("Query successful", income)
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  }

  public processIncomePerChannel = async (req) => {
    const { startDate, endDate, dayRange } = req.body;
    const query = { createdAt: { $gte: new Date(startDate), $lt: new Date(endDate) } };
    let format = "%Y-%m";
    let groupBy: any = { $month: "$createdAt" };
    if (dayRange) {
      groupBy = { $dayOfYear: "$createdAt" };
      format = "%Y-%m-%d";
    }

    query['AMFB'] = { "$exists": true }
    try {
      const income = await Transaction.aggregate([
        { $match: query },
        {
          $group: {
            _id: groupBy,
            date: { $first: { $dateToString: { format, date: "$$CURRENT.createdAt" } } },
            web: {
              $sum: {
                $cond: { if: { "$eq": ["$channel", "web"] }, then: "$AMFB", else: 0 }
              }
            },
            mobile: {
              $sum: {
                $cond: { if: { "$eq": ["$channel", "mobile"] }, then: "$AMFB", else: 0 }
              }
            },
            all: { $sum: "$AMFB" }
          }
        }
      ])
      return this.successResponse("Query successful", income)
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  }

  public processAddTxnRules = async (req) => {
    try {
      const txnRule = await TxnRule.create();
      if (!txnRule) return this.failureResponse("Rule was not saved");
      return this.successResponse("Rule was saved", txnRule);
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  }
}
