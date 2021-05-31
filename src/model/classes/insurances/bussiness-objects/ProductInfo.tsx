import { TransactionGWType } from '../../../enums/TransactionGWType';
import { Airline } from './Airline';
import { RouteInfo } from './RouteInfo';
import { Tax } from './Tax';


export class ProductInfo
    {        
        airlineInfo: Airline;
        buyDate: Date | string;
        codReference: number;
        codReferenceSource: number;
        currency: string;
        description: string;
        reference: string;
        referenceSource: string;
        routes: RouteInfo[];
        sellerCode: number;
        sellerName: string;
        taxes: Tax[];
        total: number;
        TransactionGWType: TransactionGWType;
    }
    
  

   