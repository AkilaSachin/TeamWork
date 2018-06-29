
import { RouterModule, Route } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { NotFoundComponent } from './views/errors/not-found/not-found.component';
import { Dashboard1Component } from './views/dashboards/dashboard1/dashboard1.component';
import { ProjectsComponent } from './projects/projects.component';


const routes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboards' },
  { path: 'dashboards', component: Dashboard1Component },
  { path: 'projects', component: ProjectsComponent },
  { path: '**', component: NotFoundComponent },

];

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(routes);
