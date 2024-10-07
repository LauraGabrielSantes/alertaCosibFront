export enum TipoAlerta {
  MEDICA = 'Medica',
  SEGURIDAD = 'Seguridad',
  VIOLENCIA = 'Violencia de género',
  OTRA = 'Otra',
}
export enum EnviarTipo {
  FOTOGRAFIA,
  UBICACION,
  MAS_INFORMACION,
}
export interface Enviado {
  tipo: EnviarTipo;
  foto?: string;
  lugar?: string;
  ubicacionEspecificacion?: string;
  informacion?: string;
}

export enum StatusAlerta {
  ACTIVA = 'Activa',
  CANCELADA = 'Cancelada',
  ENVIADA = 'Enviada',
  RECHAZADA = 'Rechazada',
  terminadaPorTiempo = 'Terminada por tiempo',
}
export interface MessageModal {
  title: string;
  message: string;
}

export const Lugares = [
  'Edificio A - Rectoría',
  'Edificio AA - Cómputo',
  'Edificio B - Coordinación de Sistemas Escolares',
  "Edificio B - Teatro 'Fuego Nuevo'",
  'Edificio B - Aulas',
  "Edificio C - Salón 'Verde'",
  "Edificio C - Auditorio 'Cecoaatecalli'",
  "Edificio C - Auditorio 'Omecoatecalli'",
  'Edificio C - Aulas',
  'Edificio D - Coordinación de Enseñanza de Lenguas Extranjeras CELEX',
  'Edificio D - Impresiones',
  'Edificio D - Aulas',
  "Edificio E - Auditorio 'Sandoval Vallarta'",
  'Edificio E - Aulas',
  'Edificio F - Ciencias Sociales y Humanidades (CSH)',
  'Edificio G - Galería de Arte (Iztapalapa)',
  "Edificio G - Sala 'Cuicacalli'",
  'Edificio G - Recursos Humanos',
  'Edificio H - Ciencias Sociales y Humanidades (CSH)',
  'Edificio AH - Anexo (CSH)',
  'Edificio I - Laboratorio Central',
  'Edificio I - Laboratorio de Supercómputo y de Visualización en Paralelo',
  "Edificio AI - Anexo 'I' Imagenología",
  'Edificio L - Biblioteca',
  'Edificio L - Librería',
  'Edificio M - Actividades Deportivas',
  'Edificio M - Cafetería',
  'Edificio M - Servicios Médicos',
  'Edificio M - Actividades Culturales',
  'Edificio Ñ - Almacén',
  'Edificio Ñ - Proveeduría',
  'Edificio O - Bodega o Galerón',
  'Edificio P - Centro de Posgrado',
  'Edificio P - Coordinación de Extensión Universitaria',
  'Edificio Q - Coordinación de Recursos Materiales',
  'Edificio Q1 - Coordinación de Servicios Generales',
  'Edificio Q2 - Almacén de Reactivos y Equipo',
  'Edificio Q3 - Vigilancia y Jardinería',
  'Edificio Q4 - Bodegas de Equipo de Campo',
  'Edificio PP1 - Biotecnología',
  'Edificio PP2 - Ingeniería Química',
  'Edificio PP3 - Invernadero',
  'Edificio PP4 - Fermentaciones',
  'Edificio PP5 - Invernadero',
  'Edificio PP6 - Taller de Cerámica',
  'Edificio PP7 - Bioterio',
  'Edificio PP8 - Planta Acuícola',
  'Edificio R - Laboratorios',
  'Edificio S - Ciencias Biológicas y de la Salud',
  'Edificio AS - Anexo CBS',
  'Edificio T - Ciencias Básicas e Ingenierías',
  'Edificio AT - Anexo CBI',
  'Edificio U - Laboratorios',
  'Edificio W - Laboratorios C.B.I. y C.B.S. CENICA',
  'Edificio CY - Edificio de Ciencia y Tecnología',
  'Kiosco',
  'Squash',
  'Zona Deportiva',
  'Estacionamiento alado de zona deportiva',
  'UAMI Bus',
  'Caseta 1',
  'Caseta 2',
  'Caseta 3',
  'Caseta 4',
  'Caseta 5',
  'Caseta 6',
  'Explanda',
  'Estacionamiento',
];
