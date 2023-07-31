import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CKEditor4 } from 'ckeditor4-angular/ckeditor';
import { HttpCallService } from 'src/app/common/http-call.service';

@Component({
  selector: 'app-add-topic',
  templateUrl: './add-topic.component.html',
  styleUrls: ['./add-topic.component.scss']
})
export class AddTopicComponent {

  public favoriteColor = '#26ab3c';
  updateDesc: any = "";
  formGroup!: FormGroup;
  editorData: any = "<p>Enter text</p>"
  topics!: any[];
  topicSlug: string = "";
  getUserDetails: any;


  constructor(
    public commonservice: HttpCallService,
    private _router: Router,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.formGroup = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      slug: new FormControl('slug-name', [Validators.required]),
      parent_id: new FormControl('', [Validators.required]),
      tags: new FormControl('', [Validators.required]),
    })

  }

  public onTagEdited(event: any) {
    console.log('tag edited: current value is ' + event);
  }

  get name() {
    return this.formGroup.get('name');
  }

  get slug() {
    return this.formGroup.get('slug');
  }

  get parent_id() {
    return this.formGroup.get('parent_id');
  }

  get tags() {
    return this.formGroup.get('tags');
  }


  async ngOnInit() {
    this.getTopic();

    this.getUserDetails = await this.commonservice.getTokenDetails('id');

    // this.formGroup = this.formBuilder.group({ 
    //   name:  ['', [Validators.required, Validators.minLength(2)]],
    //   slug: ['', [Validators.required]],
    //   description: '',
    //   parent_id:  ['', [Validators.required]],
    //   tags: ['', [Validators.required]],
    // });

  }

  // get f() { return this.formGroup.controls; }

  onChange(event: CKEditor4.EventInfo) {
    this.updateDesc = event.editor.getData();
  }

  async getTopic() {
    await this.commonservice.get('topic/').subscribe((res) => {
      const apiResult = JSON.parse(JSON.stringify(res));
      this.topics = apiResult && apiResult.payload;
    })
  }

  createSlug(event: any) {
    this.topicSlug = event.target.value.toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  }

  async onSubmit(formData: any) {
    console.log("value::::::::", this.formGroup.value);
    console.log("this.updateDesc.length..............", this.updateDesc.length)
    // if(!this.topicSlug  && this.updateDesc){
    // alert("hi")
    const tags = formData['tags'].split(',').filter((tag: any) => tag)
    const data = {
      name: formData['name'],
      slug: formData['slug'] ? formData['slug'] : this.topicSlug,
      description: this.updateDesc,
      parent_id: formData['parent_id'],
      user_id: this.getUserDetails,
      tags: formData['tags'].split(',').filter((tag: any) => tag)
    }
    console.log("data>>>>>>>>>>", data)
    this.commonservice.post(data, 'topic/add').subscribe(res => {
      console.log("res>>>>>>>>>>>", res)
      const apiResult = JSON.parse(JSON.stringify(res));
      console.log(apiResult)
      if (apiResult && apiResult.status == "SUCCESS") {
        console.log("paylod>>>>>>>>>>>>>>>>>", apiResult.payload._id)
        console.log(">>>>>>>>>tags>>>>>>>>>", tags)
        tags.map(async (tag: string) => {
          console.log(">>>>.tag>>>>>>>>>", tag)
          await this.commonservice.post({
            name: tag,
            type: "topic",
            topic_id: apiResult?.payload?._id,
            question_id: apiResult?.payload?._id,
          }, 'tags/add').subscribe((res: any) => {
            console.log("tagres>>>>>>>>", res)
          })
        })
        this.formGroup.reset();
        this.topicSlug = "";
        this.getUserDetails = "";
        alert(apiResult.msg)
      } else {
        alert(apiResult.msg)

      }

    })
    // }

  }



}
