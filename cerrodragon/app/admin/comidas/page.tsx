"use client";
import { SideBarClient, TopBar, TablaFormsComidas } from "@/app/components";
import Link from "next/link";

// Datos de ejemplo para las reservas
const comidasData = [
    {
        id: "XV-502",
        clienteNombre: "Carlos Alvarado",
        clienteEmail: "c.alvarado@gmail.com",
        tour: "Tour al amanecer",
        fecha: "15 de Diciembre de 2025",
        registros: 4,
        reservaAsociada: "RV-400",
    },
    {
        id: "XV-503",
        clienteNombre: "María González",
        clienteEmail: "maria.g@hotmail.com",
        tour: "Aventura en la montaña",
        fecha: "20 de Diciembre de 2025",
        registros: 2,
        reservaAsociada: "RV-450",
    },
    {
        id: "XV-504",
        clienteNombre: "Pedro Martínez",
        clienteEmail: "p.martinez@company.com",
        tour: "Tour nocturno",
        fecha: "18 de Diciembre de 2025",
        registros: 3,
        reservaAsociada: "RV-480",
    }
];

export default function ComidasAdmin() {
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
                                    <h1 className="text-3xl font-bold mb-1 text-black">Comidas</h1>
                                    <p className="text-verde3">
                                        Respuestas al formulario de comidas para tours
                                    </p>
                                </div>
                                <button className="rounded-lg flex items-center justify-center gap-2 mt-1 py-2 px-4 text-white bg-verde3 hover:bg-verde2">
                                    <svg
                                        className="w-6 h-6 text-gray-800 dark:text-white"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={24}
                                        height={24}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M11 9h6m-6 3h6m-6 3h6M6.996 9h.01m-.01 3h.01m-.01 3h.01M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
                                        />
                                    </svg>
                                    Nuevo Formulario
                                </button>
                            </div>
                            <hr className="border-1 border-borde1 w-full" />
                        </div>
                        
                        <TablaFormsComidas comidas={comidasData} />
                        <div className="flex justify-end">
                            <Link href="/admin/comidas/gestion">
                                <button className=" flex rounded-lg items-center justify-center gap-2 mt-1 py-2 px-4 text-white bg-verde3 hover:bg-verde2 mb-6">
                                    <svg
                                        className="w-6 h-6 text-gray-800 dark:text-white"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={24}
                                        height={24}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeWidth={2}
                                            d="M6 4v10m0 0a2 2 0 1 0 0 4m0-4a2 2 0 1 1 0 4m0 0v2m6-16v2m0 0a2 2 0 1 0 0 4m0-4a2 2 0 1 1 0 4m0 0v10m6-16v10m0 0a2 2 0 1 0 0 4m0-4a2 2 0 1 1 0 4m0 0v2"
                                        />
                                    </svg>
                                    Gestionar comidas
                                </button>
                            </Link>
                        </div>
                    </div>
                    
                </main>
            </div>
        </div>
    );
}