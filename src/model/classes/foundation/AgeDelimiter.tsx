/**
 * Specifies the age for children and adults.
 *
 * @export
 * @class AgeDelimiter
 */
export class AgeDelimiter {
    ChildStartAge: number;
    AdultStartAge: number;

    /**
     * Creates an instance of AgeDelimiter.
     * @memberof AgeDelimiter
     */
    constructor() {
        this.ChildStartAge = 0;
        this.AdultStartAge = 18;
    }
}


