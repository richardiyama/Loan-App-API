// import { config } from "secreta";
// const { MONNIFY_PASSWORD } = config;

// import * as crypto from "crypto";
import { UniversalsService } from '../../@core/common/universals.service';



export class baseWalletService extends UniversalsService {
  // protected calculateHash = async (string) => {
  //   return await crypto
  //     .createHash("sha512")
  //     .update(`${MONNIFY_PASSWORD}|${string}`)
  //     .digest("hex");
  // }
}
