import { EndPointApp } from "./EndPointApp";

export interface IFTPEndPointRS {
    AppEndPoint: EndPointApp;
    Status: boolean;
    Msg?: string;
}
