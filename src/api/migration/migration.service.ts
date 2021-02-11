import { UniversalsService } from '../../@core/common/universals.service';
import User from '../user/user.model';
import { Types } from 'mongoose';
import Transaction from '../transaction/transaction.model';
// import credentialHistory from '../user/credentials.model';
import bcrypt from 'bcrypt';

export class MigrationService extends UniversalsService {

  public processAddNewField = async (req) => {
    try {
      const users: any = await User.findOne({ mobileNumber: "08182447114" });
      // for (let user of users) {
      let { secQuestion } = users;
      const _id = Types.ObjectId(users._id);
      secQuestion = { key: secQuestion.key, value: await bcrypt.hash(secQuestion.value, 10) };
      console.log(secQuestion, _id, "ids");

      await User.updateOne({ _id }, { secQuestion })


      // if (!user.transactionsData) {
      //   await User.updateOne({ _id }, { transactionsData: { date: new Date().toDateString(), cummulativeDailyTransaction: 0 } });
      // }
      // }
    } catch (error) {
      console.log(error, "errorrrrrrrrrrr");

      // return this.serviceErrorHandler(req, error);
    }
  }

  public migrateTransaction = async (req) => {
    try {
      for (let item of req.body.users) {
        const { _id, createdAt, updatedAt, ...rest } = item
        await Transaction.create({
          updatedAt: new Date(updatedAt.date),
          createdAt: new Date(createdAt.date),
          ...rest
        })
      }
      return this.successResponse("Transaction Data Migration successful");
    } catch (error) {
      return this.serviceErrorHandler(req, error);

    }
  }
}
