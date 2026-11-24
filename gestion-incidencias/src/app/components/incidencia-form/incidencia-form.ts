import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IncidenciaService } from '../../services/incidencia.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-incidencia-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './incidencia-form.html',
  styleUrl: './incidencia-form.scss',
})
export class IncidenciaForm implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(IncidenciaService);
  private toast = inject(ToastService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  codigoEditando = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    titulo: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(80)]],
    descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
    responsable: ['', [Validators.required, Validators.minLength(3)]],
    prioridad: ['Media' as 'Alta' | 'Media' | 'Baja', Validators.required],
    estado: ['Pendiente' as 'Pendiente' | 'En proceso' | 'Resuelta', Validators.required],
  });

  ngOnInit() {
    const codigo = this.route.snapshot.paramMap.get('codigo');
    if (codigo) {
      const inc = this.service.obtenerPorCodigo(codigo);
      if (!inc) {
        this.router.navigate(['/']);
        return;
      }
      this.codigoEditando.set(codigo);
      this.form.patchValue({
        titulo: inc.titulo,
        descripcion: inc.descripcion,
        responsable: inc.responsable,
        prioridad: inc.prioridad,
        estado: inc.estado,
      });
    }
  }

  campoInvalido(nombre: string): boolean {
    const c = this.form.get(nombre);
    return !!c && c.invalid && (c.touched || c.dirty);
  }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.mostrar('Revisa los campos marcados en rojo', 'error');
      return;
    }
    const datos = this.form.getRawValue();
    const codigo = this.codigoEditando();
    if (codigo) {
      this.service.actualizar(codigo, datos);
      this.toast.mostrar(`${codigo} actualizada correctamente`);
    } else {
      const nueva = this.service.crear(datos);
      this.toast.mostrar(`${nueva.codigo} registrada correctamente`);
    }
    this.router.navigate(['/']);
  }
}