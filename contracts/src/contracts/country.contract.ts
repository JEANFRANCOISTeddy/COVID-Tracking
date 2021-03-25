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



}