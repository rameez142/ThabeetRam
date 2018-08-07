import { Injectable , Output,EventEmitter} from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class SharedMapServiceService {
  public DeviceId:any;
  @Output() SimulateEvnt: EventEmitter<number> = new EventEmitter();
  SimulateObsrv = this.SimulateEvnt.asObservable();
  constructor() { }
 
  public SimulateDevices(DeviceId: any) {
    this.DeviceId = DeviceId;
    console.log('selected nav item ' + DeviceId);
    this.SimulateEvnt.emit(DeviceId)
}
}
