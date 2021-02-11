import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export const LoanSchema = new Schema({
  userId: Schema.Types.ObjectId,
  address: String,
  residentialStatus: String,
  userImage: String,
  personalDetails: {
  },
  businessDetails: {
  },
  guarantorsDetails: {
  },
  meansOfIdentification: {
    identificationName:String,
    cardNumber:String
    
  },

  loanDetails: {
  },
  employeeLoanDetails:{

  },
  loanStatus: {type: String, enum: ['In-progress', 'Pending', 'Rejected', 'Approved']},
  ///////
  reason: String,
  offerAccepted: Boolean,
  actionBy: String,
  rejectionReason: String,
  disburseId: String,
  userRequest: {
    name: String,
    dateOfBirth: Date,
    address: String,
    email: String,
    area: String,
    postalCode: String,
    economicActivity: String,
    economicActivityOther: String,
    rankOfSales: String,
    monthlySales: Number,
    costOfGoods: Number,
    monthlyFixedExpenses: Number,
    monthlyVarExpenses: Number,
    otherFinancialExpenses: Number,
    houseHoldExpenses: Number,
    otherIncome: Number,
    businessActivity: String,
    businessActivityOther: String,
    gender: String,
    maritalStatus: String,
    educationLevel: String,
    businessLocation: String,
    validBusinessLicense: String,
    knowAMFB: String,
    age: Number,
    timeAtLocationinMnth: Number,
    bvn: String,
    economicSector: String,
    grossMargin: String,
    noOfDependent: String,
    amount: Number,
    tenure: String,
    houseOwnership: String,
    rcNumber: String
  },
  loanCompute: {
       
  }

}, { timestamps: true })

LoanSchema.plugin(mongoosePaginate);
const Loan = model('loans', LoanSchema);

export default Loan;
