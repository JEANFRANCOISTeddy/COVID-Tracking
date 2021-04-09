import {Context, Contract} from "fabric-contract-api";
import {ICountryProps} from "../models/country.model";
import {IVaccinationPointProps} from "../models/vaccinationPoint.model";
import {VaccinationPointContract} from "../contracts/vaccinationPoint.contract"

const chalk = require('chalk');

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
                        countryCode: "FR",
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
                        countryCode: "FR",
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
    }

    /**
     *
     * addCountry
     *
     * Add a country to the ledger
     *
     * @param ctx
     * @param country - Country object
     */
    public async addCountry(ctx: Context, country: ICountryProps): Promise<void> {
        const exist = await this.countryExists(ctx, country.code);
        if(!exist)
            throw new Error(`A country with this code already exist`);
        else
            await ctx.stub.putState(country.code, Buffer.from(JSON.stringify(country)));
    }

    /**
     *
     * getCountry
     *
     * Get country from chaincode state
     *
     * @param ctx
     * @param code - allow to check if a country exist
     * @returns - country object converted in string
     */
    public async getCountry(ctx: Context, code: string): Promise<string>{
        const countryJSON = await ctx.stub.getState(code);
        if (!countryJSON || countryJSON.length === 0) {
            throw new Error(`The country ${code} does not exist`);
        }
        return this.toString(countryJSON);
    }

    /**
     * 
     * updateCountry
     * 
     * Update an existing country in the world state with provided parameters.
     * 
     * @param ctx 
     * @param country - Country Object
     * @returns 
     */
    public async updateCountry(ctx: Context, country: ICountryProps): Promise<void> {
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
        await ctx.stub.putState(country.code, Buffer.from(JSON.stringify(updatedCountry)));
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
     * @param from - contry which will send the doses
     * @param to - vaccinationPoint which will receive the doses
     * @param dosesToSend - Number of doses
     * @param vaccineName - Name of the vaccine that you want to send 
     */
    async sendDoses(ctx: Context, from: ICountryProps, to: IVaccinationPointProps, dosesToSend: number, vaccineName: string): Promise<void>{
        const countryExist = await this.countryExists(ctx, from.code);
        if(!countryExist) 
            throw new Error(chalk.red(`This country doesn't exist`));

        const countryString = await this.getCountry(ctx, from.code);
        const country = JSON.parse(countryString);

        const vaccinationPointExist = await VaccinationPointContract.vaccinationPointExists(ctx,to.id);
        if(!vaccinationPointExist) 
            throw new Error(chalk.red(`This vaccination point doesn't exist`));

        const vaccinationPointString = await this.getCountry(ctx, to.id);
        const vaccinationPoint = JSON.parse(vaccinationPointString);

        if(country.doseStorage === undefined){
            throw new Error(chalk.red(`${ country.name } has no vaccine`));
        }

        const vaccineDoses = country.doseStorage.forEach(function(element: any, index: any){
            if(element.name === vaccineName){
                return element.doses;
            }
            return undefined;
        })

        if(vaccineDoses === undefined) {
            throw new Error(chalk.red(`The vaccine ${ vaccineName } doesn't exist in your contry`));
        }

        if(vaccineDoses < dosesToSend){
            throw new Error(chalk.red(`${ country.name } doesn't have enough doses to send`));
        }

        if(vaccinationPoint.doseStorage === undefined){
            vaccinationPoint.doseStorage = {
                name: vaccineName,
                doses: dosesToSend
            };
            await ctx.stub.putState(vaccinationPoint.doseStorage.id, Buffer.from(JSON.stringify(vaccinationPoint)));
        } 

        if(vaccinationPoint.doseStorage){
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
     * @returns Contry object transform in string
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