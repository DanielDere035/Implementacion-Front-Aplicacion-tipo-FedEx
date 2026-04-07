// ─────────────────────────────────────────────────────────────────────────────
// Tipos de dominio alineados con la arquitectura del backend real.
// NOTA DE TIPOS:
//   - senderId, trackingCode, id de personas → string (UUID en Java)
//   - idPaquete → number (Long en Java)
// ─────────────────────────────────────────────────────────────────────────────

/** Evento logístico que devuelve GET /api/tracking/:trackingCode */
export interface LogisticEvent {
  tipo_evento: string;
  fecha_evento: string; // ISO 8601, ej. "2026-04-12T08:30:00Z"
  ubicacion: string;
  observaciones: string;
}

/** Detalles del paquete físico. idPaquete es un Long en Java → number en TS */
export interface PackageDetails {
  idPaquete: number;
  peso: number;    // kg, siempre positivo
  largo: number;   // cm, siempre positivo
  ancho: number;   // cm, siempre positivo
  alto: number;    // cm, siempre positivo
}

/** Persona (remitente o destinatario). id es UUID → string en TS */
export interface Person {
  id: string;               // UUID
  nombre: string;           // max 50 chars
  telefono: string;         // max 20 chars
  correoElectronico: string; // max 50 chars, formato email válido
  direccion: string;        // max 500 chars
  referencias?: string;     // max 500 chars, opcional
}

/** Payload que envía el frontend a POST /api/shipments */
export interface CreateShipmentPayload {
  remitente: Omit<Person, "id">;
  destinatario: Omit<Person, "id">;
  paquete: Omit<PackageDetails, "idPaquete">;
  tipoServicio: "standard" | "express" | "overnight";
}

/** Respuesta que devuelve POST /api/shipments */
export interface ShipmentResponse {
  trackingCode: string;        // String, no número. Ej: "TRK-A1B2C3D4"
  remitente: Person;
  destinatario: Person;
  paquete: PackageDetails;
  tipoServicio: string;
  fechaCreacion: string;       // ISO 8601
}

/** Respuesta que devuelve GET /api/tracking/:trackingCode */
export interface TrackingResponse {
  trackingCode: string;
  estadoActual: string;
  remitente: Pick<Person, "nombre" | "direccion">;
  destinatario: Pick<Person, "nombre" | "direccion">;
  paquete: PackageDetails;
  tipoServicio: string;
  fechaEstimadaEntrega: string;
  eventos: LogisticEvent[];    // Siempre un array, nunca null
}
