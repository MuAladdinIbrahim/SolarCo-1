import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient,
    private api: GlobalService) { }
    
  private apiClient:String = `${this.api.host}/clients`;;
  private apiContractor:String = `${this.api.host}/contractors`;;

  getContractor(id) {
    return this.http.get(`${this.apiContractor}/${id}`);
  }

  updateAvatar(id, type, body, headers) {
    if(type == 'USER')
      return this.http.put(`${this.apiClient}/avatar/${id}`, body, {headers: headers});
    else if (type == 'CONTRACTOR')
      return this.http.put(`${this.apiContractor}/avatar/${id}`, body, {headers: headers});
  }

  updateUser(id, type, body) {
    if(type == 'USER') return this.http.put(`${this.apiClient}/${id}`, body);
    else if (type == 'CONTRACTOR') return this.http.put(`${this.apiContractor}/${id}`, body);
  }

}
