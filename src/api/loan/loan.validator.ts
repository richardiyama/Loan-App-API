import joi from '@hapi/joi';


export const personalDetailsSchema = joi.object({
  address: joi.string().required(),
  residentialStatus: joi.string().required(),
  maritalStatus: joi.string().required()
});

export const businessDetailsSchema = joi.object({
  companyName: joi.string().required(),
  companyState: joi.string().required(),
  companyCity: joi.string().required(),
  monthlyTurnOver: joi.string().required(),
  natureOfBusiness: joi.string().required(),
  referenceNumber: joi.string().required(),
  businessLocation: joi.string().required(),
  businessProof: joi.string().required(),
  accountStatement: joi.string().required(),
});

export const employeeDetailsSchema = joi.object({
  companyName: joi.string().required(),
  companyState: joi.string().required(),
  companyCity: joi.string().required(),
  salaryRange: joi.string().required(),
  salaryPayDay: joi.string().required(),
  offerLetter: joi.string().required(),
  accountStatement: joi.string().required(),
});


export const uploadbusinessDetailsDocumentSchema = joi.object({
  key: joi.string().required(), 
  imageData: joi.string().required(), 
  folder: joi.string().required(), 
  fileName: joi.string().required()
});

export const uploadDocumentSchema = joi.object({
  key: joi.string().required(), 
  imageData: joi.string().required(), 
  folder: joi.string().required(), 
  fileName: joi.string().required()
});

export const guarantorsDetailsSchema = joi.object({
  guarantorOne: joi.object().required(),
  guarantorTwo: joi.object().required(),
  contacts: joi.object().required(),
})

export const meansOfIdentificationSchema = joi.object({
  identificationName: joi.string().required(),
  cardNumber: joi.string().required(),
  utility: joi.string().required(),
  identification: joi.string().required(),
 
});

export const calculateLoanSchema = joi.object({
  principal: joi.number().required(),
  tenor: joi.number().required(),
  forWhom: joi.string().required()
});

export const setInterestRateSchema = joi.object({
  interestRate: joi.number().required(),
  tenor: joi.number().required(),
  processingFee: joi.number().required(),
  forWhom: joi.string().required(),
});

export const BVNSchema = joi.object({
  bvn: joi.string().length(11).required(),
});

export const AddressSchema = joi.object({
  
    street: joi.string().required(),
    lga: joi.string().required(),
    address: joi.string().required(),
    city: joi.string().required(),
    state: joi.string().required(),
    landmark: joi.string().required(),
    webHookUrl: joi.string().required(),
    idType: joi.string().required(),
    idNumber: joi.string().required(),
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    mobileNumber: joi.string().required(),
    dob: joi.string().required()
});

export const NinNumberSchema = joi.object({
  

  nin: joi.string().required(),
  firstName: joi.string().required(), 
  lastName: joi.string().required(), 
  dob: joi.string().required() 
});

export const DriverLicenceSchema = joi.object({
  

  licenseNumber: joi.string().required(),
  firstName: joi.string().required(),
  lastName: joi.string().required(),
  dob:joi.string().required()
});



export const NinPhoneSchema = joi.object({
  

  firstName: joi.string().required(),
        lastName: joi.string().required(),
        dob: joi.string().required(),
        mobileNumber: joi.string().required()
});

export const LoanSettingSchema = joi.object({
  interestRate: joi.number().required(),
  insuranceFee: joi.number().required(),
  adminFee: joi.number().required(),
});

export const getLoansSchema = joi.object({
  userId: joi.string(),
  channel: joi.string(),
  applicationStatus: joi.string(),
  offerAccepted: joi.boolean(),
  mobileNumber: joi.string()
});

export const fetchLoanAdminSchema = joi.object({
  startDate: joi.string().allow(""),
  endDate: joi.string().allow(""),
  channel: joi.string().allow(""),
  applicationStatus: joi.string().allow(""),
  actionBy: joi.string().allow(""),
  mobileNumber: joi.string().allow(""),
  minAmount: joi.number().allow(""),
  maxAmount: joi.number().allow(""),
  customerName: joi.string().allow(""),
  process: joi.string().allow(""),
  loanID: joi.string().allow(""),
});

export const crcInputSchema = joi.object({
  bvn: joi.string().length(11).required(),
  userId: joi.string().required()
});

export const searchSchema = joi.object({
  search: joi.string().required()
});

export const checkPerformanceSchema = joi.object({
  bvn: joi.string().length(11).required(),
  loanAmount: joi.number().required()
});


export const loanRequestSchema = joi.object({
  crReport: joi.any(),
  grossMargin: joi.string(),
  noOfDependent: joi.number().required(),
  amount: joi.number().min(50000).required(),
  tenure: joi.string().valid("1 month", "2 months", "3 months").required(),
  name: joi.string().required(),
  dateOfBirth: joi.date().required(),
  mobileNumber: joi.string().length(11).required(),
  channel: joi.string().required(),
  address: joi.string().required(),
  email: joi.string().email().required(),
  area: joi.string().required(),
  postalCode: joi.string(),
  economicActivity: joi.string().required(),
  economicActivityOther: joi.string(),
  rankOfSales: joi.string().required(),
  monthlySales: joi.number().required(),
  costOfGoods: joi.number().required(),
  monthlyFixedExpenses: joi.number().required(),
  monthlyVarExpenses: joi.number().required(),
  otherFinancialExpenses: joi.number().required(),
  houseHoldExpenses: joi.number().required(),
  otherIncome: joi.number().required(),
  businessActivity: joi.string().valid("beauty salons and hair accessories",
    "provisions supermarket and grocery stores", "fashion designing and tailoring materials",
    "clothes boutiques and textile materials trading", "soft drinks yoghurt juice and water",
    "footwear, bags and leather trading", "articles and general trading activities", "raw food stuff",
    "restaurants and cooked food", "others").required(),
  businessActivityOther: joi.string().allow(""),
  gender: joi.string().valid("male", "female", "other"),
  maritalStatus: joi.string().required(),
  educationLevel: joi.string().valid("none", "primary", "secondary", "technical", "graduate").required(),
  businessLocation: joi.string().valid("independent establishment", "in an association", "regular market place",
    "temporary space", "in a big shopping complex").required(),
  validBusinessLicense: joi.string().valid("yes", "no").required(),
  rcNumber: joi.string().allow(""),
  knowAMFB: joi.string().valid("loan officer", "advertisements/brochure", "family/friend recommendations", "others"),
  age: joi.number().required(),
  timeAtLocationinMnth: joi.number().required(),
  bvn: joi.string().length(11).required(),
  userId: joi.string().required(),
  houseOwnership: joi.string().valid("sole owned", "family owned", "rented", "others"),
  economicSector: joi.string().valid("health care", "construction", "manufacturing", "communication $ telecom",
    "media & entertainments", "fashion & personal care", "transportation", "automobiles machines & spare parts",
    "education & educational services", "trade & commerce", "agricultural product & livestock",
    "electricals/electronics services", "food & drinks", "others").required()
})


export const loanDropOffSchema = joi.object({
  loanId: joi.string().required(),
  grossMargin: joi.string().allow(""),
  noOfDependent: joi.number().allow(""),
  amount: joi.number().min(50000).allow(""),
  tenure: joi.string().valid("1 month", "2 months", "3 months").allow(""),
  name: joi.string().allow(""),
  dateOfBirth: joi.date(),
  mobileNumber: joi.string().length(11).required(),
  channel: joi.string().required(),
  address: joi.string().allow(""),
  email: joi.string().email().allow(""),
  area: joi.string().allow(""),
  postalCode: joi.string().allow(""),
  economicActivity: joi.string().allow(""),
  economicActivityOther: joi.string().allow(""),
  rankOfSales: joi.string().allow(""),
  monthlySales: joi.number().allow(""),
  costOfGoods: joi.number().allow(""),
  monthlyFixedExpenses: joi.number().allow(""),
  monthlyVarExpenses: joi.number().allow(""),
  otherFinancialExpenses: joi.number().allow(""),
  houseHoldExpenses: joi.number().allow(""),
  otherIncome: joi.number().allow(""),
  businessActivity: joi.string().valid("beauty salons and hair accessories",
    "provisions supermarket and grocery stores", "fashion designing and tailoring materials",
    "clothes boutiques and textile materials trading", "soft drinks yoghurt juice and water",
    "footwear, bags and leather trading", "articles and general trading activities", "raw food stuff",
    "restaurants and cooked food", "others").allow(""),
  businessActivityOther: joi.string().allow(""),
  gender: joi.string().valid("male", "female", "other").allow(""),
  maritalStatus: joi.string().allow(""),
  educationLevel: joi.string().valid("none", "primary", "secondary", "technical", "graduate").allow(""),
  businessLocation: joi.string().valid("independent establishment", "in an association", "regular market place",
    "temporary space", "in a big shopping complex").allow(""),
  validBusinessLicense: joi.string().valid("yes", "no").allow(""),
  rcNumber: joi.string().allow("").allow(""),
  knowAMFB: joi.string().valid("loan officer", "advertisements/brochure", "family/friend recommendations", "others").allow(""),
  age: joi.number().allow(""),
  timeAtLocationinMnth: joi.number().allow(""),
  bvn: joi.string().length(11).allow(""),
  userId: joi.string().required(),
  houseOwnership: joi.string().valid("sole owned", "family owned", "rented", "others").allow(""),
  economicSector: joi.string().valid("health care", "construction", "manufacturing", "communication $ telecom",
    "media & entertainments", "fashion & personal care", "transportation", "automobiles machines & spare parts",
    "education & educational services", "trade & commerce", "agricultural product & livestock",
    "electricals/electronics services", "food & drinks", "others").allow("")
})

export const startLoanSchema = joi.object({
  userId: joi.string().required(),
  mobileNumber: joi.string().length(11).required(),
  channel: joi.string().required(),
  name: joi.string().required()
})

export const discontinueLoanSchema = joi.object({
  loanId: joi.string().required(),
  channel: joi.string().required()
})

export const loanStatusUpdateSchema = joi.object({
  loanId: joi.string().required(),
  status: joi.string().required(),
  existingAdminMobileNumber: joi.string().length(11).required(),
  pin: joi.string().required(),
})


export const disburseLoanSchema = joi.object({
  loanId: joi.string().required(),
  pin: joi.string().required(),
  drawDownAccount: joi.string().required(),
  offerAccepted: joi.boolean().required(),
  rejectionReason: joi.string().allow(""),
  channel: joi.string(),
  prod: joi.boolean()
})


export const editLoanSettingsSchema = joi.object({
  settingsId: joi.string().required(),
  adminFee: joi.number(),
  insuranceFee: joi.number(),
  interestRate: joi.number()
})

export const mobileNumberSchema = joi.object({
  mobileNumber: joi.string().required(),
  channel: joi.string(),
  prod: joi.boolean()
})

export const loanEvaluationSchema = joi.object({
  id: joi.string().required()
})
