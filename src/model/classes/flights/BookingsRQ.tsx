export class BookingsRQ {
    userCode: number;
    entityBookingCode: number;
    pageSize: number;
    pageIndex: number;
    period: string;
    private showOwned: boolean;
    private showExpiring: boolean;
    private showOffline: boolean;
    private showCancelled: boolean;
    private showFlown: boolean;
    private showFromCustomer: boolean;
    private showMine: boolean;
    orderBy: string;
    sourceType: string;
    loc: string;
    entityName: string;
    passangerName: string;
    company: string;
    rute: string;
    dateFrom: Date | null;
    dateTo: Date | null;
    creationDateFrom: Date;
    creationDateTo: Date;
    limitDateFrom: Date;
    limitDateTo: Date;
    state: number;
    flow: string;
    PaymentStatus: string;
    IDEnterpriseWP: string;
    ShowApprover: boolean;

    constructor(user: number, entity: number) {
        this.userCode = user;
        this.entityBookingCode = entity;
        this.pageSize = 10;
        this.pageIndex = 1;
        this.period = '1';
        this.showMine = false;
        this.orderBy = 'codreserva_desc';
        this.showOwned = false;
        this.sourceType = '';
        this.loc = '';
        this.entityName = '';
        this.passangerName = '';
        this.company = '';
        this.rute = '';
        this.flow = '';
        this.state = 0;
        this.PaymentStatus = '';
        this.IDEnterpriseWP = '';
        this.showExpiring = false;
        this.showOffline = false;
        this.showCancelled = false;
        this.showFlown = false;
        this.showFromCustomer = false;
    }

    public set showOwnedValue(v: boolean) {
        this.showOwned = v;
    }

    public set showExpiringValue(v: boolean) {
        this.showExpiring = v;
        this.setMine();
    }

    public set showOfflineValue(v: boolean) {
        this.showOffline = v;
        this.setMine();
    }

    public set showCancelledValue(v: boolean) {
        this.showCancelled = v;
        this.setMine();
    }

    public set showFlownValue(v: boolean) {
        this.showFlown = v;
        this.setMine();
    }

    public set showFromCustomerValue(v: boolean) {
        this.showFromCustomer = v;
        this.setMine();
    }

    public set showApproverValue(v: boolean) {
        this.ShowApprover = v;
        this.showCancelled = false;
        this.showOffline = false;
        this.setMine();
    }

    private setMine() {
        if (this.showOwned || this.showExpiring || this.showOffline || this.showCancelled ||
                this.showFlown || this.showFromCustomer || this.ShowApprover) {
            this.showMine = false;
        } else {
           this.showMine = true;
        }
    }
}
