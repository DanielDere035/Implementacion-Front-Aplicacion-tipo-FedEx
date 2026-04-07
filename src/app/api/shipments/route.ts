import { NextRequest, NextResponse } from "next/server";
import type {
  CreateShipmentPayload,
  ShipmentResponse,
  LogisticEvent,
} from "@/types/logistics";

// ─────────────────────────────────────────────────────────────────────────────
// Mock: POST /api/shipments
// Simula la secuencia real del backend:
//   1. POST /api/shipments/{id}/sender
//   2. POST /api/shipments/{id}/package
// y devuelve un trackingCode UUID-like.
// ─────────────────────────────────────────────────────────────────────────────

function generateTrackingCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "TRK-";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function generateUUID(): string {
  return crypto.randomUUID();
}

export async function POST(request: NextRequest) {
  // Simular latencia de red (400–900ms)
  await new Promise((r) => setTimeout(r, 600));

  const body: CreateShipmentPayload = await request.json();

  // Validación backend-side (espejo de las anotaciones Java)
  const errors: string[] = [];

  if (!body.remitente?.nombre || body.remitente.nombre.length > 50)
    errors.push("nombre del remitente: requerido, max 50 caracteres");
  if (!body.remitente?.telefono || body.remitente.telefono.length > 20)
    errors.push("teléfono del remitente: requerido, max 20 caracteres");
  if (!body.remitente?.correoElectronico || body.remitente.correoElectronico.length > 50)
    errors.push("correo del remitente: requerido, max 50 caracteres");
  if (!body.remitente?.direccion || body.remitente.direccion.length > 500)
    errors.push("dirección del remitente: requerida, max 500 caracteres");

  if (!body.destinatario?.nombre || body.destinatario.nombre.length > 50)
    errors.push("nombre del destinatario: requerido, max 50 caracteres");
  if (!body.destinatario?.correoElectronico || body.destinatario.correoElectronico.length > 50)
    errors.push("correo del destinatario: requerido, max 50 caracteres");

  if (!body.paquete || body.paquete.peso <= 0)
    errors.push("peso: debe ser un número positivo");
  if (!body.paquete || body.paquete.largo <= 0)
    errors.push("largo: debe ser un número positivo");
  if (!body.paquete || body.paquete.ancho <= 0)
    errors.push("ancho: debe ser un número positivo");
  if (!body.paquete || body.paquete.alto <= 0)
    errors.push("alto: debe ser un número positivo");

  if (errors.length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const trackingCode = generateTrackingCode();

  // Eventos logísticos iniciales que se crean al registrar
  const eventosIniciales: LogisticEvent[] = [
    {
      tipo_evento: "REGISTERED",
      fecha_evento: new Date().toISOString(),
      ubicacion: body.remitente.direccion.split(",").pop()?.trim() ?? "Origen",
      observaciones: `Envío registrado por ${body.remitente.nombre}. Paquete: ${body.paquete.peso}kg, ${body.paquete.largo}x${body.paquete.ancho}x${body.paquete.alto}cm. Servicio: ${body.tipoServicio}.`,
    },
  ];

  const response: ShipmentResponse = {
    trackingCode,
    remitente: { id: generateUUID(), ...body.remitente },
    destinatario: { id: generateUUID(), ...body.destinatario },
    paquete: {
      idPaquete: Math.floor(Math.random() * 90000) + 10000, // Long simulado
      ...body.paquete,
    },
    tipoServicio: body.tipoServicio,
    fechaCreacion: new Date().toISOString(),
  };

  // En producción aquí irían los eventos al response también
  void eventosIniciales;

  return NextResponse.json(response, { status: 201 });
}
