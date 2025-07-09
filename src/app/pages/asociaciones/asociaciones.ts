import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../shared/sidebar/sidebar';
import { DataService } from '../../shared/services/data.service';
import { Asociacion } from '../../shared/models/asociacion.model';
import { FormsModule } from '@angular/forms'; // <--- AGREGA ESTA LÍNEA

@Component({
  selector: 'app-asociaciones',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, FormsModule], // <--- AGREGA FormsModule AQUÍ
  templateUrl: './asociaciones.html',
  styleUrl: './asociaciones.css'
})
export class Asociaciones implements OnInit {
  asociaciones: Asociacion[] = [];
  totalIglesias: number = 0;
  totalMiembros: number = 0;

  // Modal y edición
  showModal = false;
  editMode = false;
  modalAsociacion: any = {};
  editIndex: number | null = null;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.cargarAsociaciones();
  }

  cargarAsociaciones() {
    this.dataService.getAsociaciones().subscribe(data => {
      this.asociaciones = data;
      this.calcularTotales();
    });
  }

  calcularTotales() {
    this.totalIglesias = this.asociaciones.reduce((sum, asoc) =>
      sum + asoc.distritos.reduce((sum2, dist) => sum2 + dist.cantidadIglesias, 0), 0);

    this.totalMiembros = this.asociaciones.reduce((sum, asoc) =>
      sum + asoc.distritos.reduce((sum2, dist) => sum2 + dist.cantidadMiembros, 0), 0);
  }

  // Nuevos métodos para usar en la plantilla
  getIglesiasCount(asociacion: Asociacion): number {
    return asociacion.distritos.reduce((sum, dist) => sum + dist.cantidadIglesias, 0);
  }

  getMiembrosCount(asociacion: Asociacion): number {
    return asociacion.distritos.reduce((sum, dist) => sum + dist.cantidadMiembros, 0);
  }

  // Métodos adicionales para diezmos y ofrendas
  // Métodos adicionales para diezmos y ofrendas
  getDiezmoMensual(asociacion: Asociacion): number {
    return asociacion.distritos.reduce((sum, dist) => sum + dist.diezmoMensual, 0);
  }

  getOfrendaMensual(asociacion: Asociacion): number {
    return asociacion.distritos.reduce((sum, dist) => sum + dist.ofrendaMensual, 0);
  }

  // Métodos para el modal y acciones CRUD
  openAddModal() {
    this.editMode = false;
    this.modalAsociacion = {
      nombre: '',
      distritos: '',
      diezmoMensual: 0,
      ofrendaMensual: 0
    };
    this.showModal = true;
    this.editIndex = null;
  }

  openEditModal(asociacion: any, index: number) {
    this.editMode = true;
    this.modalAsociacion = {
      ...asociacion,
      distritos: asociacion.distritos?.map((d: any) => d.nombre).join(', ') || ''
    };
    this.showModal = true;
    this.editIndex = index;
  }

  closeModal() {
    this.showModal = false;
    this.editIndex = null;
  }

  saveAsociacion() {
    // Procesar distritos como array de objetos simples
    const distritosArr = (this.modalAsociacion.distritos || '')
      .split(',')
      .map((nombre: string) => ({
        nombre: nombre.trim(),
        cantidadIglesias: 0,
        cantidadMiembros: 0,
        diezmoMensual: this.modalAsociacion.diezmoMensual || 0,
        ofrendaMensual: this.modalAsociacion.ofrendaMensual || 0
      }))
      .filter((d: any) => d.nombre);

    const nuevaAsociacion = {
      ...this.modalAsociacion,
      distritos: distritosArr
    };

    if (this.editMode && this.editIndex !== null) {
      this.asociaciones[this.editIndex] = nuevaAsociacion;
    } else {
      this.asociaciones.push(nuevaAsociacion);
    }
    this.calcularTotales();
    this.closeModal();
  }

  deleteAsociacion(index: number) {
    if (window.confirm('¿Seguro que deseas eliminar esta asociación?')) {
      this.asociaciones.splice(index, 1);
      this.calcularTotales();
    }
  }
}