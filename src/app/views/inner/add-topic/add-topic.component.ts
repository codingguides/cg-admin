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
  updateDesc:any="";
  formGroup!: FormGroup;
  editorData:any ="<p>Enter text</p>"
  topics!: any[];
  topicSlug: string = "";
  getUserDetails: any;

  // toast
  position = 'top-end';
  visible = false;
  percentage = 0;
 
  constructor(
    public commonservice : HttpCallService,
    private _router: Router,
    private formBuilder: FormBuilder,
    private router : Router
  ) { 
  }

  async ngOnInit(){
    this.getTopic();

    this.getUserDetails = await this.commonservice.getTokenDetails('id');
    
    this.formGroup = this.formBuilder.group({ 
      name:  ['', [Validators.required, Validators.minLength(2)]],
      slug: ['', [Validators.required]],
      description: '',
      parent_id:  ['', [Validators.required]]
    });
  }

  // get f() { return this.formGroup.controls; }

  onChange( event: CKEditor4.EventInfo ) {
    this.updateDesc = event.editor.getData();
  }

  async getTopic(){
    await this.commonservice.get('topic/').subscribe((res)=>{
      console.log("res>>>>>>>>>>>>",res)
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
    console.log("this.updateDesc.length..............",this.updateDesc.length)
    // if(!this.topicSlug  && this.updateDesc){
      alert("hi")
      const data = {
        name: formData['name'],
        slug: this.topicSlug,
        description: this.updateDesc,
        parent_id: formData['parent_id'],
        user_id: this.getUserDetails
      }
      console.log("data>>>>>>>>>>",data)
      this.commonservice.post(data, 'topic/add').subscribe(res => {
        console.log("res>>>>>>>>>>>",res)
        const apiResult = JSON.parse(JSON.stringify(res));
        console.log(apiResult)
        if(apiResult && apiResult.status == "SUCCESS"){
          alert(apiResult.msg)
          this.visible = !this.visible;

          this.formGroup.reset();
          this.topicSlug = "";
          this.getUserDetails = "";
        }else{
          alert(apiResult.msg)

        }
  
      })
    // }

  }

  onVisibleChange($event: boolean) {
    this.visible = $event;
    this.percentage = !this.visible ? 0 : this.percentage;
  }

  onTimerChange($event: number) {
    this.percentage = $event * 25;
  }

}
