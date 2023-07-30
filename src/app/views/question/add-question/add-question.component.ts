import { Component, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CKEditor4 } from 'ckeditor4-angular/ckeditor';
import { HttpCallService } from 'src/app/common/http-call.service';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.scss']
})
export class AddQuestionComponent {

  public favoriteColor = '#26ab3c';
  updateDesc: any = "";
  formGroup!: FormGroup;
  editorData: any = "<p>Enter text</p>"
  questions!: any[];
  questionSlug: string = "";
  getUserDetails: any;
  @ViewChild('div')
  div!: ElementRef;
  count: any = 0;
  options:any[] = [1,2,3,4];
  selectedOption:any = ""

  constructor(
    public commonservice: HttpCallService,
    private _router: Router,
    private formBuilder: FormBuilder,
    private router: Router,
    private renderer: Renderer2
  ) {
  }

  async ngOnInit() {
    this.getQuestion();

    this.getUserDetails = await this.commonservice.getTokenDetails('id');

    this.formGroup = this.formBuilder.group({
      question: ['', [Validators.required, Validators.minLength(2)]],
      option1: [],
      option2: [],
      option3: [],
      option4: [],
      rightoption: [],
      point: ['', [Validators.required]],
      level: ['', [Validators.required]],
      questiontype: ['', [Validators.required]]
    });

  }

  onChange(event: CKEditor4.EventInfo) {
    this.updateDesc = event.editor.getData();
  }

  rightOption(option: any){
    this.selectedOption = option
  }

  async getQuestion() {
    await this.commonservice.get('question/').subscribe((res) => {
      const apiResult = JSON.parse(JSON.stringify(res));
      this.questions = apiResult && apiResult.payload;
    })
  }

  async onSubmit(formData: any) {
    console.log("formData>>>>>>",formData)
    console.log("value::::::::", this.formGroup.value['option1']);
    console.log("value::::::::", this.formGroup.value['option2']);
    console.log("value::::::::", this.formGroup.value['option3']);
    console.log("value::::::::", this.formGroup.value['option4']);

    let rightAnswer = "";
    if(this.selectedOption == 'option1'){
      rightAnswer = this.formGroup.value['option1'];
    }else if(this.selectedOption == 'option2'){
      rightAnswer = this.formGroup.value['option2'];
    }else if(this.selectedOption == 'option3'){
      rightAnswer = this.formGroup.value['option3'];
    }else if(this.selectedOption == 'option4'){
      rightAnswer = this.formGroup.value['option4'];
    }
    console.log({
      "question": this.updateDesc,
      "options1": this.formGroup.value['option1'],
      "options2": this.formGroup.value['option2'],
      "options3": this.formGroup.value['option3'],
      "options4": this.formGroup.value['option4'],
      "rightoption": rightAnswer,
      "point": this.formGroup.value.point,
      "level": this.formGroup.value.level,
      "questiontype": this.formGroup.value.questiontype
    })

    await this.commonservice.post({
      "question": this.updateDesc,
      "options1": this.formGroup.value['option1'],
      "options2": this.formGroup.value['option2'],
      "options3": this.formGroup.value['option3'],
      "options4": this.formGroup.value['option4'],
      "rightoption": rightAnswer,
      "point": this.formGroup.value.point,
      "level": this.formGroup.value.level,
      "questiontype": this.formGroup.value.questiontype
    },'questions/add').subscribe((res) => {
      console.log("res>>>>>>>>>>>",res)
        const apiResult = JSON.parse(JSON.stringify(res));
        console.log(apiResult)
        if(apiResult && apiResult.status == "SUCCESS"){
          console.log("paylod>>>>>>>>>>>>>>>>>",apiResult.payload._id)
          this.formGroup.reset();
          this.getUserDetails = "";
          alert(apiResult.msg)
        }else{
          alert(apiResult.msg)
        }
    })
  }


  addOptions() {
    this.count++;
    if (this.count < 5) {
      const p: HTMLParagraphElement = this.renderer.createElement('p');
      p.innerHTML = `<div class="input-group">
      <div class="input-group-prepend">
        <div class="input-group-text">
        <input type="radio" formControlName="rightoption" aria-label="Radio button for following text input">
        </div>
      </div>
      <input type="text" formControlName="options" class="form-control" aria-label="Text input with radio button">
    </div>`
      this.renderer.appendChild(this.div.nativeElement, p)
    }
  }



}
