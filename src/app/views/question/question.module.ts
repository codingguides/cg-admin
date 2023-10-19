import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

import {
  ButtonGroupModule,
  ButtonModule,
  CardModule,
  DropdownModule,
  FormModule,
  GridModule,
  ListGroupModule,
  AccordionModule,
  NavModule,
  TabsModule,
  PaginationModule,
  SharedModule
} from '@coreui/angular';

import { QuestionRoutingModule } from './question-routing.module';
import { AddQuestionComponent } from './add-question/add-question.component';
import { QuestionListComponent } from './question-list/question-list.component';
import { CKEditorModule } from 'ckeditor4-angular';
import { EditQuestionComponent } from './edit-question/edit-question.component';
import { BlogRelationComponent } from './blog-relation/blog-relation.component';

@NgModule({
  declarations: [
    AddQuestionComponent,
    QuestionListComponent,
    EditQuestionComponent,
    BlogRelationComponent
  ],
  imports: [
    CommonModule,
    QuestionRoutingModule,
    NgxPaginationModule,
    PaginationModule,
    AccordionModule,
    NavModule,
    TabsModule,
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