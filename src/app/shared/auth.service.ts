import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  codigoPostal?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  
  constructor(private router: Router) {
    // Intentar recuperar el usuario del localStorage al iniciar
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser ? JSON.parse(storedUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }
  
  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }
  
  public isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }
  
  login(email: string, password: string): boolean {
    // Verificar las credenciales específicas para el sistema financiero
    if (email === 'adminupn@upn.pe' && password === 'admin12345') {
      const user: User = {
        id: 1,
        nombre: 'Administrador',
        apellido: 'Sistema',
        email: email,
        rol: 'admin',
        telefono: '',
        direccion: '',
        ciudad: '',
        codigoPostal: ''
      };
      
      // Guardar en localStorage y actualizar el BehaviorSubject
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      return true;
    }
    
    return false;
  }
  
  logout(): void {
    // Eliminar usuario del localStorage
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
  
  updateUserProfile(userData: Partial<User>): boolean {
    if (!this.currentUserValue) return false;
    
    // Actualizar solo los campos proporcionados
    const updatedUser: User = {
      ...this.currentUserValue,
      ...userData
    };
    
    // Guardar en localStorage y actualizar el BehaviorSubject
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    this.currentUserSubject.next(updatedUser);
    return true;
  }
}