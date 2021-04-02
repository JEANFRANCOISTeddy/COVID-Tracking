import {Context, Contract} from "fabric-contract-api";
import { IVaccinationPointProps } from "../models";
import {Citizen, ICitizenProps} from "../models/citizen.model";

const chalk = require('chalk');
const SHA256  = require('crypto-js/sha256');

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
        console.info(chalk.blue('============= START : Initialize Ledger ==========='));

        const citizens: ICitizenProps[] = [

        ];

        for (const citizen of citizens) {
            let index = citizens.indexOf(citizen);
            // It contains a key and value which needs to be written to the transaction's write set.
            await ctx.stub.putState(citizens[index].socialSecurityCardId, Buffer.from(JSON.stringify(citizens[index])));
            console.info('Added <--> ', citizens[index]);
        }

        console.info(chalk.blue('============= END : Initialize Ledger ==========='));
    }

    /**
     *
     * addCitizen
     *
     * Add a citizen to the ledger
     *
     * @param ctx
     * @param props - Country citizen
     */
    public async addCitizen(ctx: Context, citizen: ICitizenProps): Promise<void> {
        console.info(chalk.green('============= START : Create Country ==========='));

        await ctx.stub.putState(citizen.socialSecurityCardId, Buffer.from(JSON.stringify(citizen)));

        console.info(chalk.green('============= END : Create Country ==========='));
    }

    /**
    *
    * getCitizen
    *
    * Get citizen from chaincode state
    *
    * @param ctx
    * @returns - citizen object converted in string
    */
    public async getCitizen(ctx: Context, socialSecurityCardId: string): Promise<string>{
        console.info(chalk.green('============= START : Get citizen ==========='));

        const citizenJSON = await ctx.stub.getState(socialSecurityCardId);
        if (!citizenJSON || citizenJSON.length === 0) {
            throw new Error(`The citizen number ${socialSecurityCardId} does not exist`);
        }

        console.info(chalk.green('============= END : Get citizen ==========='));

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
     * @returns 
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
     * @param  - ctx, disponibilty date in string format "yyyy-mm-dd"
     * @returns -
     */
    async signUpVaccinationPoint(ctx: Context, disponibilty: string, socialSecurityCardId: string, vaccinationPoint: IVaccinationPointProps): Promise<void> {
        const exits = await this.citizentExists(ctx, socialSecurityCardId);
        if(!exits){
            throw new Error(`The citizen number ${socialSecurityCardId} does not exist`);
        }

        const citizenJSON = await this.getCitizen(ctx,socialSecurityCardId);
        const citizen = JSON.parse(citizenJSON);

        if(vaccinationPoint.countryCode !== citizen.nationalityCode) {
            throw new Error(`The vaccination point must be in country`);
        }

        citizen.disponibility = disponibilty;
        vaccinationPoint.waitingList?.push();

        await ctx.stub.putState(socialSecurityCardId, Buffer.from(JSON.stringify(citizenJSON)));
    }

    /**
     * 
     * @param vaccinationPoint 
     * @returns 
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