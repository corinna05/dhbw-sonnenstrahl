import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {UiButtonGroup} from '../../ui/ui.interface';
import {ApiService} from '../../services/api/api.service';
import {adminBreadcrumb, adminPages} from '../admin.pages';
import {CustomerData} from '../../interfaces/customer.interface';
import {ConfirmModalService} from '../../services/confirm-modal/confirm-modal.service';
import {LoadingModalService} from '../../services/loading-modal/loading-modal.service';
import {ModalService} from '../../services/modal/modal.service';
import {AvailableFilter, FilterValue} from '../../ui/filter/filter.component';
import {LoginService} from '../../services/login/login.service';

@Component({
  selector: 'app-users',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  public currentLimitAndOffset = {limit: 25, offset: 0};
  public sidebarPages = adminPages;
  public breadcrumb = adminBreadcrumb;
  public filterCount = 0;
  @ViewChild('editModal', {static: true}) editModal: TemplateRef<unknown>;
  public results: CustomerData[] = [];
  public loading = false;
  public currentEditCustomer: CustomerData;
  public buttonGroup: UiButtonGroup = {
    buttons: [
      {
        title: 'Kundendaten exportieren',
        function: () => {
          const jwt = this.login.jwt$.value;
          window.location.assign(`/api/v1/admin/export/customers?token=${jwt}`);
        },
        icon: 'download-cloud'
      }
    ]
  };
  public filters: AvailableFilter[] = [{
    title: 'Nachname',
    name: 'lastName',
  }, {
    title: 'Stadt',
    name: 'city',
  }, {
    title: 'Postleitzahl',
    name: 'postcode',
  }, {
    title: 'ID',
    name: 'id',
  }];

  constructor(
    private confirmService: ConfirmModalService,
    private loadingService: LoadingModalService,
    private modalService: ModalService,
    private login: LoginService,
    private api: ApiService) {
  }

  ngOnInit(): void {
    this.loadData();
  }

  showEditModalForCustomer(customer: CustomerData): void {
    this.currentEditCustomer = {...customer};
    this.modalService.showModal(`"${customer.lastName}, ${customer.firstName}" bearbeiten`, this.editModal);
  }

  public closeEditModal(): void {
    this.modalService.close();
  }

  public applyFilter(filterValue: FilterValue[]): void {
    let f: { [k: string]: string | number } = {
      sort: '-lastName',
    };
    this.currentLimitAndOffset.offset = 0;
    filterValue.forEach(val => {
      f[val.name] = val.value;
    });
    this.filterCount = filterValue.length;
    this.loadData(f);
  }

  public loadData(filter: { [k: string]: string | number } = {
    sort: '-lastName',
  }): void {
    filter = {
      ...filter,
      ...this.currentLimitAndOffset
    };
    this.loading = true;
    this.api.get<CustomerData[]>('/customers', filter).subscribe(
      data => {
        this.loading = false;
        this.results = data.data;
      }
    );
  }

  public async showDeleteModalForCustomer(customer: CustomerData): Promise<void> {
    const confirmed = await this.confirmService.confirm({
      title: `Sicher, dass Sie den Kunden ${customer.lastName}, ${customer.firstName} entfernen möchten?`,
      description: 'Dies kann nicht rückgängig gemacht werden.'
    });
    if (confirmed) {
      this.loadingService.showLoading();
      this.api.delete<{ success: boolean } | { success: boolean, error: string }>(`/customers/${customer.id}`).subscribe(
        data => {
          this.loadData();
          this.loadingService.hideLoading();
        },
        error => {
          this.loadingService.hideLoading();
          this.confirmService.confirm({
            title: `Es ist ein Fehler beim Löschen aufgetreten.`,
            confirmButtonType: 'info',
            confirmText: 'Ok',
            description: 'Der Server gab folgenden Fehler an: ' + error.error.data.error,
            showCancelButton: false
          });
        }
      );
    }
  }

  public saveEditedCustomer(): void {
    this.modalService.close();
    this.loadingService.showLoading();
    this.api.put(`/customers/${this.currentEditCustomer.id}`, {
      firstName: this.currentEditCustomer.firstName,
      lastName: this.currentEditCustomer.lastName,
      street: this.currentEditCustomer.street,
      streetNumber: this.currentEditCustomer.streetNumber,
      postcode: this.currentEditCustomer.postcode,
      city: this.currentEditCustomer.city,
    }).subscribe(
      data => {
        this.loadingService.hideLoading();
        this.loadData();
      }, error => {
        this.loadingService.hideLoading();
        this.confirmService.confirm({
          title: `Es ist ein Fehler beim Ändern aufgetreten.`,
          confirmButtonType: 'info',
          confirmText: 'Ok',
          description: 'Der Server gab folgenden Fehler an: ' + error.error.data.error,
          showCancelButton: false
        });
      }
    );
  }

}
