import { Injectable } from '@angular/core';

import * as pick from 'lodash/pick';
import * as set from 'lodash/set';
import * as cloneDeep from 'lodash/cloneDeep';

import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

// import * as dateFormat from 'dateFormat';

import { IValue } from '../ui/container/value.interface';
import { IRequest } from '../models/request.interface';
import { IRequestItem } from '../models/request-item.interface';
import { RemoteService } from '../services/remote.service';
import { ContainerComponent } from '../ui/container/container.component';

export const CURRENT_RECORD = 'HD.CurrentRecord';

const VALUE_PREFIX = '_';

export interface IContainerData {
  title: string;
  path: string;
  value: any;
  el?: { applyNewValue(value: any): void };
}

const emptyRecord: IRequest = {
  id: null,
  createdOn: null,
  updatedOn: null,
  description: null,
  contentList: [ ]
};

@Injectable()
export class ContentService {
  updates$ = new Subject<any>();
  missingRequired$ = new Subject<boolean>();
  openRequestList$ = new BehaviorSubject<IRequestItem[]>([]);
  isUpdated = false;

  constructor(private remoteService: RemoteService) { }

  init(container: ContainerComponent) {
    const items = this._buildChildContainerPath(container);
    this.refreshOpenRequests();
    return this._addItems(items)
      .restoreRequest();
  }

  updateItem(path: string, value: any) {
    if (!path) { return; }
    if (this.getCurrentRecordId() !== null) {
      this.isUpdated = true;
    }
    Object.assign(this._contentDirectory[path].value, value);
    this.processUpdates();
    this._saveRequestLocally();
    this.updates$.next({ path, value: this._contentDirectory[path].value });
    return this;
  }

  getRequestDescription() { return this._requestDescription; }

  get contentList(): IContainerData[] {
    return Object.keys(this._contentDirectory)
      .map(item => pick(this._contentDirectory[item], ['path', 'value', 'title']));
  }

  getCurrentRecord() {
    return Object.assign(
      {},
      this._currentRecord,
      {
        description: this.getRequestDescription(),
        contentList: cloneDeep(this.contentList)
      }
    );
  }

  getMissingRequired() {
    // separating this from stream would allow to
    // optimize stream to find first any missing required rather than all.
    return this._missingRequired;
  }

  getCurrentRecordId() {
    return this._currentRecord.id;
  }

  resetRequest() {
    this._deleteLocalRequest();
    return this.restoreRequest('reset');
  }

  restoreRequest(requestid: 'reset' | 'lastSavedLocally' | string = 'lastSavedLocally') {
    const recordPromise: Promise<IRequest> =
      requestid === 'lastSavedLocally' || requestid === 'reset'
      ? Promise.resolve(
        requestid === 'reset'
        ? { ...this._resetRecord }
        : this._getLocallySavedRequest()
      )
      : this.remoteService.getRequest(requestid);

    return recordPromise
      .then(record => {
        this._currentRecord = record;
        this.isUpdated = false;
        record.contentList.forEach(({ path, value }) => {
          if (this._contentDirectory[path]) { // only way of this not being true is restorig tempered data or data from a different version
            Object.assign(this._contentDirectory[path].value, value);
            this._contentDirectory[path].el.applyNewValue(value);
          }
        });
        this.isUpdated = false;  // timing has to come before processUpdates as this value is looked up in resulting rxjs trigger.
        this.processUpdates();
        this._saveRequestLocally();
      });
  }

  submitRequest(): Promise<IRequest> {
    const record = this.getCurrentRecord();
    return this.remoteService.submitRequest(record)
      .then(request => {
        this.refreshOpenRequests();
        this.restoreRequest('reset');
        return request;
      });
  }

  deleteRequest(requestid?: string) {
    if (typeof requestid === 'undefined') {
      requestid = this.getCurrentRecordId();
    }

    return this.remoteService.deleteRequest(requestid)
      .then(result => {
        if (this._currentRecord.id === requestid) {
          this.resetRequest();
        }
        this.refreshOpenRequests();
      });
  }

  getOpenRequestStream() {
    return this.openRequestList$;
  }

  refreshOpenRequests() {
    this.remoteService
      .getOpenRequests()
      .then(result => this.openRequestList$.next(result));
  }

  _addItems(items: IContainerData[]) {
    items.forEach(item => {
      const { path, title, value, el } = item;
      this._contentDirectory[item.path] = {
        path,
        title,
        value: { ...value }, // make a copy of value to separate from container object
        el
      };
    });
    this._buildRecordConfiguration();
    return this;
  }

  private _requestDescription: string;
  private _contentDirectory: { [key: string]: IContainerData } = { };
  private _currentRecord: IRequest = Object.assign({}, emptyRecord);
  private _resetRecord: IRequest;
  private _missingRequired: any[];
  private _componentTree = {};

  private _branch_id = 0;

  private _buildChildContainerPath(container: ContainerComponent, containerid = '00'): IContainerData[] {
    let items: IContainerData[] = [];

    container.children.forEach((childContainer: ContainerComponent) => {
      if (childContainer === container) { return; }  // not itself

      setContainerPath(childContainer, container.path, this._branch_id++);
      const { title, path, value } = childContainer;
      items.push({ title, path, value, el: childContainer });

      items = items.concat(this._buildChildContainerPath(childContainer)); // recursively add children if any
    });

    return items;

    // tslint:disable-next-line:no-shadowed-variable
    function setContainerPath(container: ContainerComponent, prefix: string, id: number ) {
      container.path = getPrefix(prefix, container.name, container.title);

      function getPrefix(parent_prefix: string, name: string, title: string) {
        const containerName = (name
          ? name
          : ((title || '').replace(/ |\./g, '_')) || 'b') + ('_' + id);

        return `${ parent_prefix || '' }${ parent_prefix ? '.' : '' }${ containerName }`;
      }
    }
  }

  private _buildRecordConfiguration() {
    this.buildTree();
    this._resetRecord = this.getCurrentRecord();
  }
  // component tree is used to hierarchically traverse contentDictionary
  // it needs to be created only once when app is initiated
  private buildTree() {
    this._componentTree = { _value: { selected: true } };

    this.contentList.forEach(el => {
      set(this._componentTree, el.path, {
        _title: el.title,
        _value: el.value,
        _path: el.path
      });
    });
  }

  private processUpdates() {
    const required = [];
    const descriptionList = [];

    processBranch(this._componentTree);
    this._requestDescription = descriptionList.join('\n');
    this._missingRequired = required;
    this.missingRequired$.next(required.length > 0);

    return required;

    function processBranch(branch) {
      if (branch._value.selected) {  // check that there are no invalid required items
        Object.keys(branch)
          .filter( key => !key.startsWith(VALUE_PREFIX)
            // ( (key[0] !== '_')
            // || (key !== '' && branch[key]._value.selected)
          ) // filter valid items based on key
          .forEach( key => {
            const item = branch[key];
            const { _path: path, _title: title, _value: value } = item;
            if (item._value.valid && (item._title || item._value.text)) {
              descriptionList.push(objectToString(path, title, value));
            }
            if (item._value.isrequired && !item._value.valid) {
              required.push({ path, title, value });
            }
            processBranch(item);
          });
        }
    }
  }

  // store current state to access on browser restarts
  private _saveRequestLocally() {
    window.localStorage.setItem(CURRENT_RECORD,
      JSON.stringify(this.getCurrentRecord()));
  }

  private _deleteLocalRequest() {
    window.localStorage.removeItem(CURRENT_RECORD);
  }

  private _getLocallySavedRequest() {
    return JSON.parse(
      window.localStorage.getItem(CURRENT_RECORD) || 'false'
    ) || { ...this._resetRecord };
  }
}

export function objectToString(path, title, value) {
  const { selected, date, fromtime, totime, time, text, valid } = value;
  const pathLength = path ? path.split('.').length : 0;
  // build path offest for indent formatting
  const offset = pathLength > 2
    ? '  '.repeat(pathLength - 3) + '+ '
    : '';
  if (selected) { return offset + title; }
  if (valid) {
    let result;
    if (fromtime || date || time || text) {
      result = offset + (title ?  title + ' ' : '');
    }

    if (fromtime) { return result + `${date} from ${fromtime} to ${totime}`; }
    if (date) { return result + date; }
    if (time) { return result + time; }
    if (text) { return result + text; }
    return result;
  }
}
