import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavbarComponent} from './navbar/navbar.component';
import {ButtonComponent} from './button/button.component';
import {ButtonGroupComponent} from './button-group/button-group.component';
import {TabsComponent} from './tabs/tabs.component';
import {ModalComponent} from './modals/modal/modal.component';
import {DropdownButtonComponent} from './dropdown-button/dropdown-button.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {IconsModule} from '../icons/icons.module';
import {RouterModule} from '@angular/router';
import {HeaderComponent} from './header/header.component';
import {ContainerComponent} from './container/container.component';
import {StepsComponent} from './steps/steps.component';
import {FormsModule} from '@angular/forms';
import {NavSpacerComponent} from './nav-spacer/nav-spacer.component';
import {ButtonGroupButtonComponent} from './button-group-button/button-group-button.component';
import {SidebarItemComponent} from './sidebar-item/sidebar-item.component';
import {LoadingComponent} from './loading/loading.component';
import {ConfirmModalComponent} from './modals/confirm-modal/confirm-modal.component';
import {LoadingModalComponent} from './modals/loading-modal/loading-modal.component';
import {CustomModalComponent} from './modals/custom-modal/custom-modal.component';


@NgModule({
  declarations: [
    NavbarComponent,
    ButtonComponent,
    ButtonGroupComponent,
    TabsComponent,
    ModalComponent,
    DropdownButtonComponent,
    SidebarComponent,
    HeaderComponent,
    ContainerComponent,
    StepsComponent,
    NavSpacerComponent,
    ButtonGroupButtonComponent,
    SidebarItemComponent,
    LoadingComponent,
    ConfirmModalComponent,
    LoadingModalComponent,
    CustomModalComponent
  ],
  exports: [
    NavbarComponent,
    DropdownButtonComponent,
    SidebarComponent,
    HeaderComponent,
    ContainerComponent,
    ButtonComponent,
    NavSpacerComponent,
    ButtonGroupComponent,
    LoadingComponent,
    ModalComponent,
    ConfirmModalComponent,
    LoadingModalComponent,
    CustomModalComponent
  ],
  imports: [
    CommonModule,
    IconsModule,
    RouterModule,
    FormsModule
  ]
})
export class UiModule {
}
