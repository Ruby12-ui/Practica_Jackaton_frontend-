import { Injectable, signal } from '@angular/core';
import { Incidencia } from '../models/incidencia.model';

const STORAGE_KEY = 'incidencias';

@Injectable({ providedIn: 'root' })
export class IncidenciaService {
  private _incidencias = signal<Incidencia[]>(this.cargar());
  readonly incidencias = this._incidencias.asReadonly();

  private cargar(): Incidencia[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch {}
    return this.datosIniciales();
  }

  private guardar(lista: Incidencia[]): void {
    this._incidencias.set(lista);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
    } catch {}
  }

  private datosIniciales(): Incidencia[] {
    return [
      {
        codigo: 'INC-001',
        titulo: 'Falla de red Lab 04',
        descripcion: 'Sin conectividad en las PCs del laboratorio 04.',
        responsable: 'Carlos Ruiz',
        prioridad: 'Alta',
        estado: 'En proceso',
        fecha: '2026-11-23',
      },
      {
        codigo: 'INC-002',
        titulo: 'Error acceso portal',
        descripcion: 'Los usuarios no pueden iniciar sesión en el portal.',
        responsable: 'Ana Torres',
        prioridad: 'Media',
        estado: 'Pendiente',
        fecha: '2026-11-23',
      },
      {
        codigo: 'INC-003',
        titulo: 'Actualización Office',
        descripcion: 'Actualizar Office en las computadoras de administración.',
        responsable: 'Luis Vega',
        prioridad: 'Baja',
        estado: 'Resuelta',
        fecha: '2026-11-22',
      },
    ];
  }

  private generarCodigo(): string {
    const numeros = this._incidencias().map(i => parseInt(i.codigo.split('-')[1], 10));
    const siguiente = (numeros.length ? Math.max(...numeros) : 0) + 1;
    return `INC-${String(siguiente).padStart(3, '0')}`;
  }

  obtenerPorCodigo(codigo: string): Incidencia | undefined {
    return this._incidencias().find(i => i.codigo === codigo);
  }

  crear(datos: Omit<Incidencia, 'codigo' | 'fecha'>): Incidencia {
    const nueva: Incidencia = {
      ...datos,
      codigo: this.generarCodigo(),
      fecha: new Date().toISOString().slice(0, 10),
    };
    this.guardar([...this._incidencias(), nueva]);
    return nueva;
  }

  actualizar(codigo: string, cambios: Partial<Omit<Incidencia, 'codigo' | 'fecha'>>): void {
    this.guardar(
      this._incidencias().map(i => (i.codigo === codigo ? { ...i, ...cambios } : i))
    );
  }

  eliminar(codigo: string): void {
    this.guardar(this._incidencias().filter(i => i.codigo !== codigo));
  }
}