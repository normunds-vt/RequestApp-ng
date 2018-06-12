import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { CalendarModule } from 'primeng/primeng';

import { HDConfig } from '../../hd.config';
import { IdService } from '../id-service';
import { ContentService } from '../../services/content.service';
import { ContainerWrapperComponent } from '../container/container-wrapper.component';

export function getContainerModuleConfig({
  hdConfig,
  contentServiceObj,
  declarations = [],
  imports = [],
}: any): any {
  const  contentServiceStub = contentServiceObj
    ? contentServiceObj
    : { updateItem: function(path, value) { } };

  return {
    imports: [
      FormsModule,
      BrowserAnimationsModule,
      CalendarModule,
    ].concat(imports),
    declarations: [ContainerWrapperComponent].concat(declarations),
    providers: [
      { provide: ContentService, useValue: contentServiceStub },
      { provide: HDConfig, useValue: hdConfig ? hdConfig : new HDConfig() },
      IdService,
    ]
  };
}

export const getElementFactory = (fixture) =>
  (cssIdentifyer: string, allElements = false): DebugElement | DebugElement[] =>
     (allElements
     ? fixture.debugElement.queryAll(By.css(cssIdentifyer))
     : fixture.debugElement.query(By.css(cssIdentifyer)));
