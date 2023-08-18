import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InterviewListComponent } from './interview-list/interview-list.component';
import { AddInterviewComponent } from './add-interview/add-interview.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Interview'
    },
    children: [
      {
        path: 'list',
        component: InterviewListComponent,
        data: {
          title: 'Interview List'
        }
      },
      {
        path: 'add',
        component: AddInterviewComponent,
        data: {
          title: 'Add Interview'
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
export class InterviewRoutingModule {
}
