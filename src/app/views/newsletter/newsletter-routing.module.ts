import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewsletterListComponent } from './newsletter-list/newsletter-list.component';

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Newsletter'
        },
        children: [
            {
                path: 'list',
                component: NewsletterListComponent,
                data: {
                    title: 'Newsletter List'
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
export class NewsletterRoutingModule {
}
