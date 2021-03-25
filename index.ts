import {Country, Citizen, Laboratory,  Doctor, VaccinationPoint} from './src/models'
import {CountryContract, CitizenContract, LaboratoryContract, DoctorContract, VaccinationPointContract } from './src/contracts'

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

describe('CountryContract', () => {

});