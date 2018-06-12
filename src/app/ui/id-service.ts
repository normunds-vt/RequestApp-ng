export class IdService {
  _id = 0;

  getId(): string {
    this._id = this._id + 1;
    return '' + this._id;
  }
}
