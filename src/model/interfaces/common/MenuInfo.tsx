import { IconProp } from "@fortawesome/fontawesome-svg-core";

export interface MenuInfo {
    icon: IconProp;
    route: string;
    label: string;
    external?: string;
    fontClass?: string;
    haveParameter?: boolean;
    parameters?: any;
}