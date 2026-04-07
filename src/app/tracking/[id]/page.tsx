import Link from "next/link";
import { ArrowLeft, MapPin, Package, Truck, Check, Circle, Calendar, Weight, ClockIcon, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TrackingResponse, LogisticEvent } from "@/types/logistics";

// ── Config de eventos → UI ────────────────────────────────────────────────────
const EVENT_CONFIG: Record<string, {
  label: string;
  icon: React.ElementType;
  nodeClass: string;
  isPending?: boolean;
  isActive?: boolean;
}> = {
  REGISTERED:       { label: "Registrado",           icon: Check,          nodeClass: "bg-emerald-500 text-white" },
  AT_ORIGIN_HUB:    { label: "En Centro de Origen",  icon: Check,          nodeClass: "bg-emerald-500 text-white" },
  IN_TRANSIT:       { label: "En Tránsito",           icon: Truck,          nodeClass: "bg-blue-600 text-white",   isActive: true },
  OUT_FOR_DELIVERY: { label: "En Reparto",            icon: Truck,          nodeClass: "bg-blue-600 text-white",   isActive: true },
  DELIVERED:        { label: "Entregado",             icon: Check,          nodeClass: "bg-emerald-500 text-white" },
  DELAYED:          { label: "Retrasado",             icon: AlertTriangle,  nodeClass: "bg-red-500 text-white",    isActive: true },
  PENDING_DELIVERY: { label: "Pendiente de entrega",  icon: Circle,         nodeClass: "bg-slate-100 border-2 border-slate-300 text-slate-400", isPending: true },
};

const STATUS_BADGE: Record<string, string> = {
  "Registrado":          "bg-blue-100 text-blue-800 border-blue-200",
  "En Centro de Origen": "bg-purple-100 text-purple-800 border-purple-200",
  "En Tránsito":         "bg-amber-100 text-amber-800 border-amber-200",
  "En Reparto":          "bg-orange-100 text-orange-800 border-orange-200",
  "Entregado":           "bg-emerald-100 text-emerald-800 border-emerald-200",
  "Retrasado":           "bg-red-100 text-red-800 border-red-200",
};

function formatDate(iso: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ── Timeline Event Component ──────────────────────────────────────────────────
function TimelineEvent({ event, isLast }: { event: LogisticEvent; isLast: boolean }) {
  const cfg = EVENT_CONFIG[event.tipo_evento] ?? {
    label: event.tipo_evento,
    icon: Circle,
    nodeClass: "bg-slate-200 text-slate-500",
  };
  const Icon = cfg.icon;
  const isPending = cfg.isPending || !event.fecha_evento;

  return (
    <div className={`flex gap-4 sm:gap-6 relative ${isPending ? "opacity-55" : ""}`}>
      {/* Node */}
      <div className="flex-shrink-0 mt-1 relative">
        {cfg.isActive && (
          <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20" />
        )}
        <div className={`h-9 w-9 sm:h-10 sm:w-10 rounded-full flex items-center justify-center ring-4 ring-white shadow-sm relative z-10 ${cfg.nodeClass}`}>
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
      </div>

      {/* Content */}
      <div className={`flex-1 pb-${isLast ? "0" : "2"} ${cfg.isActive ? "bg-blue-50/50 p-4 rounded-xl border border-blue-100 -mt-2" : ""}`}>
        {cfg.isActive && (
          <Badge className="mb-1.5 bg-blue-100 text-blue-700 border-none shadow-none text-xs">Actual</Badge>
        )}
        <p className={`font-semibold text-base sm:text-lg ${isPending ? "text-slate-400" : cfg.isActive ? "text-blue-900" : "text-slate-900"}`}>
          {cfg.label}
        </p>
        {event.observaciones && (
          <p className={`text-sm mt-1 ${cfg.isActive ? "text-blue-700/80" : "text-slate-500"}`}>
            {event.observaciones}
          </p>
        )}
        {event.ubicacion && (
          <p className={`text-xs mt-1.5 flex items-center gap-1 ${cfg.isActive ? "text-blue-500" : "text-slate-400"}`}>
            <MapPin className="h-3 w-3" /> {event.ubicacion}
          </p>
        )}
        {event.fecha_evento && (
          <p className={`text-xs font-medium mt-1.5 ${cfg.isActive ? "text-blue-500" : "text-slate-400"}`}>
            {formatDate(event.fecha_evento)}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Page (Server Component) ───────────────────────────────────────────────────
export default async function TrackingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch real contra la Route Handler de Next.js (o en producción contra la API real)
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/tracking/${encodeURIComponent(id)}`, {
    cache: "no-store", // Siempre datos frescos (equivalente a no-cache en producción)
  });

  // Fallback si el tracking code no existe
  if (!res.ok) {
    return (
      <div className="max-w-5xl mx-auto pb-12">
        <Link href="/" className="inline-flex items-center text-slate-500 hover:text-slate-900 text-sm font-medium mb-6 -ml-1">
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Dashboard
        </Link>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Package className="h-16 w-16 text-slate-300 mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Envío no encontrado</h2>
          <p className="text-slate-500">El código <code className="bg-slate-100 px-2 py-0.5 rounded text-sm">{id}</code> no existe en el sistema.</p>
        </div>
      </div>
    );
  }

  const data: TrackingResponse = await res.json();

  const badgeClass = STATUS_BADGE[data.estadoActual] ?? "bg-slate-100 text-slate-700";

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Back */}
      <Link href="/" className="inline-flex items-center text-slate-500 hover:text-slate-900 hover:bg-slate-100/50 px-3 py-1.5 rounded-md text-sm font-medium -ml-3 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Dashboard
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">Tracking ID</p>
          <h1 className="text-3xl font-bold text-slate-900 font-mono">{data.trackingCode}</h1>
          <p className="text-slate-500 mt-1 text-sm">Detalles y estado actual del envío</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-500">Estado:</span>
          <Badge className={`${badgeClass} text-sm px-3 py-1 font-semibold rounded-full border`}>
            <Truck className="w-3.5 h-3.5 mr-1.5 inline-block" />
            {data.estadoActual}
          </Badge>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Direcciones */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-500" />
              Origen → Destino
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-5">
            <div className="flex gap-4">
              <div className="mt-1 flex-shrink-0">
                <div className="h-6 w-6 rounded-full bg-slate-100 border-2 border-slate-300 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-slate-400" />
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Remitente</p>
                <p className="font-semibold text-slate-900 mt-0.5">{data.remitente.nombre}</p>
                <p className="text-slate-500 text-sm">{data.remitente.direccion}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="mt-1 flex-shrink-0">
                <div className="h-6 w-6 rounded-full bg-blue-100 border-2 border-blue-500 flex items-center justify-center">
                  <MapPin className="h-3 w-3 text-blue-600" />
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Destinatario</p>
                <p className="font-semibold text-slate-900 mt-0.5">{data.destinatario.nombre}</p>
                <p className="text-slate-500 text-sm">{data.destinatario.direccion}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detalles del paquete */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-500" />
              Detalles del Paquete
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5 space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-50 rounded-lg text-slate-500">
                <Weight className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Peso y Dimensiones</p>
                <p className="font-medium text-slate-900 mt-0.5">
                  {data.paquete.peso} kg
                  <span className="text-slate-400 mx-1">•</span>
                  {data.paquete.largo} × {data.paquete.ancho} × {data.paquete.alto} cm
                </p>
                <p className="text-xs text-slate-400">ID Paquete: #{data.paquete.idPaquete}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-50 rounded-lg text-slate-500">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Tipo de Servicio</p>
                <p className="font-medium text-slate-900 mt-0.5 capitalize">{data.tipoServicio}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Entrega Estimada</p>
                <p className="font-bold text-slate-900 text-lg mt-0.5">
                  {new Date(data.fechaEstimadaEntrega).toLocaleDateString("es-CO", {
                    weekday: "long", day: "2-digit", month: "long", year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline de eventos */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-xl font-bold text-slate-900">Historial de Movimientos</h2>
          <Badge variant="outline" className="text-slate-500 text-xs">
            <ClockIcon className="h-3 w-3 mr-1" />
            {data.eventos.filter(e => e.fecha_evento).length} de {data.eventos.length} eventos
          </Badge>
        </div>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6 sm:p-8">
            <div className="relative pl-4 sm:pl-6">
              {/* Línea vertical de la timeline */}
              <div className="absolute left-[31px] sm:left-[43px] top-5 bottom-8 w-0.5 bg-slate-200" />

              <div className="space-y-8">
                {data.eventos.map((event, index) => (
                  <TimelineEvent
                    key={`${event.tipo_evento}-${index}`}
                    event={event}
                    isLast={index === data.eventos.length - 1}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
