"use client";
import { useState, useEffect } from "react";
import { CardGuide, SideBarClient, TopBar } from "@/app/components";

interface Guide {
    id: number;
    nombre: string;
    activo: "Activo" | "Inactivo";
    imagen: string;
}

export default function Guias() {
    const [guides, setGuides] = useState<Guide[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Mock data
    const mockGuides: Guide[] = [
        { id: 1, nombre: "Alex Naranjo", activo: "Activo", imagen: "/guia1.png" },
        { id: 2, nombre: "Luis Perez", activo: "Inactivo", imagen: "/guia2.png" },
        { id: 3, nombre: "Maria Gomez", activo: "Activo", imagen: "/guia3.png" },
        { id: 4, nombre: "Carlos Ruiz", activo: "Activo", imagen: "/guia4.png" },
    ];

    const fetchGuides = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // TODO: Cambiear esto por una llamada real a la API
            // const response = await fetch('/api/guides');
            // if (!response.ok) throw new Error('Failed to fetch guides');
            // const data = await response.json();
            // setGuides(data);

            // Usando datos simulados por ahora
            setGuides(mockGuides);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error loading guides');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGuides();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            <SideBarClient />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 flex flex-col ml-72  pt-20 px-8 min-h-0">
                    <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
                        {/* Fixed header section */}
                        <div className="flex-shrink-0">
                            <h1 className="text-3xl font-bold mb-1 text-black mt-4">Nuestros Guías</h1>
                            <p className="mb-4 text-verde3">
                                Conócenos!
                            </p>
                        </div>
                        
                        {/* Scrollable guides */}
                        <div className="flex-1 overflow-y-auto min-h-0">
                            {loading ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="text-verde3 text-lg">Cargando guías...</div>
                                </div>
                            ) : error ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="text-red-500 text-lg">{error}</div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-12 p-6">
                                    {guides.map((guide) => (
                                        <CardGuide
                                            key={guide.id}
                                            nombre={guide.nombre}
                                            activo={guide.activo}
                                            imagen={guide.imagen}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}