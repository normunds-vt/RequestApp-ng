import { Injectable } from '@angular/core';
import { IRequest } from './../models/request.interface';
import { IRequestItem} from '../models/request-item.interface';
import { RemoteService } from './remote.service';

@Injectable()
export class RemoteLsService implements RemoteService {

  getOpenRequests(): Promise<IRequestItem[]> {
    const openRequestList: IRequestItem[] = getRecFromJson(
      window.localStorage.getItem('HD.openRequests')
    ) || [];

    return Promise.resolve(openRequestList);
  }

  getRequest(recid: string): Promise<IRequest> {
    return new Promise<IRequest>((resolve, reject) => {
      const recContent = window.localStorage.getItem(localStorageId(recid));
      if (recContent) {
        resolve(getRecFromJson(recContent));
      } else {
        reject('Request not found');
      }
    });
  }

  submitRequest(request: IRequest) {
    return this.getOpenRequests().then(requests => {
      const { id, createdOn, updatedOn, description } = request;
      const date = new Date();
      const savedRecord: IRequest = Object.assign({}, request, {
        id: id || ('' + (+date)),
        createdOn: id ? createdOn : date,
        updatedOn: createdOn ? date : null
      });

      const newrequestArr = (request.id
        ? requests.filter(item => item.id !== request.id) // remove current if exists
        : requests)
        .concat({
          id: savedRecord.id,
          createdOn: savedRecord.createdOn,
          updatedOn: savedRecord.updatedOn,
          content: description
        });

      window.localStorage.setItem(
        'HD.openRequests',
        JSON.stringify(newrequestArr)
      );
      window.localStorage.setItem(
        localStorageId(savedRecord.id),
        JSON.stringify(savedRecord)
      );

      return savedRecord;
    });
  }

  deleteRequest(requestid: string) {
    return this.getOpenRequests().then(requests => {
      const newrequestArr = requests.filter(item => item.id !== requestid);
      window.localStorage.setItem('HD.openRequests', JSON.stringify(newrequestArr));
      window.localStorage.removeItem(localStorageId(requestid));
      return true;
    });
  }
}

function localStorageId(recid) { return 'HD.rec_' + recid; }

function getRecFromJson(content) {
   return content ? JSON.parse(content, reviver) : content;
}

function reviver(key, value) {
  const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
  return (typeof value === 'string' && dateFormat.test(value))
    ? new Date(value)
    : value;
}
