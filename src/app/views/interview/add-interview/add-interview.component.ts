import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CKEditor4 } from 'ckeditor4-angular/ckeditor';
import { HttpCallService } from '../../../common/http-call.service';

@Component({
  selector: 'app-add-interview',
  templateUrl: './add-interview.component.html',
  styleUrls: ['./add-interview.component.scss']
})
export class AddInterviewComponent {

  public favoriteColor = '#26ab3c';
  updateDesc: any = "";
  formGroup!: FormGroup;
  editorData: any = "<p>Enter text</p>"
  topics!: any[];
  getUserDetails: any;


  constructor(
    public commonservice: HttpCallService,
    private _router: Router,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.formGroup = this.formBuilder.group({
      question: new FormControl('', [Validators.required]),
      answer: new FormControl('', [Validators.required]),
      type: new FormControl('', [Validators.required]),
      topic_id: new FormControl('', [Validators.required])
    })

  }

  public onTagEdited(event: any) {
    console.log('tag edited: current value is ' + event);
  }

  get question() {
    return this.formGroup.get('question');
  }

  get answer() {
    return this.formGroup.get('answer');
  }

  get topic_id() {
    return this.formGroup.get('topic_id');
  }

  get type() {
    return this.formGroup.get('type');
  }


  async ngOnInit() {
    this.getinterview();

    this.getUserDetails = await this.commonservice.getTokenDetails('id');
  }

  onChange(event: CKEditor4.EventInfo) {
    this.updateDesc = event.editor.getData();
  }

  async getinterview() {
    await this.commonservice.get('topic/').subscribe((res) => {
      const apiResult = JSON.parse(JSON.stringify(res));
      this.topics = apiResult && apiResult.payload;
      console.log("this.topics>>>>>>>>>>>>>>",this.topics)
    })
  }

  async onSubmit(formData: any) {
    console.log("value::::::::", this.formGroup.value);
    console.log("this.updateDesc.length..............", this.updateDesc.length)
    // if(!this.interviewSlug  && this.updateDesc){
    // alert("hi")
    // const tags = formData['tags'].split(',').filter((tag: any) => tag)
    // const data = {
    //   name: formData['name'],
    //   slug: formData['slug'] ? formData['slug'] : this.interviewSlug,
    //   description: this.updateDesc,
    //   parent_id: formData['parent_id'],
    //   user_id: this.getUserDetails,
    //   tags: formData['tags'].split(',').filter((tag: any) => tag)
    // }
    // console.log("data>>>>>>>>>>", data)
    // this.commonservice.post(data, 'interview/add').subscribe(res => {
    //   console.log("res>>>>>>>>>>>", res)
    //   const apiResult = JSON.parse(JSON.stringify(res));
    //   console.log(apiResult)
    //   if (apiResult && apiResult.status == "SUCCESS") {
    //     this.formGroup.reset();
    //     this.interviewSlug = "";
    //     this.getUserDetails = "";
    //     alert(apiResult.msg)
    //   } else {
    //     alert(apiResult.msg)
    //   }

    // })

  }



}
