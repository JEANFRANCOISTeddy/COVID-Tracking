/**
 * Country class
 */

export interface ICountryProps {
    code: string;
    name: string;
    populationSize: number;
    transferTo?: string;
    doseStorage?: Array<object>;
    vaccinationPoint?: Array<object>;
}

export class Country implements ICountryProps {
    code: string;
    name: string;
    populationSize: number;
    transferTo?: string;
    doseStorage?: Array<object>;
    vaccinationPoint?: Array<object>;

    constructor(props: ICountryProps) {
        this.code = props.code;
        this.name = props.name;
        this.populationSize = props.populationSize;
    }
}