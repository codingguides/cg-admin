import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import jwt_decode from "jwt-decode";

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

  public isLoggedIn() {
    let status = "LoggedIn"
    if (!sessionStorage.getItem('accessToken') || sessionStorage.getItem('accessToken') == undefined) {
      status = "LogOut"
      this._router.navigate(['./login']);
    }
    sessionStorage.setItem('status', status)
    console.log("status: ", status)
    return status;
  }

  public getTokenDetails(param: string) {
    const gettoken: any = this.token;
    const decoded: any = jwt_decode(gettoken);
    return decoded[param];
  }


  public getConfigOfCKEditor(): any {
    const toolbarGroups = [
      '/',
      { name: 'document', groups: ['mode', 'doctools', 'document'] },
      { name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing'] },
      { name: 'forms', groups: ['forms'] },
      '/',
      { name: 'clipboard', groups: ['clipboard', 'undo'] },
      { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph'] },
      '/',
      { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
      { name: 'links', groups: ['links'] },
      { name: 'styles', groups: ['styles'] },
      { name: 'colors', groups: ['colors'] },
      { name: 'tools', groups: ['tools'] },
      { name: 'others', groups: ['others'] },
      { name: 'about', groups: ['about'] },
      { name: 'insert', groups: ['codesnippet'] }
    ];
    // const removeButtons: string = 'Source,Templates,Save,NewPage,Print,Replace,Scayt,SelectAll,Form,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,Blockquote,CreateDiv,Language,Image,Flash,Table,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,ShowBlocks,About,Checkbox,Find,Preview,Styles,Format,Anchor';

    return {
      toolbarGroups: toolbarGroups,
      // removeButtons: removeButtons,
      disableNativeSpellChecker: true,
      ignoreEmptyParagraphValue: true,
      extraPlugins: "codesnippet",
      codeSnippet_theme: 'school_book',
      codeSnippet_languages: { javascript: 'JavaScript', php: 'PHP' }
    };
  }

}
