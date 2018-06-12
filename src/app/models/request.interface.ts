export interface IRequest {
  id: string;
  createdOn: Date;
  updatedOn: Date;
  description: string;
  contentList: {
    title: string;
    path: string;
    value: any;
  }[];
}
