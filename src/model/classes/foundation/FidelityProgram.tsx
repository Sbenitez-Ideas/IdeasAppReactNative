/**
 * Describes the fidelity program of a passenger.
 *
 * @export
 * @class FidelityProgram
 */
 export class FidelityProgram {
    CiaCode: string;
    ProgramName: string;
    NumberFidelity: string;

    constructor(cia: string = '', programName: string = '', numberFidelity: string = '') {
        this.CiaCode = cia;
        this.ProgramName = programName;
        this.NumberFidelity = numberFidelity;
    }

}

