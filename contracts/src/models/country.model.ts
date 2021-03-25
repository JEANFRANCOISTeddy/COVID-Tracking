/**
 * Country class
 */

export interface ICountryProps {
    id?: number;
    code: string;
    name: string;
    populationSize: number;
    doseStorage?: Array<object>;
    vaccinationPoint?: Array<object>;
}

export class Country implements ICountryProps {
    id?: number;
    code: string;
    name: string;
    populationSize: number;
    doseStorage?: Array<object>;
    vaccinationPoint?: Array<object>;

    constructor(props: ICountryProps) {
        this.code = props.code;
        this.name = props.name;
        this.populationSize = props.populationSize;
    }
}