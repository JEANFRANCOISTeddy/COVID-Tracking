import {Context, Contract} from "fabric-contract-api";
import {Doctor, IDoctorProps} from "../models/doctor.model";
import {CitizenContract} from "./citizen.contract";

const chalk = require('chalk');
export class DoctorContract extends Contract {
    /**
     *
     * initLedger
     *
     * Ledger initialization with first doctor
     *
     * @param ctx
     */
    public async initLedger(ctx: Context){
        const doctors: IDoctorProps[] = [
            {
                socialSecurityCardId: "012345678910123",
                firstName: "Omar",
                lastName: "Sy",
                age: 18,
                gender: "M",
                nationalityCode: "FR",
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
                disponibilityStart: "04/03/2021",
                disponibilityEnd: "03/12/2022"
            }
        ];

        for (const doctor of doctors) {
            let index = doctors.indexOf(doctor);
            await ctx.stub.putState(doctors[index].socialSecurityCardId, Buffer.from(JSON.stringify(doctors[index])));
            console.info('Added <--> ', doctors[index]);
        }
    }

    /**
    *
    * addDoctor
    *
    * Add a doctor to the ledger
    *
    * @param ctx
    * @param doctor - Doctor object
    */
    public async addDoctor(ctx: Context, doctor: IDoctorProps): Promise<void> {
        const exist = await this.doctorExists(ctx, doctor.socialSecurityCardId);
        if(!exist)
            throw new Error(chalk.red(`The citizen with this number already exist`));
        else
            await ctx.stub.putState(doctor.socialSecurityCardId, Buffer.from(JSON.stringify(doctor)));
    }

    /**
    *
    * getDoctor
    *
    * Get doctor from chaincode state
    *
    * @param ctx
    * @param socialSecurityCardId - Doctor card id
    */
    public async getDoctor(ctx: Context, socialSecurityCardId: string): Promise<string>{
        const doctorJSON = await ctx.stub.getState(socialSecurityCardId);
        if (!doctorJSON || doctorJSON.length === 0) {
            throw new Error(chalk.red(`The doctor number ${socialSecurityCardId} does not exist`));
        }
        return this.toString(doctorJSON);
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
     * doctorExists
     *
     * Check if a doctorExists with an id parameters already exists
     *
     * @param ctx
     * @param socialSecurityCardId
     * @returns doctor JSON Object
     */
    public async doctorExists(ctx: Context, socialSecurityCardId: string): Promise<boolean> {
        const doctorJSON = await ctx.stub.getState(socialSecurityCardId);
        return doctorJSON && doctorJSON.length > 0;
    }


    /**
     *
     * validateCovidResult
     *
     *
     *
     * @param socialSecurityCardId - socialSecurityCardId from Citizen
     * @param ctx
     * @param result
     * @returns -
     */
    async validateCovidResult(ctx: Context, socialSecurityCardId: string, result: boolean): Promise<void> {
        const exist = await CitizenContract.citizentExists(ctx,socialSecurityCardId);
        if(!exist){
            throw new Error(chalk.red(`The citizen doesn't exist`));
        }
        const citizenJSON = await ctx.stub.getState(socialSecurityCardId);
        const citizen = JSON.parse(citizenJSON.toString());

        citizen.result = result;

        await ctx.stub.putState(socialSecurityCardId, Buffer.from(JSON.stringify(citizenJSON)));
    }

    /**
     *
     * @param doctor
     * @returns Object transform into string
     */
    async toString(doctor: any) {
        const properties: string[] = [];
        properties.push("socialSecurityCardId : " + doctor.socialSecurityCardId);
        properties.push("firstName : " + doctor.firstName);
        properties.push("lastName : " + doctor.lastName);
        properties.push("age : " + doctor.age);
        properties.push("gender : " + doctor.gender);
        properties.push("nationalityCode : " + doctor.nationalityCode);
        if(doctor.register !== undefined) {
            properties.push("register : " + doctor.register);
        }
        if(doctor.vaccine !== undefined) {
            properties.push("vaccine : " + doctor.vaccine);
        }
        if(doctor.disponibilityStart !== undefined) {
            properties.push("doctor : " + doctor.disponibilityStart);
        }
        if(doctor.disponibilityEnd !== undefined) {
            properties.push("disponibilityEnd : " + doctor.disponibilityEnd);
        }
        return "{ Doctor " + properties.join(", ") + " }";
    }

}