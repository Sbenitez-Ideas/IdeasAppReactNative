import { zapOffType } from "../../../enums/zapOffType";

export class CAgreementFlight {
    public Carrier: string;
    public Agreement: string;
    public PTCAdults: string[];
    public PTCChildren: string[];
    public PTCInfants: string[];
    public isPublic: boolean;
    public ApplyZapOff: boolean;
    public ZapOffType: zapOffType;
    public ZapOffDiscount: number;
    public ZapOffTicketDesignator: string;
    public ZapOffTourCode: string;
    public ForcePTCChilds: boolean;

    constructor() {
        this.Carrier = '*';
        this.Agreement = '';
        this.isPublic = true;
        this.PTCAdults = ['ADT'];
        this.PTCChildren = ['CHD'];
        this.PTCInfants = ['INF'];
        this.ApplyZapOff = false;
        this.ZapOffType = zapOffType.Percentage;
        this.ZapOffDiscount = 0;
        this.ZapOffTicketDesignator = '';
        this.ZapOffTourCode = '';
        this.ForcePTCChilds = false;
    }
}
