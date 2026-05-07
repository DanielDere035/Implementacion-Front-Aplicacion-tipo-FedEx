"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Package, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function RastreoRapidoPage() {
  const [code, setCode] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      router.push(`/tracking/${code.trim()}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <Link href="/" className="inline-flex items-center text-slate-500 hover:text-slate-900 mb-8 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Dashboard
      </Link>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Rastreo Rápido</h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          Consulta el estado de tu envío de forma inmediata ingresando el código de rastreo.
        </p>
      </div>

      <Card className="border-slate-200 shadow-xl overflow-hidden bg-white">
        <CardContent className="p-0">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-blue-200" />
              <Input
                type="text"
                placeholder="Ingresa tu código (ej: TRK-12345678)"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full pl-14 h-16 text-xl bg-white/10 border-white/20 text-white placeholder:text-blue-100 focus-visible:ring-white focus-visible:border-white rounded-2xl backdrop-blur-sm transition-all uppercase"
                autoFocus
              />
              <button
                type="submit"
                disabled={!code.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-12 px-6 bg-white text-blue-700 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buscar
              </button>
            </form>
          </div>
          
          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8 bg-slate-50/50">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
                <Package className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-slate-900">Estado del Paquete</h3>
              <p className="text-sm text-slate-500">Conoce si tu paquete está en origen, tránsito o entregado.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-slate-900">Ubicación Real</h3>
              <p className="text-sm text-slate-500">Visualiza en qué centro logístico se encuentra tu envío actualmente.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-slate-900">Historial Completo</h3>
              <p className="text-sm text-slate-500">Accede a toda la línea de tiempo de eventos desde el registro.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-12 p-6 rounded-2xl border border-blue-100 bg-blue-50/30 flex items-start gap-4">
        <div className="mt-1">
          <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px] font-bold">!</div>
        </div>
        <p className="text-sm text-blue-800 leading-relaxed">
          <strong>¿No encuentras tu código?</strong> Recuerda que el código de rastreo se genera automáticamente al registrar un nuevo envío y tiene un formato similar a <span className="font-mono font-bold">TRK-XXXXXXXXXXXX</span>. Si tienes problemas, contacta a soporte.
        </p>
      </div>
    </div>
  );
}
