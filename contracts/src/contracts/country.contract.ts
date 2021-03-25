import {Context, Contract} from "fabric-contract-api";
import {Country, ICountryProps} from "../models/country.model";

const chalk = require('chalk');
const SHA256  = require('crypto-js/sha256');

export class CountryContract extends Contract {


    /**
     *
     * addCountry
     *
     * Add a country to the ledger
     *
     * @param ctx
     * @param props - Country object
     */
    public async addCountry(ctx: Context, props: ICountryProps) {
        console.info(chalk.green('============= START : Create Country ==========='));

        const randomId = SHA256(Math.floor(Math.random() * Date.now()));
        await ctx.stub.putState(randomId, Buffer.from(JSON.stringify(props)));

        console.info(chalk.green('============= END : Create Country ==========='));
    }

    /**
     *
     * queryCountry
     *
     * Get country from chaincode state
     *
     * @param ctx
     * @returns - country object converted in string
     */
    public async queryCountry(ctx: Context, countryCode: string): Promise<string> {
        // It contains a key which is to be fetched from the ledger
        const countryAsBytes = await ctx.stub.getState(countryCode);
        if (!countryAsBytes || countryAsBytes.length === 0) {
            throw new Error(chalk.bgRed(`${countryAsBytes} does not exist`));
        }
        console.log(chalk.bgWhite(countryAsBytes.toString()));
        return "";
    }

}