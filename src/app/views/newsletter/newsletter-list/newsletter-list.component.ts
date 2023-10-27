import { Component } from '@angular/core';
import { HttpCallService } from '../../../common/http-call.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CKEditor4 } from 'ckeditor4-angular';

@Component({
  selector: 'app-newsletter-list',
  templateUrl: './newsletter-list.component.html',
  styleUrls: ['./newsletter-list.component.scss']
})
export class NewsletterListComponent {
  formGroup!: FormGroup;
  blogs: any = [];
  errMessage: string = '';
  errFlag: boolean = true;
  page: number = 1;
  totalLength: any;
  limit: number = 1000;
  emailList:any = [];
  ccemail:any = '';
  config: any;
  updateDesc: any;
  editorData: any = '<p>Enter text</p>';
 
  constructor(
    public commonservice: HttpCallService,
    private _router: Router,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.config = this.commonservice.getConfigOfCKEditor();
  }

  ngOnInit() {
    this.getBlog();
  }

  async getBlog() {
    await this.commonservice.get('newsletter/list/').subscribe((res) => {
      const apiResult = JSON.parse(JSON.stringify(res));
      console.log(apiResult.payload);
      if (apiResult && apiResult.status == 'SUCCESS') {
        this.blogs = apiResult && apiResult.payload;
      } else if (apiResult && apiResult.status == 'ERROR') {
        this.errFlag = true;
        this.errMessage = apiResult.msg;
        this.blogs = [];
      }
    })
  }

  addEmail(val:String){
    let found = this.emailList.find((email:any) =>  email === val ? true : false);
    if(found){
      this.emailList = this.emailList.filter((item:any) => {
        return item !== val
      });
      this.emailList = [...new Set(this.emailList)];
      this.ccemail = this.emailList.join();
    }else{
      this.emailList.push(val);
      this.emailList = [...new Set(this.emailList)];
      this.ccemail = this.emailList.join();
    }   
  }

  onChange(event: CKEditor4.EventInfo) {
    this.updateDesc = event.editor.getData();
  }

}
