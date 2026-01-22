"use client";
import { TopBar, SideBarAdmin, Cuadro, SearchBar, TablaGestionReservas } from "@/app/components";

// Datos de ejemplo para las reservas
const reservasData = [
    {
        id: "RV-502",
        clienteNombre: "Carlos Alvarado",
        clienteEmail: "c.alvarado@gmail.com",
        tour: "Tour al amanecer",
        monto: 30000,
        fecha: "15 de Diciembre de 2025",
        personas: 4,
        guiaAsignado: "",
        estado: "confirmada" as const,
    },
    {
        id: "RV-503",
        clienteNombre: "María González",
        clienteEmail: "maria.g@hotmail.com",
        tour: "Aventura en la montaña",
        monto: 45000,
        fecha: "20 de Diciembre de 2025",
        personas: 2,
        guiaAsignado: "Juan Pérez",
        estado: "pendiente" as const,
    },
    {
        id: "RV-504",
        clienteNombre: "Pedro Martínez",
        clienteEmail: "p.martinez@company.com",
        tour: "Tour nocturno",
        monto: 25000,
        fecha: "18 de Diciembre de 2025",
        personas: 3,
        guiaAsignado: "Luis Fernando Gómez",
        estado: "reembolsada" as const,
    }
];

const guiasDisponibles = [
    {
        id: "G-01",
        nombre: "Juan Pérez"
    },
    {
        id: "G-02",
        nombre: "Luis Fernando Gómez"
    },
    {
        id: "G-03",
        nombre: "Ana María López"
    },
    {
        id: "G-04",
        nombre: "Sofía Ramírez"
    }
];

export default function Reservas() {
    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            <SideBarAdmin />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 flex flex-col ml-72  pt-20 px-8 min-h-0"> 
                    <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
                        <div className="flex-shrink-0 mb-6">
                            <h1 className="text-3xl font-bold mb-1 text-black">Gestión de Reservas</h1>
                            <p className="text-verde3 mb-6">
                                Revise todas las reservas y asigne a los guías correspondientes
                            </p>
                            <hr className="border-1 border-borde1 w-full" />
                        </div>
                        <div className="justify-center items-center flex gap-12 mb-4">
                            <Cuadro texto="Total de Reservas" cantidad={reservasData.length} />
                            <Cuadro texto="Reservas Confirmadas" cantidad={reservasData.filter(r => r.estado === 'confirmada').length} />
                            <Cuadro texto="Reservas Pendientes" cantidad={reservasData.filter(r => r.estado === 'pendiente').length} />
                        </div>
                        <SearchBar texto="Buscar reservas..." />
                        <TablaGestionReservas reservas={reservasData} guias={guiasDisponibles} />
                    </div>
                    
                </main>
            </div>
        </div>
    );
}