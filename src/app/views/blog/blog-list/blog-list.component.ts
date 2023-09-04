import { Component } from '@angular/core';
import { HttpCallService } from '../../../common/http-call.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router'

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss']
})
export class BlogListComponent {
  blogs: any = [];
  errMessage: string = '';
  errFlag: boolean = true;

  constructor(
    public commonservice: HttpCallService,
    private _router: Router,
    private router: Router
  ) { }

  ngOnInit() { }
}
