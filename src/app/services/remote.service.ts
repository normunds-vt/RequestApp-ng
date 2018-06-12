import { IRequest } from './../models/request.interface';
import { IRequestItem} from '../models/request-item.interface';


export abstract class RemoteService {

  abstract getOpenRequests(): Promise<IRequestItem[]> ;

  abstract getRequest(requestid: string): Promise<IRequest>;

  abstract submitRequest(request: IRequest): Promise<IRequest>;

  abstract deleteRequest(requestid: string): Promise<boolean>;
}
