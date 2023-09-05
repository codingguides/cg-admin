import { Component } from '@angular/core';
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
  selector: 'app-add-blog',
  templateUrl: './add-blog.component.html',
  styleUrls: ['./add-blog.component.scss']
})
export class AddBlogComponent {

  public favoriteColor = '#26ab3c';
  updateDesc: any = '';
  formGroup!: FormGroup;
  editorData: any = '<p>Enter text</p>';
  topicSlug: string = '';
  config: any;

  constructor(
    public commonservice: HttpCallService,
    private _router: Router,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.config = this.commonservice.getConfigOfCKEditor();

    this.formGroup = this.formBuilder.group({
      title: new FormControl('', [Validators.required]),
      slug: new FormControl('', []),
      // parent_id: new FormControl('', [Validators.required]),
      // tags: new FormControl('', [Validators.required]),
    })
  }

  public onTagEdited(event: any) {
    console.log('tag edited: current value is ' + event);
  }

  async ngOnInit() { }

  onChange(event: CKEditor4.EventInfo) {
    this.updateDesc = event.editor.getData();
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

  async onSubmit(formData: any) { }

}
