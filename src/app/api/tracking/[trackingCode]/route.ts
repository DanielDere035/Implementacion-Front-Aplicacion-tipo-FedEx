import { NextRequest, NextResponse } from "next/server";
import type { TrackingResponse, LogisticEvent } from "@/types/logistics";

// ─────────────────────────────────────────────────────────────────────────────
// Mock: GET /api/tracking/[trackingCode]
// Devuelve SIEMPRE un array de LogisticEvent[].
// El frontend itera este array para pintar la línea de tiempo dinámica.
// ─────────────────────────────────────────────────────────────────────────────

function getMockEvents(trackingCode: string): LogisticEvent[] {
  // Usamos el tracking code para determinar el escenario mock
  const code = trackingCode.toUpperCase();

  const baseDate = new Date("2026-04-12T08:30:00Z");

  const hoursLater = (h: number) =>
    new Date(baseDate.getTime() + h * 3_600_000).toISOString();

  // Escenarios según el código (útil para demos)
  if (code.includes("DEL") || code.includes("ENT")) {
    // Envío ENTREGADO (todos los eventos completos)
    return [
      {
        tipo_evento: "REGISTERED",
        fecha_evento: baseDate.toISOString(),
        ubicacion: "Bogotá, Colombia",
        observaciones: "Envío registrado por el remitente. Paquete procesado en la sucursal de origen.",
      },
      {
        tipo_evento: "AT_ORIGIN_HUB",
        fecha_evento: hoursLater(14),
        ubicacion: "Centro Logístico Bogotá, Colombia",
        observaciones: "Paquete recibido y clasificado en el centro logístico de origen. Listo para despacho.",
      },
      {
        tipo_evento: "IN_TRANSIT",
        fecha_evento: hoursLater(20),
        ubicacion: "Autopista Bogotá-Medellín, Colombia",
        observaciones: "Vehículo de carga en ruta hacia el hub de destino. Sin novedades.",
      },
      {
        tipo_evento: "OUT_FOR_DELIVERY",
        fecha_evento: hoursLater(38),
        ubicacion: "Medellín, Colombia",
        observaciones: "Paquete en ruta de reparto final. El mensajero lo entregará hoy.",
      },
      {
        tipo_evento: "DELIVERED",
        fecha_evento: hoursLater(42),
        ubicacion: "Dirección del destinatario, Medellín",
        observaciones: "Paquete entregado exitosamente. Recibido por María Rodríguez.",
      },
    ];
  }

  if (code.includes("RET") || code.includes("DEL") || code.includes("DEF")) {
    // Envío RETRASADO
    return [
      {
        tipo_evento: "REGISTERED",
        fecha_evento: baseDate.toISOString(),
        ubicacion: "Bucaramanga, Colombia",
        observaciones: "Envío registrado por el remitente.",
      },
      {
        tipo_evento: "AT_ORIGIN_HUB",
        fecha_evento: hoursLater(8),
        ubicacion: "Centro Logístico Bucaramanga, Colombia",
        observaciones: "Paquete recibido en centro de origen.",
      },
      {
        tipo_evento: "DELAYED",
        fecha_evento: hoursLater(24),
        ubicacion: "Centro Logístico Bucaramanga, Colombia",
        observaciones: "Retraso por condiciones climáticas adversas en la vía principal. Se estima una demora de 24h.",
      },
    ];
  }

  // Default: EN TRÁNSITO (escenario más común para demo)
  return [
    {
      tipo_evento: "REGISTERED",
      fecha_evento: baseDate.toISOString(),
      ubicacion: "Bogotá, Colombia",
      observaciones: "Envío registrado por el remitente. Paquete procesado en sucursal de origen.",
    },
    {
      tipo_evento: "AT_ORIGIN_HUB",
      fecha_evento: hoursLater(14),
      ubicacion: "Centro de Distribución Bogotá Norte, Colombia",
      observaciones: "Paquete recibido y clasificado en el hub logístico principal. Verificación de dimensiones completada.",
    },
    {
      tipo_evento: "IN_TRANSIT",
      fecha_evento: hoursLater(22),
      ubicacion: "Autopista Bogotá-Medellín, Colombia",
      observaciones: "Vehículo de carga en ruta hacia el destino final. Sin novedades operativas.",
    },
    {
      tipo_evento: "PENDING_DELIVERY",
      fecha_evento: "",
      ubicacion: "",
      observaciones: "Pendiente de entrega al destinatario.",
    },
  ];
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ trackingCode: string }> }
) {
  // Simular latencia de red
  await new Promise((r) => setTimeout(r, 400));

  const { trackingCode } = await params;

  if (!trackingCode || trackingCode.length < 3) {
    return NextResponse.json(
      { error: "Código de rastreo inválido" },
      { status: 400 }
    );
  }

  const eventos = getMockEvents(trackingCode);

  // Determinar el estado actual basado en el último evento completado
  const completedEvents = eventos.filter((e) => e.fecha_evento !== "");
  const lastEvent = completedEvents[completedEvents.length - 1];

  const estadoMap: Record<string, string> = {
    REGISTERED: "Registrado",
    AT_ORIGIN_HUB: "En Centro de Origen",
    IN_TRANSIT: "En Tránsito",
    OUT_FOR_DELIVERY: "En Reparto",
    DELIVERED: "Entregado",
    DELAYED: "Retrasado",
    PENDING_DELIVERY: "Pendiente",
  };

  const response: TrackingResponse = {
    trackingCode,
    estadoActual: estadoMap[lastEvent.tipo_evento] ?? "En Proceso",
    remitente: {
      nombre: "Tech Solutions S.A.",
      direccion: "Av. Tecnológico 405, Parque Industrial, Bogotá",
    },
    destinatario: {
      nombre: "María Rodríguez",
      direccion: "Calle Ficticia 123, Apto 4B, Medellín",
    },
    paquete: {
      idPaquete: 48291,   // Long simulado
      peso: 4.5,
      largo: 30,
      ancho: 20,
      alto: 15,
    },
    tipoServicio: "standard",
    fechaEstimadaEntrega: "2026-04-18T17:00:00Z",
    eventos,
  };

  return NextResponse.json(response, { status: 200 });
}
