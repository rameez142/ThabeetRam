// ====================================================

// Email: support@ebenmonney.com
// ====================================================

import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input,ChangeDetectorRef  } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { AccountService } from '../../services/account.service';
import { Utilities } from '../../services/utilities';
import { Role } from '../../models/role.model';
import { Permission } from '../../models/permission.model';
import { SharedMapServiceService } from  '../../components/map/services/shared-map-service.service';
import { FileUploader, FileSelectDirective } from 'ng2-file-upload/ng2-file-upload';
//import { ElasticsearchService } from '../../components/products/elasticsearch.service';
const URL = 'http://localhost:64430/api/map';
@Component({
    selector: 'products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.css']
})

    export class ProductsComponent implements OnInit {
    columns: any[] = [];
    rows: any[] = [];
    loadingIndicator: boolean;
    isConnected = false;
  status: string;
  public uploader: FileUploader = new FileUploader({ url: URL, itemAlias: 'photo' });

    constructor(private alertService: AlertService,private someSharedService : SharedMapServiceService, private cd: ChangeDetectorRef) {

    }

    ngOnInit() {

       // let gT = (key: string) => this.translationService.getTranslation(key);
      this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
      this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
        console.log('ImageUpload:uploaded:', item, status, response);
        alert('File uploaded successfully');
      };

      this.isConnected = false;
  
        this.columns = [
            { prop: 'name', name: 'Name', width: 200 , resizeable: false, canAutoResize: false, sortable: false, draggable: false},
            { prop: 'idnumber', name: 'idnumber', width: 200 , resizeable: false, canAutoResize: false, sortable: false, draggable: false},
            { prop: 'telnumber', name: 'telnumber', width: 200 , resizeable: false, canAutoResize: false, sortable: false, draggable: false},
            { prop: 'empnumber', name: 'empnumber', width: 200, resizeable: false, canAutoResize: false, sortable: false, draggable: false }
        ];

        
        }
    public selectedfile:any;

    onSubmit() { 
        
        
        this.loadData(); 
    }

    Fileuploadclick(e)
{
    console.log(e.target.files[0])
    this.selectedfile = e.target.files[0];
}

CallUpload()
{
  
 const frm =  new FormData();
  frm.append("File",this.selectedfile,this.selectedfile.name)

  this.someSharedService.UploadFiles(frm).subscribe(resp => 
        {
           
            //this.rows = JSON.parse(resp);
          console.log('resp' + resp);
      },
        error => {
           
            this.alertService.showStickyMessage("Upload Error", `Errors: "${Utilities.getHttpResponseMessage(error)}"`,
                MessageSeverity.error, error);
        });


}
    loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.someSharedService.getLatLng().subscribe(resp => 
            {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;
                this.rows = JSON.parse(resp);
              console.log('resp' + resp);
          },
            error => {
                this.alertService.stopLoadingMessage();
                this.loadingIndicator = false;

                this.alertService.showStickyMessage("Load Error", `Unable to retrieve roles from the server.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
                    MessageSeverity.error, error);
            });

      
    }

}
