"use client";

import { useState, useMemo } from "react";
import { SideBarAdmin, TopBar, SearchBar } from "@/app/components";

interface SolicitudReembolso {
    id: string;
    cliente: string;
    correoCliente: string;
    telefono: string;
    producto: string;
    productoId: string;
    montoReembolso: number;
    fechaSolicitud: string;
    motivoSolicitud: string;
    estado: "no-atendido" | "en-proceso" | "atendido";
}

// Datos de ejemplo
const solicitudesEjemplo: SolicitudReembolso[] = [
    {
        id: "RB-001",
        cliente: "Carlos Alvarado",
        correoCliente: "c.alvarado@gmail.com",
        telefono: "8888-1234",
        producto: "Tour al amanecer",
        productoId: "RV-502",
        montoReembolso: 30000,
        fechaSolicitud: "20 de Enero de 2026",
        motivoSolicitud: "Condiciones climáticas adversas",
        estado: "no-atendido",
    },
    {
        id: "RB-002",
        cliente: "María González",
        correoCliente: "maria.g@hotmail.com",
        telefono: "7777-5678",
        producto: "Aventura en la montaña",
        productoId: "RV-503",
        montoReembolso: 45000,
        fechaSolicitud: "19 de Enero de 2026",
        motivoSolicitud: "Emergencia familiar",
        estado: "en-proceso",
    },
    {
        id: "RB-003",
        cliente: "Pedro Martínez",
        correoCliente: "p.martinez@company.com",
        telefono: "6666-9012",
        producto: "Tour nocturno",
        productoId: "RV-504",
        montoReembolso: 25000,
        fechaSolicitud: "18 de Enero de 2026",
        motivoSolicitud: "Cambio de planes de viaje",
        estado: "atendido",
    },
];

export default function ReembolsosPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filtroEstado, setFiltroEstado] = useState<string>("todos");
    const [solicitudes, setSolicitudes] = useState<SolicitudReembolso[]>(solicitudesEjemplo);

    const solicitudesFiltradas = useMemo(() => {
        let filtered = solicitudes;

        // Filtrar por término de búsqueda
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (s) =>
                    s.id.toLowerCase().includes(term) ||
                    s.cliente.toLowerCase().includes(term) ||
                    s.correoCliente.toLowerCase().includes(term) ||
                    s.producto.toLowerCase().includes(term) ||
                    s.productoId.toLowerCase().includes(term)
            );
        }

        // Filtrar por estado
        if (filtroEstado !== "todos") {
            filtered = filtered.filter((s) => s.estado === filtroEstado);
        }

        return filtered;
    }, [searchTerm, filtroEstado, solicitudes]);

    const estadisticas = useMemo(() => {
        return {
            total: solicitudes.length,
            noAtendidos: solicitudes.filter((s) => s.estado === "no-atendido").length,
            enProceso: solicitudes.filter((s) => s.estado === "en-proceso").length,
            atendidos: solicitudes.filter((s) => s.estado === "atendido").length,
        };
    }, [solicitudes]);

    const handleEstadoChange = (id: string, nuevoEstado: SolicitudReembolso["estado"]) => {
        setSolicitudes(prev =>
            prev.map(s => s.id === id ? { ...s, estado: nuevoEstado } : s)
        );
    };

    const handleContactarWhatsApp = (solicitud: SolicitudReembolso) => {
        const mensaje = `Hola ${solicitud.cliente}, nos comunicamos desde Cerro Dragón respecto a su solicitud de reembolso ${solicitud.id} por ${solicitud.producto}.`;
        const url = `https://wa.me/506${solicitud.telefono.replace(/\D/g, '')}?text=${encodeURIComponent(mensaje)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            <SideBarAdmin />

            <div className="flex-1 flex flex-col min-h-0">
                <TopBar />

                <main className="flex-1 overflow-y-auto pt-20 px-8 ml-72 min-h-0">
                    <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
                        {/* Header */}
                        <div className="shrink-0 mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h1 className="text-3xl font-bold mb-1 text-black">
                                        Solicitudes de Reembolso
                                    </h1>
                                    <p className="text-verde3">
                                        Gestione las solicitudes de reembolso de los clientes
                                    </p>
                                </div>
                            </div>

                            {/* Estadísticas */}
                            <div className="grid grid-cols-4 gap-4 mb-6">
                                <div className="bg-white border-2 border-gray-300 rounded-xl p-4 shadow-sm">
                                    <p className="text-sm text-gray-600 mb-1 font-medium">Total Solicitudes</p>
                                    <p className="text-3xl font-bold text-gray-800">{estadisticas.total}</p>
                                </div>
                                <div className="bg-red-50 border-2 border-red-400 rounded-xl p-4 shadow-sm">
                                    <p className="text-sm text-red-700 mb-1 font-medium">No Atendidos</p>
                                    <p className="text-3xl font-bold text-red-700">{estadisticas.noAtendidos}</p>
                                </div>
                                <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-4 shadow-sm">
                                    <p className="text-sm text-yellow-700 mb-1 font-medium">En Proceso</p>
                                    <p className="text-3xl font-bold text-yellow-700">{estadisticas.enProceso}</p>
                                </div>
                                <div className="bg-green-50 border-2 border-green-400 rounded-xl p-4 shadow-sm">
                                    <p className="text-sm text-green-700 mb-1 font-medium">Atendidos</p>
                                    <p className="text-3xl font-bold text-green-700">{estadisticas.atendidos}</p>
                                </div>
                            </div>

                            {/* Filtros */}
                            <div className="flex gap-4 items-center">
                                <div className="flex-1">
                                    <SearchBar
                                        texto="Buscar por ID, cliente, email o producto..."
                                        value={searchTerm}
                                        onChange={setSearchTerm}
                                    />
                                </div>
                                <select
                                    value={filtroEstado}
                                    onChange={(e) => setFiltroEstado(e.target.value)}
                                    className="bg-white border-2 border-gray-300 text-gray-700 text-sm font-medium rounded-xl focus:ring-verde2 focus:border-verde2 px-4 py-2.5"
                                >
                                    <option value="todos">Todos los estados</option>
                                    <option value="no-atendido">No Atendido</option>
                                    <option value="en-proceso">En Proceso</option>
                                    <option value="atendido">Atendido</option>
                                </select>
                            </div>

                            <hr className="border border-borde1 w-full mt-6" />
                        </div>

                        {/* Tabla */}
                        <div className="flex-1 min-h-0 overflow-auto">
                            <div className="bg-white border-2 border-gray-300 rounded-xl overflow-hidden shadow-sm">
                                <table className="w-full">
                                    <thead className="bg-gray-100 border-b-2 border-gray-300">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                ID
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                Cliente
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                Teléfono
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                Producto
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                ID Producto
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                Monto
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                Fecha Solicitud
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                Estado
                                            </th>
                                            <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y-2 divide-gray-200">
                                        {solicitudesFiltradas.length === 0 ? (
                                            <tr>
                                                <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                                                    No se encontraron solicitudes de reembolso
                                                </td>
                                            </tr>
                                        ) : (
                                            solicitudesFiltradas.map((solicitud) => (
                                                <tr key={solicitud.id} className="hover:bg-gray-50 transition">
                                                    <td className="px-4 py-3 text-sm font-bold text-gray-900">
                                                        {solicitud.id}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div>
                                                            <p className="text-sm font-semibold text-gray-900">
                                                                {solicitud.cliente}
                                                            </p>
                                                            <p className="text-xs text-gray-600">
                                                                {solicitud.correoCliente}
                                                            </p>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                                                        {solicitud.telefono}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                                                        {solicitud.producto}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-600">
                                                        {solicitud.productoId}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm font-bold text-red-600">
                                                        ₡{solicitud.montoReembolso.toLocaleString()}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-600">
                                                        {solicitud.fechaSolicitud}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <select
                                                            value={solicitud.estado}
                                                            onChange={(e) => handleEstadoChange(solicitud.id, e.target.value as SolicitudReembolso["estado"])}
                                                            className={`w-full text-xs font-semibold rounded-lg px-3 py-2 border-2 focus:outline-none focus:ring-2 focus:ring-verde2 ${
                                                                solicitud.estado === "no-atendido" 
                                                                    ? "bg-red-50 text-red-800 border-red-400" 
                                                                    : solicitud.estado === "en-proceso"
                                                                    ? "bg-yellow-50 text-yellow-800 border-yellow-400"
                                                                    : "bg-green-50 text-green-800 border-green-400"
                                                            }`}
                                                        >
                                                            <option value="no-atendido">No Atendido</option>
                                                            <option value="en-proceso">En Proceso</option>
                                                            <option value="atendido">Atendido</option>
                                                        </select>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex justify-center">
                                                            <button
                                                                onClick={() => handleContactarWhatsApp(solicitud)}
                                                                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition shadow-sm"
                                                                title="Contactar por WhatsApp"
                                                            >
                                                                <WhatsAppIcon />
                                                                WhatsApp
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Leyenda */}
                        <div className="shrink-0 mt-6 p-4 bg-blue-50 border-2 border-blue-300 rounded-xl">
                            <p className="text-sm text-blue-900 font-medium">
                                <strong>Nota:</strong> Puede cambiar el estado de las solicitudes directamente desde la tabla. 
                                Para contactar al cliente, haga clic en el botón de correo.
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

function WhatsAppIcon() {
    return (
        <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884h-.004Z"
            />
        </svg>
    );
}
