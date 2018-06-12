import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/primeng';

import { DropdownComponent } from './dropdown/dropdown.component';
import { DatetimeslotComponent } from './datetimeslot/datetimeslot.component';

import { ContainerChbComponent } from './container-chb/container-chb.component';
import { ContainerTextComponent } from './container-text/container-text.component';
import { ContainerDtsComponent } from './container-dts/container-dts.component';
import { ContainerDtComponent } from './container-dt/container-dt.component';
import { ContainerTimeComponent } from './container-time/container-time.component';
import { ContainerListComponent } from './container-list/container-list.component';
import { ContainerWrapperComponent } from './container/container-wrapper.component';

import { IdService } from './id-service';
import { ContainerComponent } from './container/container.component';
import { TabNavigationDirective } from './tab-navigation.directive';
import { SubmitButtonComponent } from './submit-button/submit-button.component';
import { AnimateOnClickDirective } from './animate-on-click.directive';
import { ContentComponent } from './content/content.component';
import { ContainerContentComponent } from './container-content/container-content.component';
import { FormActionsComponent } from './form-actions/form-actions.component';

@NgModule({
  imports: [
    CommonModule,
    // BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
  ],
  declarations: [
    DropdownComponent,
    DatetimeslotComponent,
    ContainerComponent, // included here only becouse of AOT compilations issue
    ContainerChbComponent,
    ContainerTextComponent,
    ContainerDtsComponent,
    ContainerDtComponent,
    ContainerTimeComponent,
    ContainerListComponent,
    ContainerWrapperComponent,
    TabNavigationDirective,
    SubmitButtonComponent,
    AnimateOnClickDirective,
    SubmitButtonComponent,
    ContentComponent,
    ContainerContentComponent,
    FormActionsComponent,
  ],
  providers: [
    IdService,
  ],
  exports: [
    DropdownComponent,
    DatetimeslotComponent,
    ContainerChbComponent,
    ContainerTextComponent,
    ContainerDtsComponent,
    ContainerDtComponent,
    ContainerTimeComponent,
    ContainerListComponent,
    ContainerWrapperComponent,
    TabNavigationDirective,
    SubmitButtonComponent,
    ContainerContentComponent,
    FormActionsComponent,
  ]
})
export class UiComponentsModule { }
