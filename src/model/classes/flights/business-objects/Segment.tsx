import { SegmentBase } from "../pricing/SegmentBase";
import { FareOption } from "./FareOption";
import { Flight } from "./Flight";


export class Segment extends SegmentBase {
  public Flights: Flight [] = [];
  public SellKey = '';
  public FaresOptions: FareOption[] = [];
  public SegmentRef = '';
  public SourceCode: string = '';
  public Duration = 0;
  public SourceID = 0;
  public DepartureDateTime: Date | null;
  public ArrivalDateTime: Date | null;
  public DepartureStation: string;
  public ArrivalStation: string;
  public TotalDuration = 0;
  public companyName = '';

  constructor(segment?: Segment) {
      super();
      this.SegmentId = segment && segment.SegmentId || 0;
      this.Flights = segment && segment.Flights || [];
      this.SellKey = segment && segment.SellKey || '';
      this.ValidatingCarrier = segment && segment.ValidatingCarrier || '';
      this.FaresOptions = segment && segment.FaresOptions || [];
      this.SegmentRef = segment && segment.SegmentRef || '';
      this.SourceCode = segment && segment.SourceCode || '';
      this.Duration = segment && segment.Duration || 0;
      this.ItineraryRPH = segment && segment.ItineraryRPH || '';
      this.SourceID = segment && segment.SourceID || 0;
      this.DepartureDateTime = segment && segment.DepartureDateTime || null;
      this.ArrivalDateTime = segment && segment.ArrivalDateTime || null;
      this.DepartureStation = segment && segment.DepartureStation || '';
      this.ArrivalStation = segment && segment.ArrivalStation || '';
      this.TotalDuration = segment && segment.TotalDuration || 0;
}
}
