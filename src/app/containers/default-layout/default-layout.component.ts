import { Component } from '@angular/core';

import { navItems } from './_nav';
import { HttpCallService } from 'src/app/common/http-call.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
})
export class DefaultLayoutComponent {

  public navItems = navItems;

  constructor(common: HttpCallService) {
    common.isLoggedIn();
  }
}
