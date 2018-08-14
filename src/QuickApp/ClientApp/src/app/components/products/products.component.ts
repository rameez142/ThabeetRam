// ====================================================

// Email: support@ebenmonney.com
// ====================================================

import { Component, OnInit, AfterViewInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { AccountService } from '../../services/account.service';
import { Utilities } from '../../services/utilities';
import { Role } from '../../models/role.model';
import { Permission } from '../../models/permission.model';
import { SharedMapServiceService } from  '../../components/map/services/shared-map-service.service';

@Component({
    selector: 'products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.css']
})

    export class ProductsComponent implements OnInit {
    columns: any[] = [];
    rows: any[] = [];
    loadingIndicator: boolean;

    constructor(private alertService: AlertService,private someSharedService : SharedMapServiceService) {

    }

    ngOnInit() {

       // let gT = (key: string) => this.translationService.getTranslation(key);

        this.columns = [
            { prop: 'name', name: 'Name', width: 200 , resizeable: false, canAutoResize: false, sortable: false, draggable: false},
            { prop: 'idnumber', name: 'idnumber', width: 200 , resizeable: false, canAutoResize: false, sortable: false, draggable: false},
            { prop: 'telnumber', name: 'telnumber', width: 200 , resizeable: false, canAutoResize: false, sortable: false, draggable: false},
            { prop: 'empnumber', name: 'empnumber', width: 200, resizeable: false, canAutoResize: false, sortable: false, draggable: false }
        ];

        
    }

    onSubmit() { 
        
        
        this.loadData(); }


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
