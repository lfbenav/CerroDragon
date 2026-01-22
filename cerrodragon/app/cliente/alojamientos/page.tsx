"use client";
import { SideBarClient, TopBar, WhatsAppButton, TablaMisAlojamientos } from "@/app/components";

// Datos de ejemplo para las reservas
const reservasData = [
    {
        id: "RV-502",
        clienteNombre: "Carlos Alvarado",
        clienteEmail: "c.alvarado@gmail.com",
        cabana: "Cabaña del Lago",
        fechaReserva: "15 de Diciembre de 2025",
        personas: 4,
        fechaLlegada: "22 de Diciembre de 2025",
        fechaFinal: "27 de Diciembre de 2025",
        estado: "confirmada" as const,
    },
    {
        id: "RV-503",
        clienteNombre: "María González",
        clienteEmail: "maria.g@hotmail.com",
        cabana: "Cabaña Montañesa",
        fechaReserva: "20 de Diciembre de 2025",
        fechaLlegada: "28 de Diciembre de 2025",
        fechaFinal: "02 de Enero de 2026",
        personas: 2,
        estado: "pendiente" as const,
    },
    {
        id: "RV-504",
        clienteNombre: "Pedro Martínez",
        clienteEmail: "p.martinez@company.com",
        cabana: "Cabaña Sol y Sombra",
        fechaReserva: "18 de Diciembre de 2025",
        fechaLlegada: "25 de Diciembre de 2025",
        fechaFinal: "30 de Diciembre de 2025",
        personas: 3,
        estado: "reembolsada" as const,
    }
];

export default function MisAlojamientos() {
    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            <SideBarClient />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 flex flex-col ml-72  pt-20 px-8 min-h-0"> 
                    <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
                        <div className="flex-shrink-0 mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h3 className="text-3xl font-bold mb-1 text-black">Mis Reservas de alojamientos</h3>
                                    <p className="text-verde3">
                                        Revise todas sus reservas de alojamientos  y solicite reembolsos si es necesario
                                    </p>
                                </div>
                                <WhatsAppButton />
                            </div>
                            <hr className="border-1 border-borde1 w-full" />
                        </div>
                        
                        <TablaMisAlojamientos reservas={reservasData} />
                    </div>
                    
                </main>
            </div>
        </div>
    );
}