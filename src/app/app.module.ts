import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HDComponent } from './hd.component';
import { HDConfig } from './hd.config';

import { ContentService } from './services/content.service';

import { UiComponentsModule } from './ui/ui.module';
import { OpenRequestsComponent } from './open-requests.component';
import { OpenRequestItemComponent } from './open-request-item.component';

import { DebugContainerComponent } from './debug-container.component';
import { RemoteService } from './services/remote.service';
import { RemoteLsService } from './services/remote-ls.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
// import MyErrorHandler from './common-components/my-error-handler';

@NgModule({
  declarations: [
    AppComponent,
    HDComponent,
    OpenRequestsComponent,
    DebugContainerComponent,
    OpenRequestItemComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    UiComponentsModule,
    environment.production
    ? ServiceWorkerModule.register('ngsw-worker.js', {}) 
    : [],
  ],
  providers: [
    ContentService,
    HDConfig,
    { provide: RemoteService, useClass: RemoteLsService },
    // { provide: ErrorHandler, useClass: MyErrorHandler },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
