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
  selector: 'app-add-topic',
  templateUrl: './add-topic.component.html',
  styleUrls: ['./add-topic.component.scss'],
})
export class AddTopicComponent {
  public favoriteColor = '#26ab3c';
  public updateDesc: string = '';
  formGroup!: FormGroup;
  editorData: any = '<p>Enter text</p>';
  topics!: any[];
  topicSlug: string = '';
  getUserDetails: any;
  config: any;

  constructor(
    public commonservice: HttpCallService,
    private _router: Router,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.config = this.commonservice.getConfigOfCKEditor();

    this.formGroup = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      slug: new FormControl('', []),
      parent_id: new FormControl('', [Validators.required]),
      tags: new FormControl('', [Validators.required]),
      home_tagline: new FormControl('', [Validators.required]),
      index_no: new FormControl('', []),
      featureImg: new FormControl('', []),
    });
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

  get home_tagline() {
    return this.formGroup.get('home_tagline');
  }

  get index_no() {
    return this.formGroup.get('index_no');
  }

  get featureImg() {
    return this.formGroup.get('featureImg');
  }

  async ngOnInit() {
    this.getTopic();

    this.getUserDetails = await this.commonservice.getTokenDetails('id');
  }

  onChange(event: CKEditor4.EventInfo) {
    this.updateDesc = event.editor.getData();
  }

  async getTopic() {
    await this.commonservice.get('topic/list').subscribe((res) => {
      const apiResult = JSON.parse(JSON.stringify(res));
      this.topics = apiResult && apiResult.payload;
    });
  }

  createSlug(event: any) {
    this.topicSlug = event.target.value
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
    const tags =
      formData['tags'] && formData['tags'].split(',').filter((tag: any) => tag);
    const data = {
      name: formData['name'],
      slug: formData['slug'] ? formData['slug'] : this.topicSlug,
      description: this.updateDesc,
      parent_id: formData['parent_id'],
      user_id: this.getUserDetails,
      tags: tags,
      home_tagline: formData['home_tagline'],
      index_no: formData['index_no'],
      featureImg: formData['featureImg'],
    };

    this.commonservice.post(data, 'topic/add').subscribe(
      (res) => {
        const apiResult = JSON.parse(JSON.stringify(res));
        console.log(apiResult);

        if (apiResult && apiResult.status == 'SUCCESS') {
          tags.map(async (tag: string) => {
            await this.commonservice
              .post(
                {
                  name: tag,
                  type: 'topic',
                  topic_id: apiResult?.payload?._id,
                },
                'tags/add'
              )
              .subscribe((res: any) => {});
          });
          this.formGroup.reset();
          this.topicSlug = '';
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
        } else {
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: apiResult.message,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      },
      (error) => {
        const array = error.error.errors;
        const messages = array.map(function (err: any) {
          return err.msg;
        });
        const reverseMsg = messages.reverse();
        const messages2 = reverseMsg.forEach((msgs: any) => {
          this.toastr.error(msgs, 'ERROR');
        });
      }
    );
  }
}
