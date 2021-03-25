export interface ICitizenProps {
    id?: number;
    socialSecurityCardId: string; // check if your a citizen in using numbers on your social security card
    lastName: string;
    firstName: string;
    age: number;
    gender: string;
    nationality: string;
    covidResult?: string; // positive or negative
    vaccinationArray?: Array<object>; // store two vaccine certification objects
    vaccinationAvailability?: string; // choose a date to make your injection
}

export class Citizen implements ICitizenProps {

    id?: number;
    socialSecurityCardId: string; // check if your a citizen in using numbers on your social security card
    lastName: string;
    firstName: string;
    age: number;
    gender: string;
    nationality: string;
    covidResult?: string; // positive or negative
    vaccinationArray?: Array<object>; // store two vaccine certification objects
    vaccinationAvailability?: string; // choose a date to make your injection

    /**
     *
     * Constructor for a Citizen object.
     *
     *
     *
     * @param props - citizen object
     * @returns -
     */
    constructor(props: ICitizenProps) {
        if (this.validateSocialSecurityCard(props.socialSecurityCardId)) {
            this.socialSecurityCardId = props.socialSecurityCardId;
            this.lastName = props.lastName;
            this.firstName = props.firstName;
            this.age = props.age;
            this.gender = props.gender;
            this.nationality = props.nationality;
        }
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
        if (socialSecurityCardId) {
            return true;
        }
        return false;
    }
}