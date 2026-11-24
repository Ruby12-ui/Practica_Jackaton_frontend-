import { Injectable, signal } from '@angular/core';

export interface ToastMsg {
  id: number;
  texto: string;
  tipo: 'ok' | 'error' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private contador = 0;
  readonly toasts = signal<ToastMsg[]>([]);

  mostrar(texto: string, tipo: ToastMsg['tipo'] = 'ok'): void {
    const id = ++this.contador;
    this.toasts.update(lista => [...lista, { id, texto, tipo }]);
    setTimeout(() => this.cerrar(id), 3000);
  }

  cerrar(id: number): void {
    this.toasts.update(lista => lista.filter(t => t.id !== id));
  }
}