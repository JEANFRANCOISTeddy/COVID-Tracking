import {Context, Contract} from "fabric-contract-api";
import { IVaccinationPointProps } from "../models";
import {Citizen, ICitizenProps} from "../models/citizen.model";

const chalk = require('chalk');

export class CitizenContract extends Contract {

    /**
     *
     * initLedger
     *
     * Ledger initialization with first citizen
     *
     * @param ctx
     */
    public async initLedger(ctx: Context){
        const citizens: ICitizenProps[] = [
            {
                socialSecurityCardId: "012345678910123",
                firstName: "Omar",
                lastName: "Sy",
                age: 18,
                gender: "M",
                nationalityCode: "FR",
                covidResult: false,
                register: true,
                vaccine: [
                    {
                        name: "AstraZeneca",
                        date: "03/03/2021"
                    },
                    {
                        name: "Pfizer",
                        date: "03/04/2021"
                    }
                ],
                vaccinationAvailability: "03/03/2021"
            }
        ];

        for (const citizen of citizens) {
            let index = citizens.indexOf(citizen);
            // It contains a key and value which needs to be written to the transaction's write set.
            await ctx.stub.putState(citizens[index].socialSecurityCardId, Buffer.from(JSON.stringify(citizens[index])));
            console.info('Added <--> ', citizens[index]);
        }
    }

    /**
     *
     * addCitizen
     *
     * Add a citizen to the ledger
     *
     * @param ctx
     * @param citizen - Citizen object
     */
    public async addCitizen(ctx: Context, citizen: ICitizenProps): Promise<void> {
        const exist = await this.citizentExists(ctx, citizen.socialSecurityCardId);
        if(!exist)
            throw new Error(chalk.red(`The citizen with this number already exist`));
        else
            await ctx.stub.putState(citizen.socialSecurityCardId, Buffer.from(JSON.stringify(citizen)));
    }

    /**
    *
    * getCitizen
    *
    * Get citizen from chaincode state
    *
    * @param ctx
    * @param socialSecurityCardId - Citizen card id
    */
    public async getCitizen(ctx: Context, socialSecurityCardId: string): Promise<string>{
        const citizenJSON = await ctx.stub.getState(socialSecurityCardId);
        if (!citizenJSON || citizenJSON.length === 0) {
            throw new Error(chalk.red(`The citizen number ${socialSecurityCardId} does not exist`));
        }
        return this.toString(citizenJSON);
    }


    /**
     *
     * validateSocialSecurityCard
     *
     * Check for valid socialSecurityCard, should be cross checked with government
     *
     * @param socialSecurityCardId - a string of your social security card id
     * @returns - true if valid, no if invalid
     */
    async validateSocialSecurityCard(socialSecurityCardId: string): Promise<boolean> {
        if(socialSecurityCardId){
            return true;
        }
        return false;
    }

    /**
     * 
     * citizentExists
     * 
     * Check if a citizentExists with an id parameters already exists
     * 
     * @param ctx 
     * @param socialSecurityCardId 
     * @returns citizen JSON Object
     */
    public async citizentExists(ctx: Context, socialSecurityCardId: string): Promise<boolean> {
        const citizenJSON = await ctx.stub.getState(socialSecurityCardId);
        return citizenJSON && citizenJSON.length > 0;
    }

    /**
     *
     * signUpVaccinationPoint
     *
     * Sign up a citizen in a vaccination point and add him to le waiting list
     *
     * @param ctx
     * @param disponibilty - disponibilty date in string format "yyyy-mm-dd"
     * @param socialSecurityCardId 
     * @param vaccinationPoint - vaccinationPoint object 
     */
    async signUpVaccinationPoint(ctx: Context, disponibilty: string, socialSecurityCardId: string, vaccinationPoint: IVaccinationPointProps): Promise<void> {
        const exits = await this.citizentExists(ctx, socialSecurityCardId);
        if(!exits){
            throw new Error(chalk.red(`The citizen number ${socialSecurityCardId} does not exist`));
        }

        const citizenJSON = await this.getCitizen(ctx,socialSecurityCardId);
        const citizen = JSON.parse(citizenJSON);

        if(vaccinationPoint.countryCode !== citizen.nationalityCode) {
            throw new Error(chalk.red(`The vaccination point must be in country`));
        }

        citizen.disponibility = disponibilty;
        vaccinationPoint.waitingList?.push(citizen);

        await ctx.stub.putState(socialSecurityCardId, Buffer.from(JSON.stringify(citizenJSON)));
    }

    /**
     * 
     * @param citizen 
     * @returns Object transform into string
     */
    async toString(citizen: any) {
        const properties: string[] = [];
        properties.push("socialSecurityCardId : " + citizen.socialSecurityCardId);
        properties.push("firstName : " + citizen.firstName);
        properties.push("lastName : " + citizen.lastName);
        properties.push("age : " + citizen.age);
        properties.push("gender : " + citizen.gender);
        properties.push("nationalityCode : " + citizen.nationalityCode);
        if(citizen.covidResult !== undefined) {
            properties.push("covidResult : " + citizen.covidResult);
        }
        if(citizen.register !== undefined) {
            properties.push("register : " + citizen.register);
        }
        if(citizen.vaccine !== undefined) {
            properties.push("vaccine : " + citizen.vaccine);
        }
        if(citizen.vaccinationAvailability !== undefined) {
            properties.push("vaccinationAvailability : " + citizen.vaccinationAvailability);
        }
        return "{ Citizen " + properties.join(", ") + " }";
    }

}