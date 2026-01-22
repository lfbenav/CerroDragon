"use client";
import { CardPuntoAdmin, SideBarAdmin, TopBar } from "@/app/components";
import Link from "next/link";
import { useState, useEffect } from "react";

interface Punto {
    id: number;
    nombre: string;
    ubicacion: string;
    direccion: string;
    activo: boolean;
}

export default function PuntosAdmin() {
    const [puntos, setPuntos] = useState<Punto[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [error, setError] = useState<string | null>(null);

    // Datos mock - Reemplazar con datos reales de la API
    const mockPuntos: Punto[] = [
        {
            id: 1,
            nombre: "Uruca",
            ubicacion: "https://share.google/ncSBFPw2B6kwbG8Lw",
            direccion: "500 mts este del palo de mamón chino",
            activo: true
        },
        {
            id: 2,
            nombre: "Ceiba Alta",
            ubicacion: "https://share.google/ncSBFPw2B6kwbG8Lw",
            direccion: "200 mts oeste del palo de mango",
            activo: true
        },
        {
            id: 3,
            nombre: "San José Centro",
            ubicacion: "https://share.google/ncSBFPw2B6kwbG8Lw",
            direccion: "Frente al Teatro Nacional",
            activo: true
        },
        {
            id: 4,
            nombre: "Cartago",
            ubicacion: "https://share.google/ncSBFPw2B6kwbG8Lw",
            direccion: "Terminal de buses de Cartago",
            activo: true
        },
        {
            id: 5,
            nombre: "Heredia",
            ubicacion: "https://share.google/ncSBFPw2B6kwbG8Lw",
            direccion: "Parque Central de Heredia",
            activo: false
        }
    ];

    // TODO: Función para obtener puntos desde la API
    const fetchPuntos = async () => {
        try {
            setError(null);
            
            // TODO: Llamada a la API para obtener los puntos
            // const response = await fetch('/api/puntos');
            // if (!response.ok) throw new Error('Error fetching puntos');
            // const data = await response.json();
            // setPuntos(data);
            
            // Por ahora usamos datos mock
            setPuntos(mockPuntos); 
            
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error cargando puntos');
            console.error('Error fetching puntos:', err);
        }
    };

    useEffect(() => {
        fetchPuntos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            <SideBarAdmin />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 flex flex-col pt-20 px-8 min-h-0">
                    <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
                        <div className="flex-shrink-0 flex justify-between items-center">
                            <div className="">
                                <h1 className="text-3xl font-bold mb-1 text-black mt-4">Puntos de encuentro</h1>
                                <p className="mb-4 text-verde3">
                                    Coloque los puntos destinados a encuentro
                                </p>
                            </div>
                            <div className="flex justify-end my-2">
                                <Link href="/admin/puntos/new">
                                    <button className="flex justify-center items-center bg-verde2 text-white px-4 py-2 rounded-lg gap-4">
                                        <svg
                                            className="w-6 h-6 text-white dark:text-white"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={24}
                                            height={24}
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4.243a1 1 0 1 0-2 0V11H7.757a1 1 0 1 0 0 2H11v3.243a1 1 0 1 0 2 0V13h3.243a1 1 0 1 0 0-2H13V7.757Z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        Nuevo Punto
                                    </button>
                                </Link>
                            </div>
                        </div>
                        <hr className="border-1 border-borde1 w-full mt-1 mb-4" />
                        
                        {/* Scrollable puntos */}
                        <div className="overflow-x-auto mb-6">
                            <div className="flex gap-12 p-6 min-w-max">
                                {puntos.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500 text-lg">No hay puntos de encuentro disponibles</p>
                                    </div>
                                ) : (
                                    puntos.map((punto) => (
                                        <CardPuntoAdmin
                                            key={punto.id}
                                            nombre={punto.nombre}
                                            ubicacion={punto.ubicacion}
                                            direccion={punto.direccion} 
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}