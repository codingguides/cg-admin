import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CKEditor4 } from 'ckeditor4-angular/ckeditor';
import { ToastrService } from 'ngx-toastr';
import { HttpCallService } from 'src/app/common/http-call.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-add-blog',
  templateUrl: './add-blog.component.html',
  styleUrls: ['./add-blog.component.scss']
})
export class AddBlogComponent {

  public favoriteColor = '#26ab3c';
  public updateDesc: string = '';
  formGroup!: FormGroup;
  editorData: any = '<p>Enter text</p>';
  blogs!: any[];
  blogSlug: string = '';
  getUserDetails: any;
  config: any;
  status: String = 'publish';
  topics: any[] = [];
  topicCate: any[] = [];
  isCategory:boolean = true;
  selectedTopic:any = {}

  constructor(
    public commonservice: HttpCallService,
    private _router: Router,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,

  ) {
    this.config = this.commonservice.getConfigOfCKEditor();

    this.formGroup = this.formBuilder.group({
      title: new FormControl('', [Validators.required]),
      slug: new FormControl('', [Validators.required]),
      feature_image: new FormControl('', []),
      feature_video: new FormControl('', []),
      topic_id: new FormControl('', []),
      category_id: new FormControl('', [Validators.required]),
    })
  }

  public onTagEdited(event: any) {
    console.log('tag edited: current value is ' + event);
  }

  get title() {
    return this.formGroup.get('title');
  }

  get feature_image() {
    return this.formGroup.get('feature_image');
  }

  get feature_video() {
    return this.formGroup.get('feature_video');
  }

  get category_id() {
    return this.formGroup.get('category_id');
  }

  get topic_id() {
    return this.formGroup.get('topic_id');
  }

  async ngOnInit() {
    this.getBlog();
    this.getTopic();
    this.getUserDetails = await this.commonservice.getTokenDetails('id');
  }

  onChange(event: CKEditor4.EventInfo) {
    this.updateDesc = event.editor.getData();
  }

  async getBlog() {
    await this.commonservice.get('blog/').subscribe((res) => {
      const apiResult = JSON.parse(JSON.stringify(res));
      this.blogs = apiResult && apiResult.payload;
    });
  }

  createSlug(event: any) {
    this.blogSlug = event.target.value
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }

  async onSubmit(formData: any) {
    const data = {
      title: formData['title'],
      slug: formData['slug'] ? formData['slug'] : this.blogSlug,
      description: this.updateDesc,
      user_id: this.getUserDetails,
      feature_image: formData['feature_image'],
      feature_video: formData['feature_video'],
      status: this.status,
      topic_id: this.selectedTopic.topic_id,
      category_id: formData['category_id']
    };
    this.commonservice.post(data, 'blog/add').subscribe((res) => {
      const apiResult = JSON.parse(JSON.stringify(res));

      if (apiResult && apiResult.status == 'SUCCESS') {
        // this.toastr.success(apiResult.msg);
        this.formGroup.reset();
        this.formBuilder
        this.getUserDetails = '';
        this.updateDesc = '';
        this.editorData = 'Enter text';
        this.ngOnInit();

        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: apiResult.msg,
          showConfirmButton: false,
          timer: 1500,
        });
      }
      else {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: apiResult.message,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    }, error => {
      const array = error.error.errors;
      const messages = array.map(function (err: any) { return err.msg })
      const reverseMsg = messages.reverse();
      const messages2 = reverseMsg.forEach((msgs: any) => {
        this.toastr.error(msgs, "ERROR");
      })
    })
  }

  changeStatus() {
    this.status = "draft";
  }

  async getTopic() {
    await this.commonservice.get('topic/list').subscribe((res) => {
      const apiResult = JSON.parse(JSON.stringify(res));
      let tres = apiResult && apiResult.payload;
      tres.map((result:any)=>{
        if(result.parent_id == null){
          this.topics.push(result)
        }
      })
    });
  }

  async getCate(val:any){
    this.selectedTopic = JSON.parse(val.target.value);
    this.topicCate = [];
    if(this.selectedTopic.slug){
      console.log("selectedTopic.slug>>>>>>>>>>>>>",this.selectedTopic.slug)
      await this.commonservice.get(`blog/get/category/${this.selectedTopic.slug}`).subscribe((res) => {
        const apiResult = JSON.parse(JSON.stringify(res));
        let tres = apiResult && apiResult.payload;
        this.isCategory = tres.length > 0 ? true : false;
        console.log("tres>>>>>>>",tres)
        tres.map((result:any)=>{
          this.topicCate.push(result);
        })
      });
    }
    
  }

}
