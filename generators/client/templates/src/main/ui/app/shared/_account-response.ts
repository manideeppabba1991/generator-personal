import {Customer} from './customer';
export interface AccountResponse {
  _index: string,
  _type:string,
  _id:string,
  _score: number,
  _source: Customer,
}
