const {ChaincodeStub } = require('fabric-shim');
const { CitizenContract, CountryContract, VaccinationPointContract, DoctorContract } = require('../chaincode/contracts');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const winston = require('winston');

let Country = require('../chaincode/contracts/country.contract');
let Citizen = require('../chaincode/contracts/citizen.contract');
let Laboratory = require('../chaincode/contracts/laboratory.contract');
let Doctor = require('../chaincode/contracts/doctor.contract');
let VaccinationPoint = require('../chaincode/contracts/vaccinationPoint.contract');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext{

    constructor() {

    }

}

describe('CountryContract', () => {

    let contract;
    let ctx;


});