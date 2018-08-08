import { Injectable , Output,EventEmitter} from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class SharedMapServiceService {
  public DeviceId:any;
  public RngSimVal:any;
  @Output() SimulateEvnt: EventEmitter<number> = new EventEmitter();
  @Output() PauseSimulateEvnt: EventEmitter<number> = new EventEmitter();
  @Output() ResumeSimulateEvnt: EventEmitter<number> = new EventEmitter();
  @Output() SimulateRouteEvnt: EventEmitter<number> = new EventEmitter();
  @Output() RangeSimEvnt: EventEmitter<number> = new EventEmitter();

  SimulateObsrv = this.SimulateEvnt.asObservable();
  PauseSimulateObsrv = this.PauseSimulateEvnt.asObservable();
  SimulateRouteObsrv = this.SimulateRouteEvnt.asObservable();
  ResumeimulateObsrv = this.ResumeSimulateEvnt.asObservable();
  RangeSimObsrv = this.RangeSimEvnt.asObservable();

  constructor() { }
 
  public SimulateDevices(DeviceId: any) {
    this.DeviceId = DeviceId;
    console.log('Simulate Device Shared' + DeviceId);
    this.SimulateEvnt.emit(DeviceId)
}

public PausseSimulation(DeviceId: any) {
  this.DeviceId = DeviceId;
  console.log('Pause Device Shared ' + DeviceId);
  this.PauseSimulateEvnt.emit(DeviceId)
}

public ResumeSimulation(DeviceId: any) {
  this.DeviceId = DeviceId;
  console.log('Pause Device Shared ' + DeviceId);
  this.ResumeSimulateEvnt.emit(DeviceId)
}

public Simulate_By_Route_Device(DeviceId: any) {
  this.DeviceId = DeviceId;
  console.log('Pause Device Shared ' + DeviceId);
  this.SimulateRouteEvnt.emit(DeviceId)
}

public RngSlider_Simulate(RngSimVal: any) {
  this.RngSimVal = RngSimVal;
  console.log('Pause Device Shared ' + RngSimVal);
  this.RangeSimEvnt.emit(RngSimVal)
}


}
