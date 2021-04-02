/**
 * Doctor class
 */

import { ICitizenProps } from "./citizen.model";

export interface IDoctorProps extends ICitizenProps {
    nationalityCode: string;
}

export class Doctor implements IDoctorProps{
    id?: string;
    socialSecurityCardId: string; 
    firstName: string;
    lastName: string;
    age: number;
    gender: string;
    nationalityCode: string;
    register?: boolean;
    vaccine?: Array<object>;
    disponibilityStart: string;
    disponibilityEnd: string;

    constructor(props :IDoctorProps, disponibilityStart: string, disponibilityEnd: string) {
        this.socialSecurityCardId = props.socialSecurityCardId,
        this.firstName = props.firstName,
        this.lastName = props.lastName,
        this.age = props.age,
        this.gender = props.gender,
        this.nationalityCode = props.nationalityCode,
        this.disponibilityStart = disponibilityStart,
        this.disponibilityEnd = disponibilityEnd
    }
}