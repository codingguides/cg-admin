import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  ButtonGroupModule,
  ButtonModule,
  CardModule,
  DropdownModule,
  FormModule,
  GridModule,
  ListGroupModule,
  SharedModule
} from '@coreui/angular';

import { QuestionRoutingModule } from './question-routing.module';
import { AddQuestionComponent } from './add-question/add-question.component';
import { CKEditorModule } from 'ckeditor4-angular';

@NgModule({
  declarations: [
    AddQuestionComponent
  ],
  imports: [
    CommonModule,
    QuestionRoutingModule,
    CardModule,
    FormModule,
    GridModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule,
    FormModule,
    ButtonModule,
    ButtonGroupModule,
    DropdownModule,
    SharedModule,
    ListGroupModule
  ]
})
export class QuestionModule {
}