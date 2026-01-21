"use client";
import { TopBar, TablaComidas, SideBarAdmin } from "@/app/components";
import Link from "next/link";

// Datos de ejemplo para las reservas
const comidasData = [
    {
        id: "XV-502",
        nombreComida: "Casado Tradicional",
        mostrar: true,
    },
    {
        id: "XV-503",
        nombreComida: "Casado Vegano",
        mostrar: true,
    },
    {
        id: "XV-504",
        nombreComida: "Arroz con Pollo",
        mostrar: true,
    },
    {
        id: "XV-505",
        nombreComida: "Ensalada César",
        mostrar: false,
    }
];

export default function ComidasAdmin() {
    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            <SideBarAdmin />
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
                                <Link href="/admin/comidas/new">
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
                                                fill="currentColor"
                                                fillRule="evenodd"
                                                d="M5 5c-.28252 0-.55187.11951-.74145.32899-.18958.20949-.2817.48939-.25358.77051l.6398 6.398C4.90037 15.0535 7.0512 17 9.61995 17h.76015c2.3975 0 4.431-1.6957 4.8992-4H17c1.6569 0 3-1.3431 3-3 0-1.65685-1.3431-3-3-3h-1.095l.09-.9005c.0282-.28112-.064-.56102-.2535-.77051C15.5519 5.11951 15.2825 5 15 5H5Zm12 6h-1.495l.2-2H17c.5523 0 1 .44772 1 1 0 .5523-.4477 1-1 1Z"
                                                clipRule="evenodd"
                                            />
                                            <path
                                                fill="currentColor"
                                                d="M5 18c-.55228 0-1 .4477-1 1s.44772 1 1 1h11c.5523 0 1-.4477 1-1s-.4477-1-1-1H5Z"
                                            />
                                        </svg>
                                        Agregar
                                    </button>
                                </Link>
                            </div>
                            <hr className="border-1 border-borde1 w-full" />
                        </div>
                        
                        <TablaComidas comidas={comidasData} />
                    </div>
                </main>
            </div>
        </div>
    );
}