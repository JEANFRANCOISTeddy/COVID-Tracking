import {Context, Contract} from "fabric-contract-api";
import {Country, ICountryProps} from "../models/country.model";
import {IVaccinationPointProps} from "../models/vaccinationPoint.model";

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
    public async initLedger(ctx: Context){
        console.info(chalk.blue('============= START : Initialize Ledger ==========='));

        const countries: ICountryProps[] = [
            {
                code: "FR",
                name: "France",
                populationSize: 66_000_000,
                doseStorage: [
                    {
                        id: "1547899",
                        name: "Pfizer",
                        doses: 50_000_000,
                        personnelSize: 2500
                    },
                    {
                        id: "698984251",
                        name: "AstraZeneca",
                        doses: 44_000_000,
                        personnelSize: 3700
                    }
                ],
                vaccinationPoint: [
                    {
                        id: "8", 
                        name: "Centre Hospitalier de Saint-Denis",
                        address: "2 Rue du Dr Delafontaine",
                        postalCode: "93200",
                        city: "Saint-Denis",
                        doseStorage: [
                            {
                                name: "AstraZeneca",
                                doses: 200_000
                            }
                        ],
                        personnelSize: 2500,
                    },
                    {
                        id: "9",
                        name: "Centre de Vaccination - Salle Olympe de Gouges",
                        address: "15 Rue Merlin",
                        postalCode: "75011",
                        city: "Paris",
                        doseStorage: [
                            {
                                name: "Pfizer",
                                doses: 350_000
                            }
                        ],
                        personnelSize: 7500,
                    }
                ]
            },
        ];

        for (const country of countries) {
            let index = countries.indexOf(country);
            // It contains a key and value which needs to be written to the transaction's write set.
            await ctx.stub.putState(countries[index].code, Buffer.from(JSON.stringify(countries[index])));
            console.info('Added <--> ', countries[index]);
        }

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
    public async addCountry(ctx: Context, country: ICountryProps): Promise<void> {
        console.info(chalk.green('============= START : Create Country ==========='));

        await ctx.stub.putState(country.code, Buffer.from(JSON.stringify(country)));

        console.info(chalk.green('============= END : Create Country ==========='));
    }

    /**
     *
     * getCountry
     *
     * Get country from chaincode state
     *
     * @param ctx
     * @returns - country object converted in string
     */
    public async getCountry(ctx: Context, code: string): Promise<string>{
        console.info(chalk.green('============= START : Get Country ==========='));

        const countryJSON = await ctx.stub.getState(code);
        if (!countryJSON || countryJSON.length === 0) {
            throw new Error(`The country ${code} does not exist`);
        }

        console.info(chalk.green('============= END : Get Country ==========='));

        return this.toString(countryJSON);
    }

    /**
     * 
     * updateCountry
     * 
     * Update an existing country in the world state with provided parameters.
     * 
     * @param ctx 
     * @param country 
     * @returns 
     */
    public async updateCountry(ctx: Context, country: ICountryProps): Promise<void> {
        console.info(chalk.green('============= START : Country update ==========='));

        const exists = await this.countryExists(ctx, country.code);
        if (!exists) {
            throw new Error(`The country ${country.code} does not exist`);
        }

        const updatedCountry = {
            code: country.code,
            name: country.name,
            populationSize: country.populationSize,
            doseStorage: country.doseStorage,
            vaccinationPoint: country.vaccinationPoint
        };

        console.info(chalk.green('============= END : Country update ==========='));

        return ctx.stub.putState(country.code, Buffer.from(JSON.stringify(updatedCountry)));
    }

    /**
     * 
     * countryExists
     * 
     * Check if a country with a code parameters already exists
     * 
     * @param ctx 
     * @param code 
     * @returns 
     */
    public async countryExists(ctx: Context, code: string): Promise<boolean> {
        const countryJSON = await ctx.stub.getState(code);
        return countryJSON && countryJSON.length > 0;
    }

    /**
     * 
     * sendDoses
     * 
     * Check if a Country has enought doses of a specify vaccin to send send him in a vaccination point
     * 
     * @param ctx 
     * @param code 
     * @param to 
     */
    async sendDoses(ctx: Context, from: ICountryProps, to: IVaccinationPointProps, dosesToSend: number, vaccineName: string): Promise<void>{
        const countryString = await this.getCountry(ctx, from.code);
        const country = JSON.parse(countryString);

        const vaccinationPointString = await this.getCountry(ctx, to.id);
        const vaccinationPoint = JSON.parse(vaccinationPointString);

        if(vaccinationPoint.name === undefined){
            throw new Error(chalk.red(`${ vaccinationPoint.name } doesn't exist`));
        }

        if(country.doseStorage === undefined){
            throw new Error(chalk.red(`${ country.name } has no vaccine.`));
        }

        const vaccineDoses = country.doseStorage.forEach(function(element: any, index: any){
            if(element.name === vaccineName){
                return element.doses;
            }
            return undefined;
        })

        if(vaccineDoses == undefined) {
            throw new Error(chalk.red(`The vaccine ${ vaccineName } doesn't exist in your contry`));
        }

        if(vaccineDoses < dosesToSend){
            throw new Error(chalk.red(`${ country.name } doesn't have enough doses to send`));
        }

        if(vaccinationPoint.doseStorage === undefined && vaccinationPoint.name !== undefined){
            vaccinationPoint.doseStorage = {
                id: SHA256(Math.floor(Math.random() * Date.now())),
                name: vaccineName,
                doses: dosesToSend
            };
            await ctx.stub.putState(vaccinationPoint.doseStorage.id, Buffer.from(JSON.stringify(vaccinationPoint)));
        } 

        if(vaccinationPoint.doseStorage !== undefined){
            vaccinationPoint.doseStorage.doses += dosesToSend;
            await ctx.stub.putState(vaccinationPoint.doseStorage.id, Buffer.from(JSON.stringify(vaccinationPoint)));
        } 
        
        country.doseStorage.vaccineDoses -= dosesToSend;

        await ctx.stub.putState(from.code, Buffer.from(JSON.stringify(country)));
        await ctx.stub.putState(to.name, Buffer.from(JSON.stringify(to)));
    }

    /**
     * 
     * Create new method toString
     * 
     * @param country 
     * @returns
     */
    async toString(country: any) {
        const properties: string[] = [];
        properties.push("code : " + country.code);
        properties.push("name : " + country.name);
        properties.push("populationSize : " + country.populationSize);
        if(country.doseStorage !== undefined) {
            properties.push("doseStorage : " + country.doseStorage);
        }
        if(country.vaccinationPoint !== undefined) {
            properties.push("vaccinationPoint : " + country.vaccinationPoint);
        }
        return "{ Country " + properties.join(", ") + " }";
    }
}