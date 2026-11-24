import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IncidenciaService } from '../../services/incidencia.service';
import { ToastService } from '../../services/toast.service';
import { Incidencia } from '../../models/incidencia.model';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';

type Columna = 'codigo' | 'titulo' | 'prioridad' | 'estado' | 'fecha';

const PESO_PRIORIDAD: Record<Incidencia['prioridad'], number> = {
  Alta: 3,
  Media: 2,
  Baja: 1,
};

@Component({
  selector: 'app-incidencia-list',
  imports: [FormsModule, RouterLink, DatePipe, ConfirmDialog],
  templateUrl: './incidencia-list.html',
  styleUrl: './incidencia-list.scss',
})
export class IncidenciaList {
  private service = inject(IncidenciaService);
  private toast = inject(ToastService);

  readonly porPagina = 5;

  busqueda = signal('');
  prioridad = signal('');
  estado = signal('');
  columna = signal<Columna>('codigo');
  direccion = signal<'asc' | 'desc'>('asc');
  pagina = signal(1);
  porEliminar = signal<Incidencia | null>(null);

  stats = computed(() => {
    const l = this.service.incidencias();
    return {
      total: l.length,
      pendientes: l.filter(i => i.estado === 'Pendiente').length,
      proceso: l.filter(i => i.estado === 'En proceso').length,
      resueltas: l.filter(i => i.estado === 'Resuelta').length,
      alta: l.filter(i => i.prioridad === 'Alta' && i.estado !== 'Resuelta').length,
    };
  });

  filtradas = computed(() => {
    const texto = this.busqueda().trim().toLowerCase();
    return this.service.incidencias().filter(i =>
      i.titulo.toLowerCase().includes(texto) &&
      (!this.prioridad() || i.prioridad === this.prioridad()) &&
      (!this.estado() || i.estado === this.estado())
    );
  });

  ordenadas = computed(() => {
    const col = this.columna();
    const dir = this.direccion() === 'asc' ? 1 : -1;
    return [...this.filtradas()].sort((a, b) => {
      if (col === 'prioridad') {
        return (PESO_PRIORIDAD[a.prioridad] - PESO_PRIORIDAD[b.prioridad]) * dir;
      }
      return a[col].localeCompare(b[col], 'es', { numeric: true }) * dir;
    });
  });

  totalPaginas = computed(() =>
    Math.max(1, Math.ceil(this.ordenadas().length / this.porPagina))
  );

  paginaActual = computed(() => Math.min(this.pagina(), this.totalPaginas()));

  visibles = computed(() => {
    const inicio = (this.paginaActual() - 1) * this.porPagina;
    return this.ordenadas().slice(inicio, inicio + this.porPagina);
  });

  hayFiltros = computed(
    () => !!(this.busqueda() || this.prioridad() || this.estado())
  );

  setBusqueda(v: string) { this.busqueda.set(v); this.pagina.set(1); }
  setPrioridad(v: string) { this.prioridad.set(v); this.pagina.set(1); }
  setEstado(v: string) { this.estado.set(v); this.pagina.set(1); }

  filtrarEstado(e: string) {
    this.prioridad.set('');
    this.busqueda.set('');
    this.estado.set(e);
    this.pagina.set(1);
  }

  filtrarAlta() {
    this.busqueda.set('');
    this.estado.set('');
    this.prioridad.set('Alta');
    this.pagina.set(1);
  }

  limpiarFiltros() {
    this.busqueda.set('');
    this.prioridad.set('');
    this.estado.set('');
    this.pagina.set(1);
  }

  ordenar(col: Columna) {
    if (this.columna() === col) {
      this.direccion.update(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      this.columna.set(col);
      this.direccion.set('asc');
    }
  }

  flecha(col: Columna): string {
    if (this.columna() !== col) return '';
    return this.direccion() === 'asc' ? '▲' : '▼';
  }

  irA(p: number) {
    this.pagina.set(Math.max(1, Math.min(p, this.totalPaginas())));
  }

  claseEstado(e: string): string {
    return 'e-' + e.toLowerCase().replace(' ', '-');
  }

  cambiarEstado(i: Incidencia, nuevo: string) {
    this.service.actualizar(i.codigo, { estado: nuevo as Incidencia['estado'] });
    this.toast.mostrar(`${i.codigo} ahora está "${nuevo}"`, 'info');
  }

  pedirEliminar(i: Incidencia) {
    this.porEliminar.set(i);
  }

  confirmarEliminar() {
    const i = this.porEliminar();
    if (i) {
      this.service.eliminar(i.codigo);
      this.toast.mostrar(`${i.codigo} eliminada`, 'error');
    }
    this.porEliminar.set(null);
  }

  exportarCSV() {
    const filas = this.ordenadas();
    if (!filas.length) {
      this.toast.mostrar('No hay datos para exportar', 'error');
      return;
    }
    const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const encabezado = ['Código', 'Título', 'Descripción', 'Responsable', 'Prioridad', 'Estado', 'Fecha'];
    const lineas = filas.map(i =>
      [i.codigo, i.titulo, i.descripcion, i.responsable, i.prioridad, i.estado, i.fecha]
        .map(esc)
        .join(',')
    );
    const csv = '\ufeff' + [encabezado.join(','), ...lineas].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'incidencias.csv';
    a.click();
    URL.revokeObjectURL(url);
    this.toast.mostrar(`${filas.length} incidencia(s) exportadas`);
  }
}