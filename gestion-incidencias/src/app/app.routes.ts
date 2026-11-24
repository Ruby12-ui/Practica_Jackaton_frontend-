import { Routes } from '@angular/router';
import { IncidenciaList } from './components/incidencia-list/incidencia-list';
import { IncidenciaForm } from './components/incidencia-form/incidencia-form';
import { IncidenciaDetail } from './components/incidencia-detail/incidencia-detail';

export const routes: Routes = [
  { path: '', component: IncidenciaList },
  { path: 'nueva', component: IncidenciaForm },
  { path: 'editar/:codigo', component: IncidenciaForm },
  { path: 'detalle/:codigo', component: IncidenciaDetail },
  { path: '**', redirectTo: '' },
];