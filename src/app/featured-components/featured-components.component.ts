import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { fadeInAnimation, fadeAnimation } from '../utils/animations';

@Component({
  selector: 'app-featured-components',
  templateUrl: './featured-components.component.html',
  styleUrls: ['./featured-components.component.scss'],
  animations: [fadeAnimation],
  encapsulation: ViewEncapsulation.None,

})
export class FeaturedComponentsComponent implements OnInit {

  ngOnInit() { }

  getRouterOutletState(outlet: RouterOutlet) {
    return {
      value: outlet.isActivated ? outlet.activatedRoute.snapshot.url.toString() : '',
      params: { transition_duration: '.3s' }
    };
  }
}
