import { CardCodesTypes } from "../../../enums/CardCodesTypes";

export class PaymentCardType {
    Country: string;
    State: string;
    City: string;
    BillingPhone: string;
    BillingPhoneType: string;
    BillingIdentification: string;
    BillingIdentificationType: string;
    BillingAddress: string;
    CardCode: CardCodesTypes;
    CardHolderName: string;
    CardNumber: string;
    CipherDate: string;
    ExpireDate: Date;
    SeriesCode: string;
    Installments: number;
    Email: string;
    AuthorizationCode: string;

    private cardCodeString: string;
    private payCardType: PaymentCardType = new PaymentCardType();
    private cardCodesType: CardCodesTypes;

    ResolveCardCodeType(itemcardCode: string)
    // tslint:disable-next-line:one-line
    {
        this.cardCodesType = CardCodesTypes.Visa;


        // tslint:disable-next-line:curly
        if (itemcardCode === 'AX')
            this.cardCodesType = CardCodesTypes.Visa;
        // tslint:disable-next-line:curly
        else if (itemcardCode === 'DC')
            this.cardCodesType = CardCodesTypes.DinnersClub;
        // tslint:disable-next-line:curly
        else if (itemcardCode === 'CA')
            this.cardCodesType = CardCodesTypes.MasterCard;
        // tslint:disable-next-line:curly
        else if (itemcardCode === 'DS')
            this.cardCodesType = CardCodesTypes.Discover;
        // tslint:disable-next-line:curly
        else if (itemcardCode === 'E')
            this.cardCodesType = CardCodesTypes.Electron;
        // tslint:disable-next-line:curly
        else if (itemcardCode === 'TO')
            this.cardCodesType = CardCodesTypes.Maestro;
        // tslint:disable-next-line:curly
        else if (itemcardCode === 'JC')
            this.cardCodesType = CardCodesTypes.JCB;
        // tslint:disable-next-line:curly
        else if (itemcardCode === 'TP')
            this.cardCodesType = CardCodesTypes.UATP;

        return this.cardCodesType;
    }

   ResolveCardCodesType(cardCodeType: CardCodesTypes)
    // tslint:disable-next-line:one-line
    {
        this.cardCodeString = '';

       /* switch (cardCodeType) {
            case CardCodesTypes.Visa:
                this.cardCodeString = 'VI';
                break;
            case CardCodesTypes.MasterCard:
                this.cardCodeString = 'CA';
                break;
            case CardCodesTypes.AmericanExpress:
                this.cardCodeString = 'AX';
                break;
            case CardCodesTypes.DinnersClub:
                this.cardCodeString = 'DC';
                break;
            case CardCodesTypes.Discover:
                this.cardCodeString = 'DS';
                break;
            case CardCodesTypes.Electron:
                this.cardCodeString = 'E';
                break;
            case CardCodesTypes.Maestro:
                this.cardCodeString = 'TO';
                break;
            case CardCodesTypes.JCB:
                this.cardCodeString = 'JC';
                break;
            case CardCodesTypes.UATP:
                this.cardCodeString = 'TP';
                break;
            case CardCodesTypes.Elo:
                this.cardCodeString = 'EL';
                break;
            case CardCodesTypes.HiperCard:
            case CardCodesTypes.EuroCard:
            case CardCodesTypes.EnRouteCard:
            case CardCodesTypes.Laser:
            case CardCodesTypes.Solo:
            case CardCodesTypes.PayPal:
            case CardCodesTypes.Aura:
            case CardCodesTypes.Liberate:
                this.cardCodeString = '';
                break;
        }*/
        return this.cardCodeString;
    }

    Clone()
    // tslint:disable-next-line:one-line
    {
        this.payCardType.CardCode = this.CardCode;
        this.payCardType.CardHolderName = this.CardHolderName;
        this.payCardType.CardNumber = this.CardNumber;
        this.payCardType.CipherDate = this.CipherDate;
        this.payCardType.ExpireDate = this.ExpireDate;
        this.payCardType.SeriesCode = this.SeriesCode;
        this.payCardType.BillingAddress = this.BillingAddress;
        this.payCardType.BillingIdentification = this.BillingIdentification;
        this.payCardType.BillingPhone = this.BillingPhone;
        this.payCardType.Installments = this.Installments;
        this.payCardType.Email = this.Email;
        this.payCardType.State = this.State;
        this.payCardType.Country = this.Country;
        this.payCardType.City = this.City;
        this.payCardType.AuthorizationCode = this.AuthorizationCode;
        return this.payCardType;
    }
}
