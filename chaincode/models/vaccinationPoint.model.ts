/**
 * Vaccination point class
 */

export interface IVaccinationPointProps {
    id?: string;
    name: string;
    address: string;
    postalCode: string;
    city: string
    doseStorage?: Array<object>;
    personnelSize?: number;
}

export class VaccinationPoint implements IVaccinationPointProps {
    id?: string;
    name: string;
    address: string;
    postalCode: string;
    city: string
    doseStorage?: Array<object>;
    personnelSize?: number;

    constructor(props: IVaccinationPointProps) {
        this.name = props.name;
        this.address = props.address;
        this.postalCode = props.postalCode;
        this.city = props.city;
    }
}