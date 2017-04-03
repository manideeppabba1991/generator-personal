import { Injectable } from '@angular/core';
import {Http, Response} from "@angular/http";
import {AccountResponse} from 'app/shared/account-response';
import {Observable} from 'rxjs';

@Injectable()
export class AccountService {
  private _accountSearchUrl = 'api/location/locations.json';
  private _accountSuggestionsUrl = 'api/location/locations.json';
  private _accountElasticSearchURL = 'elastic/_search?q=';

  constructor(private _http:Http) { }

  getAccounts(input:string):Observable<AccountResponse[]>{
    return this._http.get(this._accountElasticSearchURL+input)
      .map((res:Response) =>  res.json().hits.hits)
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

  getAccountsSuggestions(input:string):Observable<AccountResponse[]>{
    return this._http.get(this._accountElasticSearchURL+input)
      .map((res:Response) => res.json().hits.hits)
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

}
