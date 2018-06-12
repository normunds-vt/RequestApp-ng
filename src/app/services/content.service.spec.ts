import { Component, DebugElement, ViewChild, AfterContentInit } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import {
  ContentService,
  IContainerData,
  CURRENT_RECORD,
  objectToString
} from './content.service';
// import { RemoteLsService } from './remote-ls.service';
import { RemoteService } from './remote.service';

import 'rxjs/add/operator/first';

import * as pick from 'lodash/pick';
import { IRequest } from '../models/request.interface';
import { CheckboxContainerComponent } from '../featured-components/sections/checkbox-container.component';
import { ContainerTextComponent } from '../ui/container-text/container-text.component';
import { ContainerChbComponent } from '../ui/container-chb/container-chb.component';
import { ContainerComponent } from '../ui/container/container.component';
import { ContainerWrapperComponent } from '../ui/container/container-wrapper.component';
import { FormsModule } from '@angular/forms';
import { HDConfig } from '../hd.config';
import { IdService } from '../ui/id-service';
import { first } from 'rxjs/operators';

class RemoteServiceMock extends RemoteService  {
  store: { [key: string]: IRequest } = { };
  deleteRequestInvokedWith: string;

  submitRequest(request: IRequest): Promise<IRequest> {
    const requestid = request.id ? request.id : this.getRequestId();
    const savedRequest: IRequest = { ... request, id: requestid, createdOn: new Date() };
    this[requestid] = savedRequest;
    this.store[requestid] = savedRequest;
    return Promise.resolve(savedRequest);
  }

  getRequest(requestId: string) {
    return Promise.resolve(this[requestId]);
  }

  deleteRequest(requestid: string) {
    delete this.store[requestid];
    this.deleteRequestInvokedWith = requestid;
    return Promise.resolve(true);
  }

  getOpenRequests() { return Promise.resolve(
    Object.values(this.store).map(
      item => ({
        id: item.id,
        createdOn: item.createdOn,
        updatedOn: item.updatedOn,
        content: item.description,
      })
    ));
  }

  private _cnt = 0;
  private getRequestId() { return '' + this._cnt++; }
}

let remoteService: RemoteService;
let contentService: ContentService;

describe('ContentService', () => {
  beforeEach(() => {
    remoteService = new RemoteServiceMock();
    contentService = new ContentService(remoteService);
  });

  it ('should create service', () => {
    expect(contentService).toBeTruthy();
  });

  it ('should allow to add and update items', () => {
    const el = { applyNewValue(value) {} };
    const item: IContainerData = {
      title: 'First item:',
      path: 'firstItem_path',
      value: { text: 'Hello', valid: true },
      el: el
    };
    const newValue = { text: 'Goodby!', valid: true };

    contentService._addItems([item]);

    expect(contentService.contentList).toEqual(itemsToContentList([item]));
    contentService.updates$.first().subscribe((receivedUpdate) => {
      expect(receivedUpdate).toBeTruthy();
      // given that update item is sync there is no need for using done()
    });
    contentService.updateItem(item.path, newValue);
    expect(contentService.contentList).not.toEqual(itemsToContentList([item]));
    expect(
      contentService.contentList.find(listItem => listItem.path === item.path).value
    ).toEqual(newValue);
  });

  it ('should provide missing items stream and getMissingRequired', () => {
    const el = { applyNewValue(value) {} };
    const items: IContainerData[] = [
      {
        title: 'First item:',
        path: 'firstItem_path',
        value: { text: '', valid: false },
        el: el
      },
      {
        title: 'Second Item',
        path: 'secondItem_path',
        value: {
          isrequired: true,
          valid: false
        },
        el: el
      }];
    contentService._addItems(items);

    // after first update it is expected to see one missing item
    // the second item that is required but not valid
    contentService.missingRequired$
      .first().subscribe(isMissing => {
        expect(isMissing).toBeTruthy();
        const missingItems = contentService.getMissingRequired();
        expect(missingItems.length).toBe(1);
        expect(missingItems.find(item => item.path === items[1].path)).toBeDefined();
      });
    contentService.updateItem(items[0].path, { text: 'Hello, World', valid: true });

    // after setting the second item to true there should be no missing items
    contentService.missingRequired$
      .first().subscribe((isMissing) => {
      expect(isMissing).toBeFalsy();
    });

    contentService.updateItem(items[1].path, {
      isrequired: true,
      valid: true
    });
  });

  describe('should locally save and retrive requests to persist state between browser restarts', () => {
    const store = {};
    const updatedText = 'Hello, World';

    it ('should save', () => {
      const saveSpy = spyOn(window.localStorage, 'setItem')
        .and.callFake((key, value) => store[key] = value);

      const el = { applyNewValue(value) {} };
      const items: IContainerData[] = getSampleContent(el);
      contentService._addItems(items);

      // update an item so it is not the same as initial load
      contentService.updateItem(
        items[0].path,
        { text: updatedText, valid: true }
      );
      expect(saveSpy).toHaveBeenCalled();
      const contentList: IContainerData[] = JSON.parse(store[CURRENT_RECORD]).contentList;
      expect(contentList.length).toBe(2);
      expect(contentList.find(item => item.value.text === updatedText)).toBeDefined();
    });

    it ('should retrieve', (done) => {
      const retrieveSpy = spyOn(window.localStorage, 'getItem')
        .and.callFake(key => store[key]);
      const el = {
        requests: [],
        applyNewValue(value) { this.requests.push(value); }
      };
      const items: IContainerData[] = getSampleContent(el);

      contentService._addItems(items);
      // updated text should not exist in initial setup
      expect(contentService.contentList.find(item => item.value.text === updatedText)).toBeUndefined();

      contentService.restoreRequest()
        .then(() => {
          expect(retrieveSpy).toHaveBeenCalled();
          expect(contentService.contentList.find(item => item.value.text === updatedText)).toBeDefined();
          // update element with updatedText has been called
          expect(el.requests.find(request => request.text === updatedText)).toBeDefined();
          done();
        });
    });

    it ('if locally saved state is not available the state after restore is the same as initial state', () => {
      const retrieveSpy = spyOn(window.localStorage, 'getItem')
        .and.callFake(key => undefined);
      const intitalContentList = contentService._addItems(getSampleContent()).contentList;
      contentService.restoreRequest();
      expect(contentService.contentList).toEqual(intitalContentList);
    });
  });

  it ('should allow to reset requests', () => {
    const sampleContent = getSampleContent();
    const text = 'new text here';
    contentService._addItems(sampleContent)
      .updateItem(sampleContent[0].path, { text });

    expect(contentService.contentList.find(item => item.value.text === text)).toBeDefined();

    contentService.resetRequest()
      .then(() => expect(
          contentService.contentList.find(item => item.value.text === text)
        ).toBeUndefined()
      );
  });
});

describe('ConentService getRequestDescription', () => {
  const title = 'Item';
  const path = '';
  const text = 'My item content';
  const fromtime = '9:00 AM';
  const totime = '10:30 AM';
  const time = '3:00 PM';
  const date = '02/06/2017 from 10:00 AM to 12:30 PM';
  const valid = true;
  const selected = true;

  // test first formatter function then make sure that generator function is used
  it('should format text value', () => {
    expect(objectToString(path, title, { selected: true }))
      .toEqual(title);
  });

  it('should format text value', () => {
    expect(objectToString(path, title, { text, valid })).toEqual(title + ' ' + text);
    // check ignore  extra content in value object
    expect(objectToString(path, title, { text, valid,
      something: 'Something else'
    })).toEqual(title + ' ' + text);
  });

  it ('should format absent title by omitting it ', () => {
    expect(objectToString(path, undefined, { text, valid })).toEqual(text);
  });

  it('should format date, from and to time object', () => {
    expect(objectToString(path, title, { date, fromtime, totime, valid }))
      .toBe(`${title} ${date} from ${fromtime} to ${totime}`);
  });

  it('should format date value object', () => {
    expect(objectToString(path, title, { date, valid }))
      .toBe(`${title} ${date}`);
  });

  it('should format time value object', () => {
    expect(objectToString(path, title, { time, valid }))
      .toBe(`${title} ${time}`);
  });

  it('should use path depth to add indent and prefix (+)', () => {
    const basePath = '_';
    const value = { text, valid };
    expect(objectToString(
      basePath + '.depth0',
      title,
      value
    )).toEqual(title + ' ' + text);

    expect(objectToString(
      basePath + '.depth0.depth1',
      title,
      value
    )).toEqual('+ ' + title + ' ' + text);

    expect(objectToString(
      basePath + '.depth0.depth1.depth2',
      title,
      value
    )).toEqual('  + ' + title + ' ' + text);

    expect(objectToString(
      basePath + '.depth0.depth1.depth2.depth3',
      title,
      value
    )).toEqual('    + ' + title + ' ' + text);
  });

  it('item description should be undefined when valid or selected is not true', () => {
    expect(objectToString(path, title, {
      text, valid: false
    })).toEqual(undefined);
  });

  it('should format updated list using tested individual formatter function above', () => {
    remoteService = new RemoteServiceMock();
    contentService = new ContentService(remoteService);

    const el = { applyNewValue(value) {} };
    let cnt = 0;
    const getTitle = () => 'Item ' + (++cnt);
    const getPath = () => 'path' + cnt;

    const items: IContainerData[] = [
      { title: getTitle(), path: getPath(), value: { date, fromtime, totime, valid }, el },
      { title: getTitle(), path: getPath(), value: { date, valid }},
      { title: getTitle(), path: getPath(), value: { time, valid }},
      { title: getTitle(), path: getPath(), value: { text, valid }},
      { title: getTitle(), path: getPath(), value: { text: 'ignore this', valid: false }},
    ];
    const expectedDescription = items
      .map(item => objectToString(item.path, item.title, item.value))
      .filter(item => item !== undefined)
      .join('\n');

    contentService._addItems(items);
    // descriptions should be available after update
    contentService.updateItem(items[0].path, items[0].value);
    expect(contentService.getRequestDescription())
      .toBe(expectedDescription);
  });

  it('should apply formatter for container lists', () => {
    const containerData = getHierarchicalContent();
    remoteService = new RemoteServiceMock();
    contentService = new ContentService(remoteService)
      ._addItems(containerData)
      .updateItem('root', { selected: true });

    const description = contentService.getRequestDescription();
    expect(description).toBe('First Item\n+ First Item Subitem\nSecond Item');

    contentService.updateItem('root.firstItem.subitem', { selected: false, valid: false});
    const updatedDescription = contentService.getRequestDescription();
    expect(updatedDescription).toBe('First Item\nSecond Item');


    function getHierarchicalContent(el = { applyNewValue(value) {} }) {
      return [
        { title: '', path: 'root', value: { selected }, el},
        { title: 'First Item', path: 'root.firstItem', value: { selected, valid }, el },
        { title: 'First Item Subitem', path: 'root.firstItem.subitem', value: { selected, valid }, el },
        { title: 'Second Item', path: 'root.secondItem', value: { selected, valid }, el }
      ];
    }
  });

});

describe('ContentService remotes service submit, restore, delete requests', () => {
  let requestid;
  const remoteServiceStub = new RemoteServiceMock();
  const updatedText = 'Updated item';

  it ('should allow to submit requests', () => {
    const sampleContent = getSampleContent();
    contentService = new ContentService(remoteServiceStub);
    contentService
      ._addItems(sampleContent)
      .updateItem(sampleContent[0].path, { text: updatedText, valid: true})
      .submitRequest()
      .then(request => {
        requestid = request.id;
        expect(request).toBeDefined();
        expect(request.id).toBeTruthy();
        expect(request.createdOn).toBeTruthy();
      });
  });

  // this test is using submitted request in test above
  it ('should allow to restore requests', () => {
    const sampleContent = getSampleContent();
    contentService = new ContentService(remoteServiceStub);
    contentService
      ._addItems(sampleContent);
    expect(
      contentService.contentList.find(item => item.value.text === updatedText)
    ).toBeUndefined();

    contentService.restoreRequest(requestid)
      .then(() => {
        expect(
          contentService.contentList.find(item => item.value.text === updatedText)
        ).toBeDefined();
      });
  });

  it ('should allow to invoke remote delete service', () => {
    (new ContentService(remoteServiceStub))
      .deleteRequest(requestid)
      .then(result => {
        expect(remoteServiceStub.deleteRequestInvokedWith).toBe(requestid);
      });
  });

  it ('should allow to delete current record', async () => {
    // in order to get in service to have current record we need to save and
    // restore record

    const sampleContent = getSampleContent();
    let currentRequestId;
    contentService = new ContentService(new RemoteServiceMock());

    await contentService
      ._addItems(sampleContent)
      .updateItem(sampleContent[0].path, { text: updatedText, valid: true})
      .submitRequest()
      .then(request => currentRequestId = request.id);

    await contentService.restoreRequest(currentRequestId);

    // there should be one open request
    contentService.getOpenRequestStream()
      .pipe(first())
      .subscribe(requests => expect(requests.length).toBe(1));

    contentService.deleteRequest()
      .then(() => {
        expect(remoteServiceStub.deleteRequestInvokedWith).toBe(currentRequestId);
        contentService.getOpenRequestStream()
          .pipe(first())
          .subscribe(requests => expect(requests.length).toBe(0));
      });
  });



  it ('should invoke resetRequest if current request is deleted', () => {
    contentService = new ContentService(new RemoteServiceMock());
    const resetSpy = spyOn(contentService, 'resetRequest');
    contentService
      ._addItems(getSampleContent())
      .submitRequest()
        // restore submitted request as after submission request is reset
        .then(request =>
          contentService.restoreRequest(request.id)
            .then(() => request.id)
        )
        .then((request_id) => contentService.deleteRequest(request_id))
        .then(() => expect(resetSpy).toHaveBeenCalled());
  });
});


@Component({
  template: `
  <container-chb radioSelectChild name="root"><!-- wrap in root optionally with radio -->
    <container-chb title="T1">
      <container-chb title="T1.1" >
        <container-text title="T1.2" name="ContainerName"></container-text>
      </container-chb>
      <container-chb radioSelectChild>
        <container-chb title="T2.1"></container-chb>
        <container-chb title="T2.2"></container-chb>
      </container-chb>
    </container-chb>
  </container-chb>
  `
}) class TestComponent {
  @ViewChild(ContainerComponent) rootContainer: ContainerComponent;

  constructor(private cs: ContentService) { }
}

describe('ContentService init', () => {
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let service: ContentService;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [
        ContainerChbComponent,
        ContainerTextComponent,
        ContainerWrapperComponent,
        TestComponent,
      ],
      imports: [
        FormsModule,
      ],
      providers: [
        ContentService,
        { provide: RemoteService, useClass: RemoteServiceMock },
        { provide: HDConfig, useValue: { }},
        IdService,
      ]
    })
    .createComponent(TestComponent);
    component = fixture.componentInstance;
    service = TestBed.get(ContentService);
  });

  it('should get titles of components', () => {
    fixture.detectChanges();
    service.init(component.rootContainer);
    expect(service.contentList.length).toBe(6);
    expect(
      service.contentList.map(item => item.title)
    ).toEqual(['T1', 'T1.1', 'T1.2', , 'T2.1', 'T2.2']);
  });

  it('should get components to applyNewValues to', async () => {
    fixture.detectChanges();
    await service.init(component.rootContainer);

    const components: ContainerComponent[] =
      fixture.debugElement.queryAll(By.directive(ContainerComponent))
        .slice(1) // skip root component
        .map((de) => de.componentInstance);

    components.forEach(componentObj => spyOn(componentObj, 'applyNewValue'));

    service.resetRequest().then(() => {
      components.forEach(componentObj => {
        expect(componentObj.applyNewValue).toHaveBeenCalled();
      });
    });
  });
});

function getSampleContent(el = { applyNewValue(value) {} }) {
  return [
    {
      title: 'First item',
      path: 'firstItem_path',
      value: { text: '', valid: false },
      el: el
    },
    {
      title: 'Second Item',
      path: 'secondItem_path',
      value: {
        isrequired: true,
        valid: false
      },
      el: el
    } ];
}

function itemsToContentList(itemList) {
  return itemList.map(item => pick(item, ['title', 'path', 'value']));
}

function getRemoteService() {
  return;
}

