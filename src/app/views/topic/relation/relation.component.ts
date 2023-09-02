import { Component, Renderer2, ViewChild, ElementRef } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CKEditor4 } from 'ckeditor4-angular/ckeditor';
import { HttpCallService } from 'src/app/common/http-call.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-relation',
  templateUrl: './relation.component.html',
  styleUrls: ['./relation.component.scss'],
})
export class RelationComponent {

  questions: any = [];
  selectedId: any = [];
  errMessage: string = '';
  errFlag: boolean = true;
  formGroup: any;
  page: number = 1;
  limit: number = 10;
  searchErrFlag: boolean = false

  constructor(
    public commonservice: HttpCallService,
    private _router: Router,
    private formBuilder: FormBuilder,
    private router: Router
  ) {   
    this.formGroup = this.formBuilder.group({
    level: new FormControl('', []),
    search: new FormControl('', []),
  });
}

get level() {
  return this.formGroup.get('level');
}

get search() {
  return this.formGroup.get('search');
}

async ngOnInit() {
  await this.getQuestion({
    page: this.page,
    limit: this.limit
  });
}

  async getQuestion(params: any) {
    await this.commonservice.put(params, 'questions/').subscribe((res) => {
      const apiResult = JSON.parse(JSON.stringify(res));
      this.questions = apiResult && apiResult.payload;

      if (apiResult && apiResult.status == 'SUCCESS') {
        this.questions = apiResult && apiResult.payload;
        this.questions.map((question: any) => {});
      } else {
        this.errFlag = true;
        this.errMessage = apiResult.msg;
      }
    });
  }

  async onSubmit(formData: any) {
    this.searchErrFlag = false
    console.log("formData>>>>>>>>>>>>>>>>",formData)
    if (formData.level == '' || formData.search == '') {
      this.searchErrFlag = true
    }
    await this.getQuestion({
      page: this.page,
      limit: this.limit,
      level: formData.level,
      search: formData.search,
    });
  }

  clear(){
    this.formGroup.reset();
  }
    
  addId(id:any){
    this.selectedId.push(id);
    this.selectedId = [...new Set(this.selectedId)];
  }

  removeTags(str: any) {
    if (str === null || str === '') return false;
    else str = str.toString();
    return str.replace(/(<([^>]+)>)/gi, '');
  }

  add(){
    alert();
  }
}
