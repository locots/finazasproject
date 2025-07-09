import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../shared/sidebar/sidebar';
import { DataService } from '../../shared/services/data.service';
import { Miembro, Iglesia } from '../../shared/models/asociacion.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-miembros',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, FormsModule],
  templateUrl: './miembros.html',
  styleUrl: './miembros.css'
})
export class Miembros implements OnInit {
  miembros: any[] = [];
  totalMiembros: number = 0;
  iglesias: Map<number, string> = new Map();
  
  // Variables para paginación
  currentPage: number = 1;
  itemsPerPage: number = 20;
  totalPages: number = 1;

  // Modal y edición
  showModal = false;
  editMode = false;
  modalMiembro: any = {};
  editIndex: number | null = null;
  
  constructor(private dataService: DataService) {}
  
  ngOnInit() {
    // Primero, obtener las iglesias para mapear los IDs a nombres
    this.dataService.getIglesias().subscribe(iglesiasData => {
      iglesiasData.forEach(iglesia => {
        this.iglesias.set(iglesia.id, iglesia.nombre);
      });
      
      // Luego, obtener los miembros
      this.dataService.getMiembros().subscribe(miembrosData => {
        // Obtener todos los miembros
        const todosLosMiembros = [...miembrosData];
        
        // Mezclar los miembros para tener variedad en cada página
        this.mezclarArray(todosLosMiembros);
        
        this.miembros = todosLosMiembros.map(miembro => {
          return {
            id: miembro.id,
            nombre: `${miembro.nombre} ${miembro.apellido}`,
            iglesia: this.iglesias.get(miembro.iglesiaId) || 'Desconocida',
            telefono: miembro.telefono || 'No disponible',
            email: miembro.email || 'No disponible'
          };
        });
        
        // Calcular el número total de páginas
        this.totalPages = Math.ceil(this.miembros.length / this.itemsPerPage);
      });
      
      // Obtener el total de miembros para mostrar en la interfaz
      this.dataService.getEstadisticasDashboard().subscribe(stats => {
        this.totalMiembros = stats.totalMiembros;
      });
    });
  }
  
  // Método para mezclar un array (algoritmo Fisher-Yates)
  private mezclarArray(array: any[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  
  // Método para generar el array de páginas a mostrar
  getPages(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;
    
    if (endPage > this.totalPages) {
      endPage = this.totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  // Métodos para el modal y acciones CRUD
  openAddModal() {
    this.editMode = false;
    this.modalMiembro = {
      nombre: '',
      iglesia: '',
      telefono: '',
      email: ''
    };
    this.showModal = true;
    this.editIndex = null;
  }

  openEditModal(miembro: any, index: number) {
    this.editMode = true;
    this.modalMiembro = { ...miembro };
    this.showModal = true;
    this.editIndex = index;
  }

  closeModal() {
    this.showModal = false;
    this.editIndex = null;
  }

  saveMiembro() {
    if (this.editMode && this.editIndex !== null) {
      this.miembros[this.editIndex] = { ...this.modalMiembro };
    } else {
      this.miembros.push({ ...this.modalMiembro });
    }
    this.totalMiembros = this.miembros.length;
    this.closeModal();
  }

  deleteMiembro(index: number) {
    if (window.confirm('¿Seguro que deseas eliminar este miembro?')) {
      this.miembros.splice(index, 1);
      this.totalMiembros = this.miembros.length;
    }
  }
}