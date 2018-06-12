import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { UiComponentsModule } from '../ui/ui.module';
import { FeaturedComponentsComponent } from './featured-components.component';
import { FormatCodeComponent } from './format-code.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxContainerComponent } from './sections/checkbox-container.component';
import { DateTimeSlotComponent } from './sections/date-time-slot.component';
import { RequestGeneratorComponent } from './sections/request-generator.component';
import { StateManagementServiceComponent } from './sections/state-management-service';

const routes: Routes = [
  { path: '', component: FeaturedComponentsComponent,
    children: [
      { path: '', component: RequestGeneratorComponent },
      { path: 'checkbox-container-component', component: CheckboxContainerComponent },
      { path: 'date-time-slot-component', component: DateTimeSlotComponent },
      { path: 'state-management-service', component: StateManagementServiceComponent },
    ]
  },
];

@NgModule({
  declarations: [
    FeaturedComponentsComponent,
    FormatCodeComponent,
    CheckboxContainerComponent,
    DateTimeSlotComponent,
    RequestGeneratorComponent,
    StateManagementServiceComponent,
  ],
  imports: [
    CommonModule,
    UiComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ]
})
export class FeaturedComponentsModule {

}
