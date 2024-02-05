import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CKEditor4 } from 'ckeditor4-angular/ckeditor';
import { HttpCallService } from 'src/app/common/http-call.service';


@Component({
  selector: 'app-edit-list-item',
  templateUrl: './edit-list-item.component.html',
  styleUrls: ['./edit-list-item.component.scss']
})
export class EditListItemComponent {


  public favoriteColor = '#26ab3c';
  updateDesc: any = "";
  formGroup!: FormGroup;
  // editorData: any = this.updateDesc;
  topics!: any[];
  topicSlug: string = "";
  getUserDetails: any;


  constructor(
    public commonservice: HttpCallService,
    private _router: Router,
    private formBuilder: FormBuilder,
    // private router: Router,
    private router: ActivatedRoute
  ) {
    this.formGroup = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      slug: new FormControl('', [Validators.required]),
      parent_id: new FormControl('', [Validators.required]),
      tags: new FormControl('', [Validators.required]),
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
    // console.log(this.router.snapshot.params['id'])
    // console.log(typeof this.router.snapshot.params['id'])
    // this.commonservice.get('topic/get/id').subscribe((result: any) => {
    // console.log(result);
    // const idResult = JSON.parse(JSON.stringify(result));
    // console.log(idResult.payload);
    // this.formGroup = new FormGroup({
    //   name: new FormControl(result['name']),
    //   slug: new FormControl(result['slug']),
    //   parent_id: new FormControl(result['parent_id']),
    //   // tags: new FormControl(result['']),
    //   description: new FormControl(result['description'])
    // })
    // })
    this.getId();

    // this.getUserDetails = await this.commonservice.getTokenDetails('id');

    // this.formGroup = this.formBuilder.group({ 
    //   name:  ['', [Validators.required, Validators.minLength(2)]],
    //   slug: ['', [Validators.required]],
    //   description: '',
    //   parent_id:  ['', [Validators.required]],
    //   tags: ['', [Validators.required]],
    // });

  }

  async getId() {
    // console.log(this.router.snapshot.params['id']);
    await this.commonservice.get(`topic/get/${this.router.snapshot.params['id']}`).subscribe((result: any) => {
      // const apiResult = JSON.parse(JSON.stringify(res));
      console.log(result);
      this.topics = result && result.success
      this.topics.map((topic: any) => {
        console.log(topic.data);

        this.formGroup = this.formBuilder.group({
          name: new FormControl(topic.data['name']),
          slug: new FormControl(topic.data['slug']),
          parent_id: new FormControl(topic.data['parent_id']),
          description: new FormControl(topic.data[this.updateDesc]),
          tags: new FormControl(topic.data['tags'])
        })
      })
      // this.formGroup = this.formBuilder.group({
      //   name: new FormControl(result['name']),
      //   slug: new FormControl(result['slug']),
      //   parent_id: new FormControl(result['parents_id']),
      //   // tags: new FormControl('', [Validators.required]),
      // })
    })
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
  }
}
