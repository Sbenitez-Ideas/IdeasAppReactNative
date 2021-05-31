import {GExpenses} from './GExpenses';
import {GImage} from './GImage';


export interface GItem {
  expense: GExpenses;
  images?: GImage[];
}
