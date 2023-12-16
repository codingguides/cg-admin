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
    SharedModule,
    PaginationModule
} from '@coreui/angular';

import { NewsletterRoutingModule } from './newsletter-routing.module';
import { NewsletterListComponent } from './newsletter-list/newsletter-list.component';
import { CKEditorModule } from 'ckeditor4-angular';


@NgModule({
    declarations: [
        NewsletterListComponent,
    ],
    imports: [
        CommonModule,
        NewsletterRoutingModule,
        NgxPaginationModule,
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
export class NewsletterModule {
}