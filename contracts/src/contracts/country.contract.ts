import {Context, Contract} from "fabric-contract-api";
import {Country, ICountryProps} from "../models/country.model";

const chalk = require('chalk');
const SHA256  = require('crypto-js/sha256');

export class CountryContract extends Contract {

    /**
     *
     * initLedger
     *
     * Ledger initialization with first countries
     *
     * @param ctx
     */
    public async  initLedger(ctx: Context) {
        console.info(chalk.blue('============= START : Initialize Ledger ==========='));

        const countries: Country[] = [
            {
                code: "FR",
                name: "France",
                populationSize: 66_000_000,
                doseStorage: [
                    {
                        name: "Pfizer",
                        doses: 50_000_000
                    },
                    {
                        name: "AstraZeneca",
                        doses: 44_000_000
                    }
                ],
                vaccinationPoint: [
                    {
                        name: "Centre Hospitalier de Saint-Denis",
                        address: "2 Rue du Dr Delafontaine",
                        postalCode: "93200",
                        city: "Saint-Denis",
                        doses: 51_000
                    },
                ]
            },
        ];

        countries.forEach(function (country, index) {
            // Assign random id by using sha256 hash function
            countries[index].id = SHA256(Math.floor(Math.random() * Date.now()));
            // It contains a key and value which needs to be written to the transaction's write set.
            ctx.stub.putState('COUNTRY' + index, Buffer.from(JSON.stringify(countries[index])));
            console.info('Added <--> ', countries[index]);
        });

        console.info(chalk.blue('============= END : Initialize Ledger ==========='));
    }

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