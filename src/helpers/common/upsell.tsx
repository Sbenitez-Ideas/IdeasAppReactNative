import { Option } from "../../model/classes/flights/pricing/Option";

export const upsell = (options: Option[], filterby: string = 'YES'): Option[] => {
    if (options) {
        return options.filter(o => o.Include === filterby);
    } else {
        return [];
    }

}

