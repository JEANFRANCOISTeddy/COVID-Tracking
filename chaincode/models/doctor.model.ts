/**
 * Doctor class
 */

import { ICitizenProps } from "./citizen.model";

export interface IDoctorProps extends ICitizenProps {
}

export class Doctor implements IDoctorProps{
    id?: string;
    firstName: string;
    lastName: string;
    age: number;
    gender: string;
    register?: boolean;
    vaccine?: Array<object>;
    disponibilityStart?: string;
    disponibilityEnd?: string;

    constructor(props :IDoctorProps) {
        this.firstName = props.firstName,
        this.lastName = props.lastName,
        this.age = props.age,
        this.gender = props.gender
    }
}