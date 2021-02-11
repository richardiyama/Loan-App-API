import joi from '@hapi/joi';

export class AccountValidator {

  public openAccountSchema = joi.object({
    firstName: joi.string().required(),
    middleName: joi.any(),
    lastName: joi.string().required(),
    gender: joi.string().valid("F", "M").required(),
    dateOfBirth: joi.string().required(),
    street: joi.string().required(),
    city: joi.string().required(),
    state: joi.string().required(),
    mobileNumber: joi.string().required(),
    photoImage: joi.string().required(),
    signatureImage: joi.any(),
    bvn: joi.string().allow(""),
    secQuestion: joi.object({ key: joi.number().required(), value: joi.string().required() }).required(),
    password: joi.string().required(),
    newCustomer: joi.boolean().required(),
    pin: joi.string().length(4).required(),
    ref: joi.string().required(),
    emailAddress: joi.string().required(),
    accountNumber: joi.array().items(joi.string().length(10).allow()).required(),
    channel: joi.string().required(),
    referrer: joi.string().allow(""),
    referrerAccountNumber: joi.string().allow(""),
    referralUserId: joi.string().allow(""),
    kycTier: joi.number().required(),
    prod: joi.boolean(),
    searchByAccountNumber: joi.string().valid("YES", "NO"),
    accountNumba: joi.number().allow(""),
    personalInfo: joi.object({ maritalStatus: joi.number().required() }).required(),
    employmentInfo: joi.object({ employmentStatus: joi.string().required() }).required()
  });


  public walletToAccountUpgrade = joi.object({
    firstName: joi.string().required(),
    middleName: joi.string().allow(""),
    lastName: joi.string().required(),
    gender: joi.string().valid("F", "M").required(),
    dateOfBirth: joi.string().required(),
    street: joi.string().required(),
    city: joi.string().required(),
    state: joi.string().required(),
    mobileNumber: joi.string().required(),
    photoImage: joi.string().required(),
    signatureImage: joi.string().allow(""),
    bvn: joi.string().required().length(11),
    emailAddress: joi.string().required(),
    referrer: joi.string().allow(""),
    referrerAccountNumber: joi.string().allow(""),
    referralUserId: joi.string().allow(""),
    channel: joi.string().required(),
    prod: joi.boolean(),
    searchByAccountNumber: joi.string().valid("YES", "NO"),
    accountNumba: joi.number().allow(""),
    personalInfo: joi.object({ maritalStatus: joi.number().required() }).required(),
    employmentInfo: joi.object({ employmentStatus: joi.string().required() }).required()
  });

  public createSaveBrigthaSchema = joi.object({
    firstName: joi.string().required(),
    middleName: joi.any(),
    lastName: joi.string().required(),
    gender: joi.string().valid("F", "M").required(),
    dateOfBirth: joi.string().required(),
    street: joi.string().required(),
    city: joi.string().required(),
    state: joi.string().required(),
    mobileNumber: joi.string().required(),
    photoImage: joi.string().required(),
    signatureImage: joi.any(),
    bvn: joi.string().allow(""),
    emailAddress: joi.string().allow("").required(),
    channel: joi.string().required(),
    userId: joi.string().required(),
    kycTier: joi.number(),
    prod: joi.boolean(),
    searchByAccountNumber: joi.string().valid("YES", "NO"),
    accountNumba: joi.number().allow(""),
    personalInfo: joi.object({ maritalStatus: joi.number().required() }).required(),
    employmentInfo: joi.object({ employmentStatus: joi.string().required() }).required()
  });

  public existingAccountSchema = joi.object({
    firstName: joi.string().required(),
    middleName: joi.any(),
    lastName: joi.string().required(),
    gender: joi.string().valid("F", "M").required(),
    dateOfBirth: joi.string().allow(""),
    street: joi.string().required(),
    city: joi.string().required(),
    state: joi.string().required(),
    mobileNumber: joi.string().required(),
    photoImage: joi.string().allow(""),
    signatureImage: joi.any(),
    bvn: joi.string().allow(""),
    secQuestion: joi.object({ key: joi.number().required(), value: joi.string().required() }).required(),
    password: joi.string().required(),
    newCustomer: joi.boolean().required(),
    pin: joi.string().length(4).required(),
    ref: joi.string().required(),
    emailAddress: joi.string().allow(""),
    accountNumber: joi.array().items(joi.string().length(10).allow()).required(),
    maritalStatus: joi.string().allow(""),
    placeOfBirth: joi.string().allow(""),
    channel: joi.string().required(),
    kycTier: joi.number(),
    personalInfo: joi.object({ maritalStatus: joi.number().required() }).required(),
    employmentInfo: joi.object({ employmentStatus: joi.string().required() }).required()
  });

  public transferSchema = joi.object({
    beneficiaryName: joi.string().required(),
    amount: joi.number().required(),
    debitAccount: joi.string().required(),
    creditAccount: joi.string().required(),
    narration: joi.string().allow(""),
    userId: joi.string().required(),
    pin: joi.string().required(),
    channel: joi.string().required(),
    prod: joi.boolean(),
    product: joi.string().valid("airtime", "bill", "transfer")
  })

  public nipTransferSchema = joi.object({
    userId: joi.string().required(),
    nameEnquiryRef: joi.string().required(),
    destinationInstitutionCode: joi.string().required(),
    beneficiaryAccountName: joi.string().required(),
    beneficiaryAccountNumber: joi.number().required(),
    beneficiaryBankVerificationNumber: joi.number().allow(""),
    beneficiaryKYCLevel: joi.number().allow("", null),
    originatorAccountName: joi.string().required(),
    originatorAccountNumber: joi.number().required(),
    originatorBankVerificationNumber: joi.number().required(),
    originatorKYCLevel: joi.number().required(),
    transactionLocation: joi.string().allow(""),
    narration: joi.string().allow(""),
    amount: joi.number().required(),
    channel: joi.string().required(),
    pin: joi.string().required(),
    product: joi.string().valid("airtime", "bill", "transfer")
  })

  public airtimeSchema = joi.object({
    amount: joi.number().required(),
    debitAccount: joi.string().required(),
    narration: joi.string().allow(""),
  })

  public feeSchema = joi.object({
    amount: joi.number().required(),
    channel: joi.string().required()
  })

  public phoneName = joi.object({
    channel: joi.string().valid("web", "mobile").required(),
    mobileNumber: joi.string().required(),
    firstName: joi.string().allow(""),
    middleName: joi.string().allow(""),
    lastName: joi.string().allow("")
  })

  public accNumberSchema = joi.object({
    accountNumber: joi.string().required(),
    channel: joi.string(),
    prod: joi.boolean()
  });

  public mobileNumberSchema = joi.object({
    mobileNumber: joi.string().length(11).required(),
    channel: joi.string(),
    prod: joi.boolean()
  });

  public t24RefSchema = joi.object({
    t24Reference: joi.string().required()
  });

  public smsSchema = joi.object({
    mobileNumber: joi.string().required().length(11),
    message: joi.string().required()
  });

  public nameEnquirySchema = joi.object({
    accountNumber: joi.string().required().length(10),
    destinationInstitutionCode: joi.string().required(),
    channelCode: joi.number().required(),
    channel: joi.string(),
    prod: joi.boolean()
  });

  public verifyTransSchema = joi.object({
    amount: joi.number().required(),
    referenceNumber: joi.string().required(),
    status: joi.string().required(),
    channel: joi.string(),
    prod: joi.boolean()
  });

  public transactionHistorySchema = joi.object({
    accountNumber: joi.string().required().length(10),
    beginDate: joi.string().required(),
    endDate: joi.string().required(),
    channel: joi.string(),
    prod: joi.boolean()
  });

  public userRewardSchema = joi.object({
    referrerAccountNumber: joi.string().length(10),
    referrerUserId: joi.string().required(),
    status: joi.string(),
    referrerMobileNumber: joi.string()
  });

  public adminRewardsSchema = joi.object({
    startDate: joi.string().allow(""),
    endDate: joi.string().allow(""),
    status: joi.boolean().allow(""),
    referrerMobileNumber: joi.string().allow(""),
    referredMobileNumber: joi.string().allow(""),
  });

  public rewardsSchema = joi.object({
    referrerAccountNumber: joi.string().length(10),
    referrerUserId: joi.string(),
    status: joi.string(),
    referrerMobileNumber: joi.string()
  });

  public accountUpgradeSchema = joi.object({
    channel: joi.string().required(),
    prod: joi.boolean(),
    kycTier: joi.number().valid(1, 2, 3).required(),
    personalInfo: joi.object().keys({
      mothersmaidenName: joi.string().allow(""),
      placeOfBirth: joi.string().allow(""),
      maritalStatus: joi.string().allow(""),
      secondaryPhoneNumber: joi.string().allow(""),
      stateOfOrigin: joi.string().allow("")
    }),
    contactInfo: joi.object().keys({
      mobileNumber1: joi.string().required(),
      mobileNumber2: joi.string().allow(""),
      emailAddress: joi.string().email().required(),
      residentialAddress: joi.object().keys({
        streetNumber: joi.string().allow(""),
        streetName: joi.string().allow(""),
        state: joi.string().required().allow(""),
        city: joi.string().required().allow(""),
        pastAddress: joi.string().allow(""),
        lga: joi.string().allow("")
      }),
      mailAddress: joi.object().keys({
        streetNumber: joi.string().allow(""),
        streetName: joi.string().allow(""),
        state: joi.string().allow(""),
        city: joi.string().allow(""),
        lga: joi.string().allow("")
      })
    }),
    nextOfKinInfo: joi.object().keys({
      surName: joi.string().allow(""),
      firstName: joi.string().allow(""),
      middleName: joi.string().allow(""),
      gender: joi.string().valid("M", "F").allow(""),
      relationship: joi.string().allow(""),
      dateOfBirth: joi.string().allow(""),
      contactInfo: joi.object().keys({
        mobileNumber1: joi.string().allow(""),
        mobileNumber2: joi.string().allow(""),
        emailAddress: joi.string().email().allow(""),
        residentialAddress: joi.object().keys({
          streetNumber: joi.string().allow(""),
          streetName: joi.string().allow(""),
          state: joi.string().allow(""),
          city: joi.string().allow(""),
          lga: joi.string().allow("")
        })
      })
    }),
    employmentInfo: joi.object().keys({
      employmentStatus: joi.string().required(),
      employerName: joi.string().allow(""),
      dateOfEmployment: joi.string().allow(""),
      streetNumber: joi.string().allow(""),
      streetName: joi.string().allow(""),
      stateOfOrigin: joi.string().allow(""),
      city: joi.string().allow(""),
      annualSalary: joi.number().allow(""),
      taxIdentificationNumber: joi.any().allow(""),
      businessName: joi.string().allow(""),
      nameOfInstitution: joi.string().allow(""),
      commencementDate: joi.string().allow(""),
      expectedAnnualIncome: joi.number().allow(""),
      lga: joi.string().allow("")
    }),
    meansOfIdentification: joi.object({
      idType: joi.string().required(),
      idNumber: joi.string().required(),
      idIssueDate: joi.string().allow(""),
      idExpiryDate: joi.string().allow(""),
      url: joi.string().allow("")
    }),
    proofOfAddress: joi.object().keys({
      billType: joi.string().required(),
      refNumber: joi.string().required(),
      url: joi.string().allow("")
    })
  })
}

