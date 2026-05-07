"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAllShipmentsAction } from "@/app/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Package, Truck, CheckCircle2, AlertCircle, Search, PlusCircle, RefreshCw } from "lucide-react";

export default function Dashboard() {
  const [searchCode, setSearchCode] = useState("");
  const [shipments, setShipments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchShipments = async () => {
    setIsLoading(true);
    try {
      const data = await getAllShipmentsAction();
      setShipments(data || []);
    } catch (error) {
      console.error("Error loading shipments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCode.trim()) {
      router.push(`/tracking/${searchCode.trim()}`);
    }
  };

  // Cálculos dinámicos para los KPIs
  const stats = {
    total: shipments.length,
    enTransito: shipments.filter(s => s.state === "En Tránsito").length,
    entregados: shipments.filter(s => s.state === "Entregado").length,
    retrasados: shipments.filter(s => s.state === "Retrasado").length,
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="animate-in fade-in slide-in-from-left duration-500">
          <h1 className="text-2xl font-bold text-slate-900">Dashboard General</h1>
          <p className="text-slate-500 mt-1">Resumen del estado operativo de envíos.</p>
        </div>
        <Link href="/nuevo-envio" className="group inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 py-2.5 font-medium shadow-md hover:shadow-blue-200 transition-all hover:-translate-y-0.5 active:translate-y-0 text-sm">
          <PlusCircle className="mr-2 h-5 w-5 transition-transform group-hover:rotate-90" />
          Nuevo Envío
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-6">
        <Card className="shadow-sm border-slate-200 hover:shadow-md hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 cursor-default group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600">Total Envíos</CardTitle>
            <div className="h-8 w-8 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
              <Package className="h-4 w-4 text-blue-600 group-hover:text-white transition-colors" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl lg:text-3xl font-bold text-slate-900">{stats.total}</div>
            <p className="text-xs text-emerald-600 mt-1 font-medium">Actualizado en vivo</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200 hover:shadow-md hover:border-amber-200 hover:-translate-y-1 transition-all duration-300 cursor-default group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600">En Tránsito</CardTitle>
            <div className="h-8 w-8 rounded-xl bg-amber-50 flex items-center justify-center group-hover:bg-amber-500 transition-colors">
              <Truck className="h-4 w-4 text-amber-500 group-hover:text-white transition-colors" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl lg:text-3xl font-bold text-slate-900">{stats.enTransito}</div>
            <p className="text-xs text-slate-500 mt-1 font-medium">Operando con normalidad</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200 hover:shadow-md hover:border-emerald-200 hover:-translate-y-1 transition-all duration-300 cursor-default group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600">Entregados</CardTitle>
            <div className="h-8 w-8 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 group-hover:text-white transition-colors" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl lg:text-3xl font-bold text-slate-900">{stats.entregados}</div>
            <p className="text-xs text-emerald-600 mt-1 font-medium">Logística eficiente</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200 hover:shadow-md hover:border-red-200 hover:-translate-y-1 transition-all duration-300 cursor-default group">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600">Retrasados</CardTitle>
            <div className="h-8 w-8 rounded-xl bg-red-50 flex items-center justify-center group-hover:bg-red-500 transition-colors">
              <AlertCircle className="h-4 w-4 text-red-500 group-hover:text-white transition-colors" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl lg:text-3xl font-bold text-slate-900">{stats.retrasados}</div>
            <p className="text-xs text-red-600 mt-1 font-medium">Requieren atención</p>
          </CardContent>
        </Card>
      </div>

      {/* Central Tracking Search */}
      <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-br from-blue-50/80 to-white p-8 sm:p-12 text-center border-b border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">Rastrear un envío</h2>
          <p className="text-slate-500 mb-8 max-w-lg mx-auto text-sm md:text-base">
            Ingresa el número de guía o código de rastreo para conocer el estado y ubicación exacta de un paquete en tiempo real.
          </p>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row w-full max-w-2xl mx-auto items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input 
                type="text" 
                placeholder="Ej. TRK-ABC12345" 
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                className="w-full pl-12 h-14 text-base border-slate-300 focus-visible:ring-blue-600 focus-visible:border-blue-600 rounded-xl shadow-sm transition-shadow uppercase"
              />
            </div>
            <button type="submit" disabled={!searchCode.trim()} className="inline-flex items-center justify-center h-14 px-8 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl shadow-md transition-colors text-base font-semibold">
              Rastrear Envío
            </button>
          </form>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-8">
        {/* Envíos Recientes Table */}
        <div className="space-y-4 shadow-sm border-slate-200 rounded-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Envíos Recientes</h3>
            <Button variant="outline" size="sm" onClick={fetchShipments} className="text-blue-600 border-blue-200 hover:bg-blue-50 font-medium">
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          </div>
          <Card className="overflow-hidden border-slate-200">
            <Table>
              <TableHeader className="bg-slate-50 border-b border-slate-200">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-semibold text-slate-600 h-11 w-[150px]">ID Tracking</TableHead>
                  <TableHead className="font-semibold text-slate-600 h-11">Remitente</TableHead>
                  <TableHead className="font-semibold text-slate-600 h-11">Destino</TableHead>
                  <TableHead className="font-semibold text-slate-600 h-11">Estado</TableHead>
                  <TableHead className="font-semibold text-slate-600 h-11 text-right">Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-slate-500">Cargando envíos...</TableCell>
                  </TableRow>
                ) : shipments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-slate-500">No hay envíos registrados.</TableCell>
                  </TableRow>
                ) : (
                  shipments.map((row) => (
                    <TableRow key={row.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-medium p-4">
                        <Link href={`/tracking/${row.id}`} className="text-blue-600 hover:underline font-mono">
                          {row.id}
                        </Link>
                      </TableCell>
                      <TableCell className="p-4">
                        <div className="font-medium text-slate-900">{row.senderName}</div>
                      </TableCell>
                      <TableCell className="text-slate-600 p-4">
                        <div className="text-xs text-slate-400">Para: {row.destName}</div>
                        <div className="truncate">{row.dest}</div>
                      </TableCell>
                      <TableCell className="p-4">
                        <Badge variant="outline" className={`font-medium ${
                          row.state === 'Entregado' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          row.state === 'En Tránsito' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                          {row.state}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-slate-600 font-medium p-4">{row.date}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </div>
  );
}
