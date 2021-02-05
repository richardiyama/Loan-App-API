import { Schema, model, Document } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export interface IUser extends Document {

  wallet?: {
    balance: Number,
    reservationReference: string,
    accountReference: string,
    accountNumber: string
  },
  securityAnswer: string,
  firstName: string,
  lastName: string,
  dateOfBirth: string,
  gender: string,
  role: string,
  securityQuestion: string,
  transactionPin: string,
  password: string,
  bvn: string,
  maritalStatus: string,
  levelOfAccount: string,
  currentLogin: Date,
  profileCompletion: number,
  LGA_ofOrigin: string,
  email: string,
  phone: string

}

export const UserSchema = new Schema({
  fullName: String,
  bvn: String,
  phone: String,
  firstName: String,
  lastName: String,
  dateOfBirth: String,
  email: String,
  gender: String,
  role: String,
  securityQuestion: { type: String, enum: ['What is your dream job?', 'What is the name of your first car?', 'What is your favourite color?', 'What is your best food?'] },
  securityAnswer: String,
  password: String,
  transactionPin: String,
  LGA_ofOrigin: String,
  maritalStatus: String,
  wallet: {
    balance: {
      type: Number,
      default: 0
    },
    reservationReference: String,
    accountReference: String,
    accountNumber: String
  },
  address: String,
  residentialStatus:String,
  userImage: String,
  levelOfAccount: String,
  lastLogin: Date,
  currentLogin: Date,
  auth: {
    accessToken: String,
    kind: String,
  },
  profileCompletion: Number,
  ///////
  admin: {
    status: String,
    role: String,
    maker: String,
    authorizer: String,
  },
  loanDropOff: {
    isDropOff: Boolean,
    loanId: String
  },
  newCustomer: Boolean,
  kycTier: Number,
  resetCode: {
    code: String,
    expiresIn: Date,
  },
  secQuestion: { type: Object },
  secret: { secQuestion: { type: Object } },
  transactionLimits: Object,
  transactionsData: Object,
  personalInfo: {
    mothersmaidenName: String,
    placeOfBirth: String,
    maritalStatus: String,
    secondaryPhoneNumber: String,
    stateOfOrigin: String
  },
  contactInfo: {
    mobileNumber1: String,
    mobileNumber2: String,
    emailAddress: String,
    residentialAddress: {
      streetNumber: String,
      streetName: String,
      state: String,
      city: String,
      pastAddress: String,
      lga: String
    },
    mailAddress: {
      streetNumber: String,
      streetName: String,
      state: String,
      city: String,
      lga: String
    }
  },
  nextOfKinInfo: {
    surName: String,
    firstName: String,
    middleName: String,
    gender: String,
    relationship: String,
    dateOfBirth: String,
    contactInfo: {
      mobileNumber1: String,
      mobileNumber2: String,
      emailAddress: String,
      residentialAddress: {
        streetNumber: String,
        streetName: String,
        state: String,
        city: String,
        lga: String
      }
    }
  },
  employmentInfo: {
    employmentStatus: String,
    employerName: String,
    dateOfEmployment: String,
    streetNumber: String,
    streetName: String,
    stateOfOrigin: String,
    city: String,
    annualSalary: Number,
    taxIdentificationNumber: String,
    businessName: String,
    nameOfInstitution: String,
    commencementDate: String,
    expectedAnnualIncome: Number,
    lga: String
  },
  meansOfIdentification: {
    idType: String,
    idNumber: String,
    idIssueDate: String,
    idExpiryDate: String,
    url: String
  },
  proofOfAddress: {
    billType: String,
    refNumber: String,
    url: String
  }
},
  { timestamps: true }
);

UserSchema.index(
  { phone: 'text', firstName: 'text', lastName: 'text' },
  {
    weights: {
      phone: 3,
      firstName: 2,
      lastName: 2,
    },
  },
);
UserSchema.plugin(mongoosePaginate);

const User = model<IUser>('users', UserSchema);

export default User;
