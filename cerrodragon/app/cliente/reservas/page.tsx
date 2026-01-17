"use client";
import { SideBarClient, TopBar, TablaReservas, WhatsAppButton } from "@/app/components";

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
        estado: "reembolsada" as const,
    }
];

export default function Reservas() {
    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            <SideBarClient />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 flex flex-col pt-20 px-8 min-h-0"> 
                    <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
                        <div className="flex-shrink-0 mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h1 className="text-3xl font-bold mb-1 text-black">Mis Reservas</h1>
                                    <p className="text-verde3">
                                        Revise todas sus reservas y solicite reembolsos si es necesario
                                    </p>
                                </div>
                                <WhatsAppButton />
                            </div>
                            <hr className="border-1 border-borde1 w-full" />
                        </div>
                        
                        <TablaReservas reservas={reservasData} />
                    </div>
                    
                </main>
            </div>
        </div>
    );
}