import { NgModule, Component } from '@angular/core';
import { DxTreeViewModule, DxListModule, DxTemplateModule } from 'devextreme-angular';
import { Product, Service } from '../../services/sidenav.service'
import { SharedMapServiceService } from  '../../components/map/services/shared-map-service.service'


@Component({
    selector: 'sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.css'],
    providers: [Service]
})
export class SidenavComponent {
    products: Product[];
    checkedItems: Product[] = [];

    constructor(service: Service, private someSharedService: SharedMapServiceService) {
        this.products = service.getProducts();
    }

    selectionChanged(e) {
        let value = e.node;
        if (this.isProduct(value)) {
            this.processProduct({
                id: value.key,
                text: value.text,
                itemData: value.itemData,
                selected: value.selected,
                category: value.parent.text
            });
        } else {
            value.items.forEach((product, index) => {
                this.processProduct({
                    id: product.key,
                    text: product.text,
                    itemData: product.itemData,
                    selected: product.selected,
                    category: value.text
                });
            });
        }
    }

    isProduct(data) {
        return !data.items.length;
    }

    processProduct(product) {
        let itemIndex = -1;

        this.checkedItems.forEach((item, index) => {
           if (item.id === product.id) {
                itemIndex = index;
                return false;
            }
        });
        if (product.selected && itemIndex === -1) {
            this.checkedItems.push(product);
        } else if (!product.selected) {
            this.checkedItems.splice(itemIndex, 1);
        }
    }
    SimulateDevices()
{

this.someSharedService.SimulateDevices(1);
}


}

