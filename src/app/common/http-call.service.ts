import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class HttpCallService {

  url: string = `${environment.apiURL}/api/`;
  token = localStorage.getItem("accessToken");
  headerOptions: any = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `${this.token}`
    })
  };

  constructor(private httpClient: HttpClient, private _router: Router) {

  }

  public get(endPoints: String) {
    return this.httpClient.get(this.url + endPoints, this.headerOptions)
  }

  public login(postData: Object, endPoints: String) {
    return this.httpClient.post(this.url + endPoints, postData, 
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
  }

  public post(postData: Object, endPoints: String) {
    return this.httpClient.post(this.url + endPoints, postData, this.headerOptions)
  }

  public put(postData: Object, endPoints: String) {
    return this.httpClient.put(this.url + endPoints, postData, this.headerOptions)
  }

  public update(postData: Object, endPoints: String) {
    return this.httpClient.put(this.url + endPoints, postData, this.headerOptions)
  }

  public delete(endPoints: String) {
    return this.httpClient.delete(this.url + endPoints, this.headerOptions)
  }

  public isLoggedIn( ) {
    let status = "LoggedIn"
    if(!sessionStorage.getItem('accessToken') || sessionStorage.getItem('accessToken') == undefined){
      status="LogOut"
      this._router.navigate(['./login']);
    }
    sessionStorage.setItem('status',status)
    console.log("status: ",status)
    return status;
  }


}
