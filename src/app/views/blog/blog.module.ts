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
    SharedModule,
    PaginationModule,

} from '@coreui/angular';

import { BlogRoutingModule } from './blog-routing.module';
import { AddBlogComponent } from './add-blog/add-blog.component';
import { BlogListComponent } from './blog-list/blog-list.component';
import { CKEditorModule } from 'ckeditor4-angular';
import { EditBlogComponent } from './edit-blog/edit-blog.component';


@NgModule({
    declarations: [
        AddBlogComponent,
        BlogListComponent,
        EditBlogComponent
    ],
    imports: [
        CommonModule,
        BlogRoutingModule,
        PaginationModule,
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
export class BlogModule {
}