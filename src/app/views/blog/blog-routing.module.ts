import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddBlogComponent } from './add-blog/add-blog.component';
import { BlogListComponent } from './blog-list/blog-list.component';
import { EditBlogComponent } from './edit-blog/edit-blog.component';
// import { EditTopic } from '../topic/edit-topic/edit-topic.component';

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Blog'
        },
        children: [
            {
                path: 'list',
                component: BlogListComponent,
                data: {
                    title: 'Blog List'
                }
            },
            {
                path: 'edit/:id',
                component: EditBlogComponent,
                data: {
                    title: 'Edit'
                }
            },
            {
                path: 'add',
                component: AddBlogComponent,
                data: {
                    title: 'Add Blog'
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
export class BlogRoutingModule {
}
