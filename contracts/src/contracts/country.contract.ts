import {Context, Contract} from "fabric-contract-api";
import { Country } from "../models/country.model";

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
        console.info('============= START : Initialize Ledger ===========');
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
            // Assign random id in get the number of miliseconds
            countries[index].id = Math.floor(Math.random() * Date.now());
            // It contains a key and value which needs to be written to the transaction's write set.
            await ctx.stub.putState('COUNTRY' + index, Buffer.from(JSON.stringify(countries[index])));
            console.info('Added <--> ', countries[index]);
        });
        console.info('============= END : Initialize Ledger ===========');
    }

    public async addCountry() {
        console.info('============= START : Create Country ===========');


        console.info('============= END : Create Country ===========');
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
    public async queryCountry(ctx: Context, ): Promise<string> {

        return "";
    }

}