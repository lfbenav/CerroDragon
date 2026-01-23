"use client";
import { useState, useEffect } from "react";
import { CardGuideAdmin, Cuadro, SearchBarwFilters, SideBarAdmin, TopBar } from "@/app/components";
import Link from "next/link";

interface Guide {
    id: number;
    nombre: string;
    activo: "Activo" | "Inactivo";
    imagen: string;
}

export default function GestionGuias() {
    const [guides, setGuides] = useState<Guide[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const filtros = ["todos", "Activos", "Inactivos"];
    const [filtroSeleccionado, setFiltroSeleccionado] = useState("todos");

    // Mock data
    const mockGuides: Guide[] = [
        { id: 1, nombre: "Alex Naranjo", activo: "Activo", imagen: "/guia1.png" },
        { id: 2, nombre: "Luis Perez", activo: "Inactivo", imagen: "/guia2.png" },
        { id: 3, nombre: "Maria Gomez", activo: "Activo", imagen: "/guia3.png" },
        { id: 4, nombre: "Carlos Ruiz", activo: "Activo", imagen: "/guia4.png" },
        { id: 5, nombre: "Ana Rodriguez", activo: "Inactivo", imagen: "/guia1.png" },
        { id: 6, nombre: "Pedro Martinez", activo: "Activo", imagen: "/guia2.png" },
        { id: 7, nombre: "Sofia Lopez", activo: "Inactivo", imagen: "/guia3.png" }
    ];

    const handleFiltroChange = (filtro: string) => {
        setFiltroSeleccionado(filtro);
    };

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
            await new Promise(resolve => setTimeout(resolve, 500)); // Simular delay de API
            setGuides(mockGuides);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error loading guides');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGuides();
        // Esto lo pongo porque funciona medio raro esta page con el useEffect
        // Opcional: Polling automático cada 30 segundos
        // const interval = setInterval(fetchGuides, 30000);
        // return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filteredGuides = guides.filter(guide => {
        if (filtroSeleccionado === "todos") return true;
        if (filtroSeleccionado === "Activos") return guide.activo === "Activo";
        if (filtroSeleccionado === "Inactivos") return guide.activo === "Inactivo";
        return true;
    });

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            <SideBarAdmin />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 flex flex-col ml-72  pt-20 px-8 min-h-0">
                    <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
                        {/* Fixed header section */}
                        <div className="flex-shrink-0 justify-between items-center flex">
                            <div className="flex-shrink-0">
                                <h1 className="text-3xl font-bold mb-1 text-black mt-4">Gestión de Guías</h1>
                                <p className="mb-4 text-verde3">
                                    Administre a su equipo de guías turísticos
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Link href="/admin/guias/new" className="self-start mb-4">
                                    <button className="bg-verde2 px-4 py-2 text-white flex items-center justify-center rounded-lg gap-4">
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
                                        Agregar Guía
                                    </button>
                                </Link>
                            </div>
                        </div>
                        <div className="justify-start items-center flex gap-12 mb-4">
                            <Cuadro texto="Guías Activos" cantidad={guides.filter(g => g.activo === "Activo").length} />
                            <Cuadro texto="Guías Inactivos" cantidad={guides.filter(g => g.activo === "Inactivo").length} />
                        </div>
                        <SearchBarwFilters 
                            texto="Buscar guías..." 
                            filters={filtros} 
                            selectedFilter={filtroSeleccionado}
                            onFilterChange={handleFiltroChange}
                        />
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 p-6">
                                    {filteredGuides.map((guide) => (
                                        <CardGuideAdmin
                                            id={guide.id}
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