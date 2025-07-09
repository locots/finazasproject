export interface Asociacion {
  id: number;
  nombre: string;
  distritos: Distrito[];
}

export interface Distrito {
  id: number;
  nombre: string;
  cantidadIglesias: number;
  cantidadMiembros: number;
  diezmoMensual: number;
  ofrendaMensual: number;
  iglesias?: Iglesia[];
}

export interface Iglesia {
  id: number;
  nombre: string;
  direccion: string;
  distritoId: number;
  cantidadMiembros: number;
  pastor?: Pastor;
  diezmoSemanal?: number[];
  ofrendaSemanal?: number[];
}

export interface Pastor {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  iglesiaId: number;
  distritoId: number;
  fechaInicio: Date;
}

export interface Miembro {
  id: number;
  nombre: string;
  apellido: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  iglesiaId: number;
  fechaRegistro: Date;
  activo: boolean;
}

export interface Diezmo {
  id: number;
  miembroId: number;
  monto: number;
  fecha: Date;
  iglesiaId: number;
  procesado: boolean;
}

export interface Ofrenda {
  id: number;
  iglesiaId: number;
  monto: number;
  fecha: Date;
  descripcion?: string;
  procesado: boolean;
}