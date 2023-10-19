import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CKEditor4 } from 'ckeditor4-angular/ckeditor';
import { HttpCallService } from 'src/app/common/http-call.service';

@Component({
  selector: 'app-edit-blog',
  templateUrl: './edit-blog.component.html',
  styleUrls: ['./edit-blog.component.scss']
})
export class EditBlogComponent {

  public favoriteColor = '#26ab3c';
  updateDesc: any = '';
  formGroup!: FormGroup;
  blogs!: any[];
  blogSlug: string = '';
  getUserDetails: any;
  blogByID: any = {};
  config: any;
  slugError: any = {
    flag: false,
    message: '',
  };

  constructor(
    public commonservice: HttpCallService,
    private _router: Router,
    private formBuilder: FormBuilder,
    private router: ActivatedRoute
  ) {
    this.config = this.commonservice.getConfigOfCKEditor();

    this.formGroup = this.formBuilder.group({
      title: new FormControl('', [Validators.required]),
      slug: new FormControl('', [Validators.required]),
      feature_image: new FormControl('', [Validators.required]),
      feature_video: new FormControl('', [Validators.required]),
      description: new FormControl('')
    })
  }

  get title() {
    return this.formGroup.get('title');
  }

  get slug() {
    return this.formGroup.get('slug');
  }

  get feature_image() {
    return this.formGroup.get('feature_image');
  }

  get feature_video() {
    return this.formGroup.get('feature_video');
  }

  get description() {
    return this.formGroup.get('description');
  }


  async ngOnInit() {
    await this.getId();
  }

  async getId() {
    await this.commonservice
      .get(`blog/get/${this.router.snapshot.params['id']}`)
      .subscribe((result: any) => {
        const apiResult = JSON.parse(JSON.stringify(result));
        console.log(apiResult)
        if (result && result.status == 'SUCCESS') {
          this.blogByID = result && result.payload;

          this.updateDesc = this.blogByID.description;
          this.formGroup = this.formBuilder.group({
            title: new FormControl(this.blogByID.title),
            slug: new FormControl(this.blogByID.slug),
            description: new FormControl(this.blogByID.description),
            feature_image: new FormControl(this.blogByID.feature_image),
            feature_video: new FormControl(this.blogByID.feature_video)

          });
        }
      });
  }

  onChange(event: CKEditor4.EventInfo) {
    this.updateDesc = event.editor.getData();
  }

  createSlug(event: any) {
    this.slugError.flag = false;
    this.slugError.message = '';
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

  validateSlug(event: any) {
    this.slugError.flag = false;
    this.slugError.message = '';
    if (event.target.value == '') {
      this.slugError.flag = true;
      this.slugError.message = 'Slug is required!';
    }
  }

  async getBlog(selected: any) {
    await this.commonservice.get('blog/list').subscribe((res) => {
      const apiResult = JSON.parse(JSON.stringify(res));
      this.blogs = apiResult && apiResult.payload;
      this.blogs = this.blogs.map((blog) => {
        return {
          ...blog,
          selected: blog._id === selected ? true : false,
        };
      });
    });
  }

  async onSubmit(formData: any) {
    const data = {
      title: formData['title'],
      slug: formData['slug'] ? formData['slug'] : this.blogSlug,
      description: this.updateDesc,
      user_id: this.getUserDetails,
      feature_image: formData['feature_image'],
      feature_video: formData['feature_video'],
    };
    this.commonservice
      .put(data, `blog/update/${this.router.snapshot.params['id']}`)
      .subscribe((res) => {
        const apiResult = JSON.parse(JSON.stringify(res));

        if (apiResult && apiResult.status == 'SUCCESS') {
          this.formGroup.reset();
          this.getUserDetails = '';
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
            title: apiResult.msg,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      })
  }



}
