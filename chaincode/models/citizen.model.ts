/**
 * Citizen class
 */

export interface ICitizenProps {
    socialSecurityCardId: string; // check if your a citizen in using numbers on your social security card
    firstName: string;
    lastName: string;
    age: number;
    gender: string;
    nationalityCode: string;
    covidResult?: boolean;
    register?: boolean;
    disponibility?: string;
    vaccine?: Array<object>;
    vaccinationAvailability?: string; 
}

export class Citizen implements ICitizenProps {
    socialSecurityCardId: string;
    firstName: string;
    lastName: string;
    age: number;
    gender: string;
    nationalityCode: string;
    
    constructor(props :ICitizenProps) {
        this.socialSecurityCardId = props.socialSecurityCardId,
        this.firstName = props.firstName,
        this.lastName = props.lastName,
        this.age = props.age,
        this.gender = props.gender,
        this.nationalityCode = props.nationalityCode
    }
}