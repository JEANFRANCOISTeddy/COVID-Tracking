/**
 * Citizen class
 */

export interface ICitizenProps {
    id?: string;
    firstName: string;
    lastName: string;
    age: number;
    gender: string;
    register?: boolean;
    vaccine?: Array<object>;
}

export class Citizen implements ICitizenProps {
    firstName: string;
    lastName: string;
    age: number;
    gender: string;
    
    constructor(props :ICitizenProps) {
        this.firstName = props.firstName,
        this.lastName = props.lastName,
        this.age = props.age,
        this.gender = props.gender
    }
}