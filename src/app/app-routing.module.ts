import { NgModule } from '@angular/core';
import { RouterModule, Routes, Route } from '@angular/router';

import { HDComponent } from './hd.component';

const appRoutes: Routes = [
  { path: '', pathMatch: 'full', component: HDComponent },
  { path: 'info',
    loadChildren: 'app/featured-components/featured-components.module#FeaturedComponentsModule',
  },
  { path: '**', redirectTo: '/' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      // { enableTracing: true } // debugging purpose only
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
