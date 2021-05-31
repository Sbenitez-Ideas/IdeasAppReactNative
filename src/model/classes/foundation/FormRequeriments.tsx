/**
 * Specifies the required fields in traveler form for booking.
 *
 * @export
 * @class FormRequirements
 */
 export class FormRequirements {
    // General info.
    AllRoomsInfo: boolean;
    AllPassengersInfo: boolean;
    SpecialRequirements: boolean;
    SplittedCreditCardHolder: boolean;
    CreditCardSecurityCode: boolean;
    ShowGuaranteeForm: boolean;
    // Holder Info.
    HoldersTitle: boolean;
    HoldersId: boolean;
    HoldersIdType: boolean;
    HoldersEmail: boolean;
    HoldersBirthdate: boolean;
    HoldersGender: boolean;
    HoldersAge: boolean;
    HoldersPhoneNumber: boolean;
    HoldersAddress: boolean;
    HoldersPhoneAreaCode: boolean;
    HoldersCountryCode: boolean;
    HoldersTaxId: boolean;
    HoldersTaxIdType: boolean;
    HoldersCity: boolean;
    HolderStateCode: boolean;
    HoldersStateName: boolean;
    HoldersPostalCode: boolean;
    HoldersPhoneExtension: boolean;
    HoldersMobileNumber: boolean;
    HoldersCityCode: boolean;
    HoldersCountryName: boolean;
    HoldersPassport: boolean;
    HoldersInternalIdentity: boolean;
    HoldersIdentityDoc: boolean;
    HoldersDriverLicense: boolean;
    // Adult Info.
    AdultsTitle: boolean;
    AdultsId: boolean;
    AdultsIdType: boolean;
    AdultsEmail: boolean;
    AdultsBirthdate: boolean;
    AdultsGender: boolean;
    AdultsAge: boolean;
    AdultsPhoneNumber: boolean;
    AdultsAddress: boolean;
    AdultsPhoneAreaCode: boolean;
    AdultsCountryCode: boolean;
    AdultsTaxId: boolean;
    AdultsTaxIdType: boolean;
    AdultsCity: boolean;
    AdultsPostalCode: boolean;
    AdultsPhoneExtension: boolean;
    AdultsPassport: boolean;
    AdultsInternalIdentity: boolean;
    AdultsIdentityDoc: boolean;
    AdultsDriverLicense: boolean;
    // Children Info.
    ChildrenTitle: boolean;
    ChildrenId: boolean;
    ChildrenIdType: boolean;
    ChildrenEmail: boolean;
    ChildrenBirthdate: boolean;
    ChildrenGender: boolean;
    ChildrenAge: boolean;
    ChildrenPhoneNumber: boolean;
    ChildrenAddress: boolean;
    ChildrenPhoneAreaCode: boolean;
    ChildrenCountryCode: boolean;
    ChildrenTaxId: boolean;
    ChildrenTaxIdType: boolean;
    ChildrenCity: boolean;
    ChildrenPostalCode: boolean;
    ChildrenPhoneExtension: boolean;
    ChildrenPassport: boolean;
    ChildrenInternalIdentity: boolean;
    ChildrenIdentityDoc: boolean;
    ChildrenDriverLicense: boolean;
    // AllPassengers Info.
    AllPassengersTitle: boolean;
    AllPassengersId: boolean;
    AllPassengersIdType: boolean;
    AllPassengersEmail: boolean;
    AllPassengersBirthdate: boolean;
    AllPassengersGender: boolean;
    AllPassengersAge: boolean;
    AllPassengersPhoneNumber: boolean;
    AllPassengersAddress: boolean;
    AllPassengersPhoneAreaCode: boolean;
    AllPassengersCountryCode: boolean;
    AllPassengersTaxId: boolean;
    AllPassengersTaxIdType: boolean;
    AllPassengersCity: boolean;
    AllPassengersPostalCode: boolean;
    AllPassengersPhoneExtension: boolean;
    AllPassengersPassport: boolean;
    AllPassengersInternalIdentity: boolean;
    AllPassengersIdentityDoc: boolean;
    AllPassengersDriverLicense: boolean;

    /**
     * Creates an instance of FormRequirements.
     * @memberof FormRequirements
     */
    constructor() {
        this.CreditCardSecurityCode = true;
        this.ShowGuaranteeForm = false;
        this.AdultsTitle = true;
        this.AdultsId = true;
        this.AdultsIdType = true;
        this.AdultsEmail = true;
    }
}


