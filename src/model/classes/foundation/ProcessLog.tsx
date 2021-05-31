import { ProcessLogType } from "../../enums/ProcessLogType";


/**
 * Saves information about the time of the request.
 *
 * @export
 * @class ProcessLog
 */
export class ProcessLog {
    public Source: string;
    public ProcessLogType: ProcessLogType;
    public ExecTime: any;
    public ConectionCode: number;
}


