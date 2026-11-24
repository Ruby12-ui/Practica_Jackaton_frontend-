import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IncidenciaService } from '../../services/incidencia.service';

@Component({
  selector: 'app-incidencia-detail',
  imports: [RouterLink, DatePipe],
  templateUrl: './incidencia-detail.html',
  styleUrl: './incidencia-detail.scss',
})
export class IncidenciaDetail {
  private service = inject(IncidenciaService);
  private router = inject(Router);

  incidencia = this.service.obtenerPorCodigo(
    inject(ActivatedRoute).snapshot.paramMap.get('codigo') ?? ''
  );

  constructor() {
    if (!this.incidencia) this.router.navigate(['/']);
  }

  claseEstado(e: string): string {
    return 'e-' + e.toLowerCase().replace(' ', '-');
  }
}