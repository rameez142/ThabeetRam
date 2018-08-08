import { Injectable , Output,EventEmitter} from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class SharedMapServiceService {
  public DeviceId:any;
  @Output() SimulateEvnt: EventEmitter<number> = new EventEmitter();
  @Output() PauseSimulateEvnt: EventEmitter<number> = new EventEmitter();
  SimulateObsrv = this.SimulateEvnt.asObservable();
  PauseSimulateObsrv = this.PauseSimulateEvnt.asObservable();

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

}
