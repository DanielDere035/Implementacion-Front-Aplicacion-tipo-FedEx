import Link from "next/link";
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
import { Package, Truck, CheckCircle2, AlertCircle, Search, PlusCircle } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard General</h1>
          <p className="text-slate-500 mt-1">Resumen del estado operativo de envíos.</p>
        </div>
        <Link href="/nuevo-envio" className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 py-2.5 font-medium shadow-sm transition-colors text-sm">
          <PlusCircle className="mr-2 h-5 w-5" />
          Nuevo Envío
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-6">
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600">Total Envíos</CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
              <Package className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl lg:text-3xl font-bold text-slate-900">12,345</div>
            <p className="text-xs text-emerald-600 mt-1 font-medium">+2.1% desde el último mes</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600">En Tránsito</CardTitle>
            <div className="h-8 w-8 rounded-full bg-amber-50 flex items-center justify-center">
              <Truck className="h-4 w-4 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl lg:text-3xl font-bold text-slate-900">3,490</div>
            <p className="text-xs text-slate-500 mt-1 font-medium">Operando con normalidad</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600">Entregados</CardTitle>
            <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl lg:text-3xl font-bold text-slate-900">8,712</div>
            <p className="text-xs text-emerald-600 mt-1 font-medium">+5.4% de eficiencia</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600">Retrasados</CardTitle>
            <div className="h-8 w-8 rounded-full bg-red-50 flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl lg:text-3xl font-bold text-slate-900">143</div>
            <p className="text-xs text-red-600 mt-1 font-medium">-1.2% peor que ayer</p>
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
          <div className="flex flex-col sm:flex-row w-full max-w-2xl mx-auto items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input 
                type="text" 
                placeholder="Ej. ABC-12345678" 
                className="w-full pl-12 h-14 text-base border-slate-300 focus-visible:ring-blue-600 focus-visible:border-blue-600 rounded-xl shadow-sm transition-shadow"
              />
            </div>
            <Link href="/tracking/ABC-12345678" className="inline-flex items-center justify-center h-14 px-8 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-colors text-base font-semibold">
              Rastrear Envío
            </Link>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Envíos Recientes Table */}
        <div className="xl:col-span-2 space-y-4 shadow-sm border-slate-200 rounded-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Envíos Recientes</h3>
            <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50 font-medium">Ver todos</Button>
          </div>
          <Card className="overflow-hidden border-slate-200">
            <Table>
              <TableHeader className="bg-slate-50 border-b border-slate-200">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-semibold text-slate-600 h-11 w-[120px]">ID Tracking</TableHead>
                  <TableHead className="font-semibold text-slate-600 h-11">Destino</TableHead>
                  <TableHead className="font-semibold text-slate-600 h-11">Estado</TableHead>
                  <TableHead className="font-semibold text-slate-600 h-11 text-right">Fecha Estimada</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { id: "XYZ-9876", dest: "Bogotá, COL", state: "En Tránsito", badgeClass: "bg-amber-50 text-amber-700 border-amber-200", date: "12 Abr 2026" },
                  { id: "ABC-1234", dest: "Medellín, COL", state: "Entregado", badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200", date: "10 Abr 2026" },
                  { id: "LMN-4567", dest: "Cali, COL", state: "Preparando", badgeClass: "bg-blue-50 text-blue-700 border-blue-200", date: "14 Abr 2026" },
                  { id: "QRS-8901", dest: "Barranquilla, COL", state: "En Tránsito", badgeClass: "bg-amber-50 text-amber-700 border-amber-200", date: "13 Abr 2026" },
                  { id: "DEF-5678", dest: "Bucaramanga, COL", state: "Retrasado", badgeClass: "bg-red-50 text-red-700 border-red-200", date: "15 Abr 2026" },
                ].map((row) => (
                  <TableRow key={row.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-medium p-4">
                      <Link href={`/tracking/${row.id}`} className="text-blue-600 hover:underline">
                        {row.id}
                      </Link>
                    </TableCell>
                    <TableCell className="text-slate-600 p-4">{row.dest}</TableCell>
                    <TableCell className="p-4"><Badge variant="outline" className={`${row.badgeClass} font-medium`}>{row.state}</Badge></TableCell>
                    <TableCell className="text-right text-slate-600 font-medium p-4">{row.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* Contenedor del Back */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Integración Pendiente</h3>
          <div className="h-[300px] w-full border-2 border-dashed border-blue-300 rounded-xl bg-blue-50/30 flex items-center justify-center p-8 text-center text-slate-500 hover:bg-blue-50/60 transition-colors cursor-crosshair relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNFMkU4RjAiIC8+PC9zdmc+')] opacity-50 group-hover:opacity-70 transition-opacity"></div>
            
            <div className="space-y-4 relative z-10 max-w-xs mx-auto">
              <div className="mx-auto w-16 h-16 bg-white rounded-2xl shadow-sm border border-blue-100 flex items-center justify-center">
                <Package className="h-8 w-8 text-blue-500" />
              </div>
              <div>
                <p className="font-semibold text-blue-900 text-base mb-1">[Aquí se visualizará el componente del equipo del Back]</p>
                <p className="text-sm text-slate-500 leading-relaxed">Este espacio está reservado para mostrar vistas detalladas o flujos complejos manejados por la API.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
