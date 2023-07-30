import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddQuestionComponent } from './add-question/add-question.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Question'
    },
    children: [
      {
        path: 'add',
        component: AddQuestionComponent,
        data: {
          title: 'Add Question'
        }
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class QuestionRoutingModule {
}
