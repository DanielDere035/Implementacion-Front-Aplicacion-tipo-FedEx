import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Package, Search, Bell, Home, MapPin, PlusCircle, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LogiTrack - Dashboard",
  description: "Sistema de tracking logístico",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-slate-50 min-h-screen text-slate-900 flex`}>
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 flex-col hidden md:flex shrink-0">
          <div className="h-16 flex items-center px-6 border-b border-slate-200">
            <Link href="/" className="flex items-center gap-2 text-blue-700 hover:opacity-80 transition-all hover:scale-105 active:scale-95 duration-200">
              <Package className="h-6 w-6" />
              <span className="text-xl font-bold tracking-tight">LogiTrack</span>
            </Link>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            <Link href="/" className="flex items-center gap-3 px-3 py-2.5 bg-blue-50 text-blue-700 rounded-xl font-semibold shadow-sm hover:translate-x-1 transition-all duration-200">
              <Home className="h-5 w-5" />
              Dashboard
            </Link>
            <Link href="/rastreo" className="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:translate-x-1 rounded-xl font-medium transition-all duration-200">
              <MapPin className="h-5 w-5" />
              Rastreo Rápido
            </Link>
            <Link href="/nuevo-envio" className="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:translate-x-1 rounded-xl font-medium transition-all duration-200">
              <PlusCircle className="h-5 w-5" />
              Nuevo Envío
            </Link>
            <Link href="#" className="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:translate-x-1 rounded-xl font-medium transition-all duration-200">
              <Settings className="h-5 w-5" />
              Configuración
            </Link>
          </nav>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
          {/* Header */}
          <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 shrink-0">
            <div className="flex items-center flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="search"
                  placeholder="Buscar tracking, cliente, destino..."
                  className="w-full pl-9 bg-slate-50 border-slate-200 focus-visible:ring-blue-500 rounded-full h-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-4 ml-4">
              <button className="relative text-slate-500 hover:text-slate-700 transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
              </button>
              <div className="h-6 w-px bg-slate-200 mx-1"></div>
              <Avatar className="h-9 w-9 border border-slate-200">
                <AvatarImage src="https://github.com/shadcn.png" alt="@usuario" />
                <AvatarFallback>OP</AvatarFallback>
              </Avatar>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-6 lg:p-10">
            {children}
          </main>
        </div>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
