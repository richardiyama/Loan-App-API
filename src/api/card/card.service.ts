import Card from './card.model';
// import logger from '../../util/logger/logger';
import DeletedCard from './deletedCard.model';
import mongoose from 'mongoose';
import { UniversalsService } from '../../@core/common/universals.service';
import { IResponse } from '../account/account.interface';
import { config } from "secreta";
import { Types } from 'mongoose';
const { BUDDY_PAYSTACK_SECRET, PAYSTACK_API } = config;

export class CardService extends UniversalsService {
  public getUserCard = async (user, metaData): Promise<IResponse> => {
    try {
      const card: any = await Card.find({ userId: user._id });
      if (card.length > 0) return this.successResponse('Query was successful', card);
      return this.failureResponse('No card found');
    } catch (error) {
      return this.serviceErrorHandler(metaData, error)
    }
  }

  public getCards = async (req): Promise<IResponse> => {
    let { limit, page } = req.query;
    limit = Number(limit) || 50;
    page = Number(page) || 1;

    try {
      const options = {
        page, limit, sort: { createdAt: 'desc' }, collation: { locale: 'en' }, projection: { authorizationCode: 0 }
      };
      // @ts-ignore
      const cards: any = await Card.paginate({}, options)

      if (cards) {
        return {
          statusCode: 200, status: true, message: 'operation successful', data: {
            docs: cards.docs, meta: {
              total: cards.totalDocs,
              skipped: cards.page * cards.limit,
              perPage: cards.limit,
              page: cards.page,
              pageCount: cards.totalPages,
              hasNextPage: cards.hasNextPage,
              hasPrevPage: cards.hasPrevPage,
            }
          }
        };
      } else {
        return { statusCode: 200, status: false, message: 'No card found', data: null };
      }
    } catch (error) {
      return this.serviceErrorHandler(req, error)
    }
  }

  public deleteCard = async (user, body, metaData): Promise<IResponse> => {

    let query: any = {}
    for (const [key, value] of Object.entries(body)) {
      query = { ...query, [key]: value };
    }
    if (body.cardId) query._id = Types.ObjectId(body.cardId)
    query.userId = Types.ObjectId(user._id);
    delete query.cardId;
    console.log(query, "queryCardAccountqueryCardAccount");

    const session = await mongoose.startSession(); session.startTransaction();
    try {
      let card: any = await Card.findOne(query);
      if (card && card._id) {
        let deletedCard: any = await DeletedCard.create(card.toObject());
        if (deletedCard && deletedCard._id) {
          deletedCard = await Card.deleteOne(query)
          const { n, ok } = deletedCard
          if (n === 1 && ok === 1) {
            await session.commitTransaction(); session.endSession();
            return { statusCode: 200, status: true, message: "Card-account deleted successfully", data: null };
          }
          else {
            await session.abortTransaction(); session.endSession();
            return { statusCode: 400, status: false, message: "Card-account was not deleted", data: null };
          }
        } else {
          await session.abortTransaction(); session.endSession();
          return { statusCode: 400, status: false, message: 'Card-account was not deleted', data: null };
        }
      } else {
        await session.abortTransaction(); session.endSession();
        return { statusCode: 400, status: false, message: 'Card account not found', data: null };
      }
    } catch (error) {
      await session.abortTransaction(); session.endSession();
      return this.serviceErrorHandler(metaData, error)
    }
  }


  public addCard = async (obj, req): Promise<IResponse> => {
    const { authorization_code: authorizationCode, bin, last4, exp_month: expMonth, exp_year: expYear, card_type: cardType,
      bank, country_code: countryCode, brand, account_name: accountName } = obj.authorization;
    const { userId, firstName, lastName, channel, email } = req.body;
    const cardQuery = { authorizationCode, userId };

    try {
      const card = await Card.findOne(cardQuery)
      if (card) {
        return this.failureResponse('Card already exists');
      } else {
        const accountCards = {
          authorizationCode,
          bin,
          last4,
          expMonth,
          expYear,
          channel,
          cardType,
          bank,
          countryCode,
          brand,
          "default": req.body.default,
          userId,
          userFullname: `${firstName} ${lastName}`,
          email,
          accountName
        }
        const insertRes: any = await Card.create(accountCards);
        if (insertRes && insertRes._id) {
          return this.successResponse("Card registered", insertRes._id)
        } else {
          return this.failureResponse("Card was not registered");
        }
      }
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  }

  public verifyReference = async (req): Promise<IResponse> => {
    const ref = req.body.ref;
    const verifyRef = `${PAYSTACK_API}/transaction/verify/${ref}`;
    const headers = { Authorization: BUDDY_PAYSTACK_SECRET, "Content-Type": "application/json" };
    try {
      const response = await this.apiCall(verifyRef, null, headers, "GET", req.hostname);
      const responseData = await response.json();
      const { status, data, message } = responseData;
      if (status === true && message === "Verification successful") {
        return { statusCode: 200, status, message, data };
      } else {
        return { statusCode: 400, status, message, data };
      }
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  }

  public verifyAndAddCard = async (req): Promise<IResponse> => {
    try {
      const verifyRef = await this.verifyReference(req);
      console.log(verifyRef, "verifyRefverifyRefverifyRef")
      const { statusCode, data } = verifyRef;
      if (statusCode === 200) {
        const addCard = await this.addCard(data, req);
        return addCard
      } else {
        return verifyRef
      }
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  }

}
