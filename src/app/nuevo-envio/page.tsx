"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  User,
  Phone,
  Package,
  Scale,
  Loader2,
  Send,
  Mail,
  Ruler,
} from "lucide-react";
import type { CreateShipmentPayload } from "@/types/logistics";

// ── Helpers de validación (sincronizan con anotaciones Java del backend) ──────
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validatePayload(data: CreateShipmentPayload): string[] {
  const errors: string[] = [];

  // Remitente
  if (!data.remitente.nombre.trim() || data.remitente.nombre.length > 50)
    errors.push("Nombre del remitente es obligatorio (máximo 50 caracteres).");
  if (!data.remitente.telefono.trim() || data.remitente.telefono.length > 20)
    errors.push("Teléfono del remitente es obligatorio (máximo 20 caracteres).");
  if (!emailRegex.test(data.remitente.correoElectronico) || data.remitente.correoElectronico.length > 50)
    errors.push("Correo del remitente debe ser un email válido (máximo 50 caracteres).");
  if (!data.remitente.direccion.trim() || data.remitente.direccion.length > 500)
    errors.push("Dirección del remitente es obligatoria (máximo 500 caracteres).");

  // Destinatario
  if (!data.destinatario.nombre.trim() || data.destinatario.nombre.length > 50)
    errors.push("Nombre del destinatario es obligatorio (máximo 50 caracteres).");
  if (!data.destinatario.telefono.trim() || data.destinatario.telefono.length > 20)
    errors.push("Teléfono del destinatario es obligatorio (máximo 20 caracteres).");
  if (!emailRegex.test(data.destinatario.correoElectronico) || data.destinatario.correoElectronico.length > 50)
    errors.push("Correo del destinatario debe ser un email válido (máximo 50 caracteres).");
  if (!data.destinatario.direccion.trim() || data.destinatario.direccion.length > 500)
    errors.push("Dirección del destinatario es obligatoria (máximo 500 caracteres).");

  // Paquete — todos deben ser positivos (Long / Double en Java)
  if (data.paquete.peso <= 0) errors.push("El peso debe ser mayor a 0 kg.");
  if (data.paquete.largo <= 0) errors.push("El largo debe ser mayor a 0 cm.");
  if (data.paquete.ancho <= 0) errors.push("El ancho debe ser mayor a 0 cm.");
  if (data.paquete.alto <= 0) errors.push("El alto debe ser mayor a 0 cm.");

  return errors;
}

// ── State inicial del formulario ──────────────────────────────────────────────
const EMPTY_PERSON = {
  nombre: "",
  telefono: "",
  correoElectronico: "",
  direccion: "",
  referencias: "",
};

const EMPTY_PACKAGE = { peso: 0, largo: 0, ancho: 0, alto: 0 };

export default function NuevoEnvioPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [tipoServicio, setTipoServicio] = useState<"standard" | "express" | "overnight">("standard");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    const payload: CreateShipmentPayload = {
      remitente: {
        nombre: fd.get("rem_nombre") as string,
        telefono: fd.get("rem_telefono") as string,
        correoElectronico: fd.get("rem_email") as string,
        direccion: fd.get("rem_direccion") as string,
        referencias: (fd.get("rem_referencias") as string) || undefined,
      },
      destinatario: {
        nombre: fd.get("dest_nombre") as string,
        telefono: fd.get("dest_telefono") as string,
        correoElectronico: fd.get("dest_email") as string,
        direccion: fd.get("dest_direccion") as string,
        referencias: (fd.get("dest_referencias") as string) || undefined,
      },
      paquete: {
        peso: Number(fd.get("peso")),
        largo: Number(fd.get("largo")),
        ancho: Number(fd.get("ancho")),
        alto: Number(fd.get("alto")),
      },
      tipoServicio,
    };

    // Validación client-side (anticipa HTTP 400)
    const errors = validatePayload(payload);
    if (errors.length > 0) {
      toast.error("Corrige los siguientes errores:", {
        description: errors.slice(0, 3).join(" • "),
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/shipments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error((errData.errors as string[])?.join(", ") ?? "Error del servidor");
      }

      const data = await res.json();
      const trackingCode: string = data.trackingCode;

      toast.success("¡Envío registrado con éxito!", {
        description: `Tracking ID generado: ${trackingCode}`,
        action: {
          label: "Ver rastreo",
          onClick: () => router.push(`/tracking/${trackingCode}`),
        },
        duration: 8000,
      });

      form.reset();
      setTipoServicio("standard");
    } catch (err) {
      toast.error("No se pudo registrar el envío.", {
        description: err instanceof Error ? err.message : "Intenta de nuevo.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Registrar Nuevo Envío</h1>
        <p className="text-slate-500 mt-2">
          Ingresa los datos del remitente y destinatario para generar un Tracking ID.
        </p>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <form onSubmit={handleSubmit} noValidate>
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              Formulario de Operación Logística
            </CardTitle>
            <CardDescription>
              Todos los campos marcados son obligatorios. Se validarán contra las reglas del sistema antes de enviar.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6 space-y-8">
            {/* ── Grid Remitente / Destinatario ─────────────────────────────── */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Columna Izquierda: Remitente */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                  <User className="h-4 w-4 text-slate-500" />
                  Origen (Remitente)
                </h3>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label htmlFor="rem_nombre" className="text-sm font-medium text-slate-700">
                      Nombre completo <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="rem_nombre"
                      name="rem_nombre"
                      required
                      maxLength={50}
                      placeholder="Ej. Tech Solutions S.A."
                      className="bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="rem_telefono" className="text-sm font-medium text-slate-700">
                      Teléfono <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="rem_telefono"
                        name="rem_telefono"
                        required
                        type="tel"
                        maxLength={20}
                        placeholder="Ej. 300 123 4567"
                        className="pl-9 bg-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="rem_email" className="text-sm font-medium text-slate-700">
                      Correo electrónico <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="rem_email"
                        name="rem_email"
                        required
                        type="email"
                        maxLength={50}
                        placeholder="Ej. envios@empresa.com"
                        className="pl-9 bg-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="rem_direccion" className="text-sm font-medium text-slate-700">
                      Dirección de origen <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <textarea
                        id="rem_direccion"
                        name="rem_direccion"
                        required
                        maxLength={500}
                        className="w-full min-h-[72px] rounded-md border border-slate-200 bg-white px-3 py-2 pl-9 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:border-transparent resize-none"
                        placeholder="Av. Tecnológico 405, Parque Industrial, Bogotá"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="rem_referencias" className="text-sm font-medium text-slate-700">
                      Referencias <span className="text-slate-400 text-xs">(opcional)</span>
                    </label>
                    <Input
                      id="rem_referencias"
                      name="rem_referencias"
                      maxLength={500}
                      placeholder="Ej. Portería principal, piso 3"
                      className="bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Columna Derecha: Destinatario */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                  <User className="h-4 w-4 text-blue-500" />
                  Destino (Destinatario)
                </h3>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label htmlFor="dest_nombre" className="text-sm font-medium text-slate-700">
                      Nombre completo <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="dest_nombre"
                      name="dest_nombre"
                      required
                      maxLength={50}
                      placeholder="Ej. María Rodríguez"
                      className="bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="dest_telefono" className="text-sm font-medium text-slate-700">
                      Teléfono <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="dest_telefono"
                        name="dest_telefono"
                        required
                        type="tel"
                        maxLength={20}
                        placeholder="Ej. 310 987 6543"
                        className="pl-9 bg-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="dest_email" className="text-sm font-medium text-slate-700">
                      Correo electrónico <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="dest_email"
                        name="dest_email"
                        required
                        type="email"
                        maxLength={50}
                        placeholder="Ej. maria@correo.com"
                        className="pl-9 bg-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="dest_direccion" className="text-sm font-medium text-slate-700">
                      Dirección de destino <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-blue-400" />
                      <textarea
                        id="dest_direccion"
                        name="dest_direccion"
                        required
                        maxLength={500}
                        className="w-full min-h-[72px] rounded-md border border-slate-200 bg-white px-3 py-2 pl-9 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:border-transparent resize-none"
                        placeholder="Calle 123, Apto 4B, Torre Norte, Medellín"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="dest_referencias" className="text-sm font-medium text-slate-700">
                      Referencias <span className="text-slate-400 text-xs">(opcional)</span>
                    </label>
                    <Input
                      id="dest_referencias"
                      name="dest_referencias"
                      maxLength={500}
                      placeholder="Ej. Llamar al llegar, timbre 4B"
                      className="bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Detalles del Paquete ──────────────────────────────────────── */}
            <div className="pt-6 border-t border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-5">
                <Package className="h-4 w-4 text-slate-500" />
                Detalles del Paquete
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {/* Peso */}
                <div className="space-y-1">
                  <label htmlFor="peso" className="text-sm font-medium text-slate-700">
                    Peso <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Scale className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="peso"
                      name="peso"
                      required
                      type="number"
                      step="0.1"
                      min="0.01"
                      placeholder="0.0"
                      className="pl-9 pr-10 bg-white"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">kg</span>
                  </div>
                </div>
                {/* Largo */}
                <div className="space-y-1">
                  <label htmlFor="largo" className="text-sm font-medium text-slate-700">
                    Largo <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="largo"
                      name="largo"
                      required
                      type="number"
                      min="1"
                      placeholder="0"
                      className="pl-9 pr-10 bg-white"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">cm</span>
                  </div>
                </div>
                {/* Ancho */}
                <div className="space-y-1">
                  <label htmlFor="ancho" className="text-sm font-medium text-slate-700">
                    Ancho <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="ancho"
                      name="ancho"
                      required
                      type="number"
                      min="1"
                      placeholder="0"
                      className="pl-9 pr-10 bg-white"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">cm</span>
                  </div>
                </div>
                {/* Alto */}
                <div className="space-y-1">
                  <label htmlFor="alto" className="text-sm font-medium text-slate-700">
                    Alto <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="alto"
                      name="alto"
                      required
                      type="number"
                      min="1"
                      placeholder="0"
                      className="pl-9 pr-10 bg-white"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">cm</span>
                  </div>
                </div>
              </div>

              {/* Tipo de Servicio */}
              <div className="max-w-xs space-y-1">
                <label className="text-sm font-medium text-slate-700">
                  Tipo de Servicio <span className="text-red-500">*</span>
                </label>
                <Select
                  value={tipoServicio}
                  onValueChange={(v) => setTipoServicio(v as typeof tipoServicio)}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard (3-5 días hábiles)</SelectItem>
                    <SelectItem value="express">Express (1-2 días hábiles)</SelectItem>
                    <SelectItem value="overnight">Overnight (Día siguiente)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>

          <CardFooter className="bg-slate-50/50 border-t border-slate-100 pt-6 pb-6 px-6 flex justify-end">
            <Button
              type="submit"
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white min-w-[260px] shadow-sm font-semibold rounded-xl h-12"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Procesando envío...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  Generar Tracking y Guardar
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
