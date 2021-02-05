
import { config } from "secreta";
const { MONGODB_URL, ACCION_API_URL } = config;
import Agenda = require("agenda");
import Loan from "../loan/loan.model";
import { UniversalsService } from "../../@core/common/universals.service";
// import moment from "moment";

const mongoConnectionString = MONGODB_URL;
const apiResponse = {
    "loanAgeInDays": 38,
    "delinqent": "No",
    "approvedLoanAmount": "130000.00",
    "loanBalance": "130000.00",
    "responseCode": "00",
    "responseDescription": "SUCCESSFUL"
}
const agenda = new Agenda({ db: { address: mongoConnectionString, options: { useUnifiedTopology: true } } });
export class loanJobsService extends UniversalsService {

    public loanDPD = async (loanId, channel) => {
        const reqBody = { loanId }
        try {
            const api = `${ACCION_API_URL}/loan/dpd`;
            const response = await this.apiCall(api, reqBody, await this.setHeader(channel), "POST", "api.accionmfbd.com");
            const responseData = await response.json();
            return responseData
        } catch (error) {
            this.serviceErrorHandler({}, error)
        }
    }

    private chargeCard = async () => {
        try {

        } catch (error) {

        }
    }

    private isLastMonth = async (term, lastTerm) => {
        console.log(term, lastTerm, "llllllllllllllllll");

        if (term == lastTerm) {
            return "repaid";
        }
        return "disbursed";
    }


    public processLoanJobs = async () => {
        await agenda.define('check due loans', async job => {
            const date = new Date();
            const start = new Date(date.getFullYear(), date.getMonth() + 1, date.getDate() + 8);
            const end = new Date(date.getFullYear(), date.getMonth() + 1, date.getDate() + 9);
            console.log(start, end, "new Date(date.getFullYear(), date.getMonth() + 1, date.getDate() + 8)");

            const loans: any = await Loan.find({ applicationStatus: "disbursed", "schedule.loanSchedule.dueDate": "2020-11-13T10:38:57.302+00:00" })
            // await this.pullData(loan)
            // console.log(loan[0], ACCION_API_URL, "loanloan");
            for (let loan of loans) {
                // const { disburseId, channel, schedule, recommended } = loan;
                const { disburseId, schedule, recommended } = loan;
                console.log(disburseId, "=======================");
                // const checkDPD = await this.loanDPD(disburseId, channel);
                const checkDPD = apiResponse;

                let { delinqent, responseCode, loanAgeInDays } = checkDPD;
                delinqent = delinqent.toLowerCase()
                if (responseCode == "00") {
                    if (delinqent == "yes") {
                        this.chargeCard()
                    } else if (delinqent == "no") {
                        let term
                        console.log("111111111");

                        if (loanAgeInDays < 40) {
                            console.log(loanAgeInDays, "@@@@@@@@@@@@@@@@@@@@");

                            schedule[0].loanSchedule[0].hasPaid = true;
                            term = 1
                        } else if (loanAgeInDays >= 40 && loanAgeInDays < 70) {
                            schedule[0].loanSchedule[1].hasPaid = true;
                            term = 2
                        } else {
                            schedule[0].loanSchedule[2].hasPaid = true;
                            term = 3
                        }
                        loan.applicationStatus = await this.isLastMonth(term, recommended.recommendedTerm.split('')[0]);
                        console.log(loan, "###################");

                        loan.save()
                    }
                }
            }


        });

        // (async function () { // IIFE to give access to async/await
        await agenda.start();

        await agenda.every('3 minute', 'check due loans');

        // })();
    }


    // private pullData = async (data) => {
    //     console.log(data[0].userId, "_________");
    // }

}


