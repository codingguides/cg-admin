import { Component, OnInit } from '@angular/core';  
import Swal from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CKEditor4 } from 'ckeditor4-angular/ckeditor';
import { HttpCallService } from 'src/app/common/http-call.service';


@Component({
  selector: 'app-edit-topic',
  templateUrl: './edit-topic.component.html',
  styleUrls: ['./edit-topic.component.scss']
})
export class EditTopic {


  public favoriteColor = '#26ab3c';
  updateDesc: any = "";
  formGroup!: FormGroup;
  topics!: any[];
  topicSlug: string = "";
  getUserDetails: any;
  topicByID: any = {}
  topicTags: any[] = []

  constructor(
    public commonservice: HttpCallService,
    private _router: Router,
    private formBuilder: FormBuilder,
    private router: ActivatedRoute
  ) {
    this.formGroup = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      slug: new FormControl('', [Validators.required]),
      parent_id: new FormControl('', [Validators.required]),
      tags: new FormControl('', []),
      description: new FormControl('')
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

  get description() {
    return this.formGroup.get('description');
  }

  get parent_id() {
    return this.formGroup.get('parent_id');
  }

  get tags() {
    return this.formGroup.get('tags');
  }
  async ngOnInit() {
    await this.getId();
  }

  async getId() {
    // console.log(this.router.snapshot.params['id']);
    await this.commonservice.get(`topic/get/${this.router.snapshot.params['id']}`).subscribe(async (result: any) => {
      if(result && result.status == "SUCCESS"){
        this.topicByID = result && result.payload[0];
          console.log("<<<<<<<<<<<<<<<<<<getId>>>>>>>>>>>>>>>>>>>",this.topicByID);
          this.updateDesc = this.topicByID.description;
          await this.getTopic(this.topicByID.parent_id);
          this.topicTags = this.topicByID.tags;
          console.log("tags reload>>>>>>>>>>>>>",this.topicTags)
          this.formGroup = this.formBuilder.group({
            name: new FormControl(this.topicByID.name),
            slug: new FormControl(this.topicByID.slug),
            parent_id: new FormControl(this.topicByID.parent_id),
            description: new FormControl(this.topicByID.description),
            tags: new FormControl()
          })
      }
    })
  }

  // get f() { return this.formGroup.controls; }

  onChange(event: CKEditor4.EventInfo) {
    this.updateDesc = event.editor.getData();
  }

  async getTopic(selected:any) {
    await this.commonservice.get('topic/list').subscribe((res) => {
      const apiResult = JSON.parse(JSON.stringify(res));
      this.topics = apiResult && apiResult.payload
      this.topics = this.topics.map((topic)=>{
        return {
          ...topic,
          "selected": topic._id === selected ? true : false
        }
      })
      console.log("this.topics>>>>>>>>",this.topics)
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

  deletetag(tag:any){
    this.commonservice.delete(`tags/delete/${tag._id}`).subscribe(res => {
      const apiResult = JSON.parse(JSON.stringify(res));
      if(apiResult.status == "SUCCESS"){
        this.ngOnInit();
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: apiResult.msg,
          showConfirmButton: false,
          timer: 1500
        })
      }else{
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: apiResult.msg,
          showConfirmButton: false,
          timer: 1500
        })
      }
    })
  }

  async onSubmit(formData: any) {

    console.log("formData>>>>>>>>>>>>",formData)
    const tags = formData['tags'].split(',').filter((tag: any) => tag)

    const data = {
      name: formData['name'],
      slug: formData['slug'] ? formData['slug'] : this.topicSlug,
      description: this.updateDesc,
      parent_id: formData['parent_id'],
      user_id: this.getUserDetails,
      tags: tags
    }
    this.commonservice.put(data, `topic/update/${this.router.snapshot.params['id']}`).subscribe(res => {
      const apiResult = JSON.parse(JSON.stringify(res));
      console.log("apiResult>>>>>>><<<<<<<<<<<<<<<<",apiResult)
      if(apiResult.status == "SUCCESS"){
        tags.map(async (tag: string) => {
          console.log(">>>>.tag>>>>>>>>>", tag)
          await this.commonservice.post({
            name: tag,
            type: "topic",
            topic_id: this.router.snapshot.params['id']
          }, 'tags/add').subscribe((res: any) => {
            console.log("tagres>>>>>>>>", res)
          })
        })
        this.ngOnInit();
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: apiResult.msg,
          showConfirmButton: false,
          timer: 1500
        })
      }else{
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: apiResult.msg,
          showConfirmButton: false,
          timer: 1500
        })
      }
    })

  }
}
