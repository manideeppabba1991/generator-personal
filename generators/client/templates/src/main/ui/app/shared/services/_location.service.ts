import { Injectable } from '@angular/core';
import {Location} from 'app/shared/location';
import {Observable,} from 'rxjs'
import {Http, Response} from "@angular/http";

@Injectable()
export class LocationService {

  private _locationServiceUrl = 'api/location/locations.json';
  private _locationSuggestionsUrl = 'api/location/locations.json';
  private _locationElasticSearchURL = 'elastic/_search?q=';

  constructor(private _http:Http) { }

  getLocations(input:string):Observable<Location[]>{
    return this._http.get(this._locationServiceUrl)
      .map((res:Response) => res.json())
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

  getSuggestions(input:string):Observable<Location[]>{
    return this._http.get(this._locationServiceUrl)
      .map((res:Response) => res.json())
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));

  }

}
