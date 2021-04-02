import {Context, Contract} from "fabric-contract-api";
import { ICitizenProps, IDoctorProps } from "../models";
import {VaccinationPoint, IVaccinationPointProps} from "../models/vaccinationPoint.model";

const chalk = require('chalk');
const SHA256  = require('crypto-js/sha256');

export class VaccinationPointContract extends Contract {

    /**
     *
     * initLedger
     *
     * Ledger initialization with first vaccinationPoints
     *
     * @param ctx
     */
    public async initLedger(ctx: Context) {
        console.info(chalk.blue('============= START : Initialize Ledger ==========='));

        const vaccinationPoints: IVaccinationPointProps[] = [
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
        
        for (const vaccinationPoint of vaccinationPoints) {
            let index = vaccinationPoints.indexOf(vaccinationPoint);
            await ctx.stub.putState(vaccinationPoints[index].id, Buffer.from(JSON.stringify(vaccinationPoints[index])));
            console.info('Added <--> ', vaccinationPoints[index]);
        }

        console.info(chalk.blue('============= END : Initialize Ledger ==========='));
    }

    /**
     *
     * addVaccinationPoint
     *
     * Add a vaccinationPoint to the ledger
     *
     * @param ctx
     * @param props - Country object
     */
    public async addVaccinationPoint(ctx: Context, vaccinationPoint: IVaccinationPointProps): Promise<void> {
        console.info(chalk.green('============= START : Create Country ==========='));

        // Assign random id by using sha256 hash function
        vaccinationPoint.id = SHA256(Math.floor(Math.random() * Date.now()));
        if(vaccinationPoint.id !== undefined)
            await ctx.stub.putState(vaccinationPoint.id, Buffer.from(JSON.stringify(vaccinationPoint)));
        else
            throw new Error(`External error`);

        console.info(chalk.green('============= END : Create Country ==========='));
    }

    /**
     *
     * getVaccinationPoint
     *
     * Get vaccinationPoint from chaincode state
     *
     * @param ctx, id
     * @returns - vaccinationPoint object converted in string
     */
    public async getVaccinationPoint(ctx: Context, id: string): Promise<string>{
        console.info(chalk.green('============= START : Get Country ==========='));

        const vaccinationPointJSON = await ctx.stub.getState(id);
        if (!vaccinationPointJSON || vaccinationPointJSON.length === 0) {
            throw new Error(`The vaccinationPoint ${id} does not exist`);
        }

        console.info(chalk.green('============= END : Get Country ==========='));

        return this.toString(vaccinationPointJSON);
    }

    /**
     * 
     * vaccinationPointExists
     * 
     * Check if a vaccinationPoint with an id parameters already exists
     * 
     * @param ctx 
     * @param id 
     * @returns 
     */
    public async vaccinationPointExists(ctx: Context, id: string): Promise<boolean> {
        const vaccinationPointJSON = await ctx.stub.getState(id);
        return vaccinationPointJSON && vaccinationPointJSON.length > 0;
    }

    /**
     * 
     * assignDoctorToCitizen
     * 
     * Assign an available doctor to do a vaccination for a citizen or a group of citizen
     * 
     * @param  ctx, doctor, citizen
     * @returns 
     */
    public async assignDoctorToCitizen(ctx: Context, doctor: IDoctorProps, citizen: ICitizenProps ){
        
    }

    /**
     * 
     * Create new method toString
     * 
     * @param vaccinationPoint 
     * @returns
     */
    async toString(vaccinationPoint: any) {
        const properties: string[] = [];
        properties.push("id : " + vaccinationPoint.id);
        properties.push("name : " + vaccinationPoint.name);
        properties.push("address : " + vaccinationPoint.address);
        properties.push("postalCode : " + vaccinationPoint.postalCode);
        properties.push("city : " + vaccinationPoint.city);
        properties.push("countryCode : " + vaccinationPoint.countryCode);
        if(vaccinationPoint.waitingList !== undefined) {
            properties.push("waitingList : " + vaccinationPoint.waitingList);
        }
        if(vaccinationPoint.doseStorage !== undefined) {
            properties.push("doseStorage : " + vaccinationPoint.doseStorage);
        }
        if(vaccinationPoint.personnelSize !== undefined) {
            properties.push("personnelSize : " + vaccinationPoint.personnelSize);
        }
        return "{ VaccinationPoint " + properties.join(", ") + " }";
    }

}