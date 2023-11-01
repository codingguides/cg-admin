import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddQuestionComponent } from './add-question/add-question.component';
import { QuestionListComponent } from './question-list/question-list.component';
import { EditQuestionComponent } from './edit-question/edit-question.component';
import { EditTopic } from '../topic/edit-topic/edit-topic.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Question'
    },
    children: [
      {
        path: 'list',
        component: QuestionListComponent,
        pathMatch: 'full',
        data: {
          title: 'Question List'
        }
      },
      {
        path: 'edit/:id',
        component: EditQuestionComponent,
        pathMatch: 'full',
        data: {
          title: 'Edit'
        }
      },
      {
        path: 'add',
        component: AddQuestionComponent,
        pathMatch: 'full',
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
