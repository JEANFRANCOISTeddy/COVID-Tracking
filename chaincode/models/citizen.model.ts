/**
 * Citizen class
 */

export interface ICitizenProps {
    socialSecurityCardId: string; // check if your a citizen in using numbers on your social security card
    firstName: string;
    lastName: string;
    age: number;
    gender: string;
    nationality: string;
    covidResult?: boolean;
    register?: boolean;
    vaccine?: Array<object>;
    vaccinationAvailability?: string; 
}

export class Citizen implements ICitizenProps {
    socialSecurityCardId: string;
    firstName: string;
    lastName: string;
    age: number;
    gender: string;
    nationality: string;
    
    constructor(props :ICitizenProps) {
        this.socialSecurityCardId = props.socialSecurityCardId,
        this.firstName = props.firstName,
        this.lastName = props.lastName,
        this.age = props.age,
        this.gender = props.gender,
        this.nationality = props.nationality
    }
}