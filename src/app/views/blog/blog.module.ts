import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
// import { NgToastModule } from 'ng-angular-popup'



import {
    ButtonGroupModule,
    ButtonModule,
    CardModule,
    DropdownModule,
    FormModule,
    GridModule,
    ListGroupModule,
    SharedModule,

} from '@coreui/angular';

import { BlogRoutingModule } from './blog-routing.module';
import { AddBlogComponent } from './add-blog/add-blog.component';
import { BlogListComponent } from './blog-list/blog-list.component';
import { CKEditorModule } from 'ckeditor4-angular';
import { EditBlogComponent } from './edit-blog/edit-blog.component';
// import { PaginationModule } from '@coreui/angular';


@NgModule({
    declarations: [
        AddBlogComponent,
        BlogListComponent,
        EditBlogComponent
    ],
    imports: [
        CommonModule,
        BlogRoutingModule,
        // PaginationModule,
        NgxPaginationModule,
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
        // NgToastModule
    ]
})
export class BlogModule {
}