import { Subscription } from 'rxjs/Subscription';
import { Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { ContentService, IContainerData, objectToString } from './services/content.service';

@Component({
  selector: 'debug-container',
  templateUrl: './debug-container.component.html',
  styleUrls: ['./debug-container.component.scss'],
})
export class DebugContainerComponent implements OnInit, OnDestroy {
  contentList: any[];
  requestDescription: string;
  contentListJson: string;

  subscription$: Subscription;

  debugMode = false;

  constructor(
    private contentService: ContentService
  ) { }

  ngOnInit() {
    this.subscription$ = this.contentService.missingRequired$.subscribe(items => {
      this.contentList = this.contentService.contentList;
      this.requestDescription = this.contentService.getRequestDescription();
      this.contentListJson = this.updateContentTree(this.contentList);
    });
    this.hashChanged();
  }

  updateContentTree(contentList: any) {
    return contentList
      .map((obj) => `${obj.path} | ${this.objectToString(obj) || ''} :: ${JSON.stringify(obj.value, null, '  ')}`)
      .join('\n');
  }

  @HostListener('window:hashchanged', ['$event']) hashChanged(event = null) {
    this.debugMode = document.location.hash === '#debug';
  }

  submitRequest() {
    this.contentService.submitRequest();
  }

  resetRequest() {
    this.contentService.resetRequest();
  }

  objectToString(obj) { return objectToString(obj.path, obj.title, obj.value); }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
