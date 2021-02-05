/* eslint-disable import/prefer-default-export */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import mongoose from 'mongoose';
import { config } from 'secreta';
// import encrypt = require("mongoose-encryption")

const { MONGODB_URL } = config;

export const connectMongo = () => {
  mongoose.connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
   useCreateIndex: true,
   useFindAndModify: false,
   autoIndex: false
  });
};

const { connection } = mongoose;
connection.on('error', (error: any) => {
  console.log(`MongoDB database connection error: ${error}`);
  throw error;
});
// const encKey = "kZpVAjBTI2FU9HlRkp+f1I/Lz7FKA2alimUk5RRPyyM=";
// const sigKey = "xQT3Udu8xkn-_1r-bW0TqFy17336j6VUPYillNFRFl6z07ckkBprYl2TxEFTT1QxTW7WqAJnmvWt3_-qzUWMWA";
// mongoose.plugin(encrypt, { encryptionKey: encKey, signingKey: sigKey, encryptedFields: ['secret'] });

connection.once('open', function () {
  console.log('MongoDB database connection opened successfully.');
});

