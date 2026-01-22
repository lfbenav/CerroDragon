'use client';

import { CardTestimonioAdmin, Cuadro, SideBarAdmin, TopBar } from "@/app/components";
import { useState, useEffect } from "react";

interface Testimonio {
    id: number;
    nombre: string;
    comentario: string;
    fecha: string;
    estado: 'pendiente' | 'aprobado' | 'rechazado';
}

export default function TestimoniosAdmin() {
    const [currentFilter, setCurrentFilter] = useState('todos');
    const [testimonios, setTestimonios] = useState<Testimonio[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [error, setError] = useState<string | null>(null); //Esto está por si quieren manejar errores de carga, si no se lo pueden quitar

    // Mock data - Reemplazar con datos reales de la API
    const mockTestimonios: Testimonio[] = [
        {
            id: 1,
            nombre: "Alex Naranjo Naranjo",
            comentario: "Lleve ropa cómoda porque si se camina bastante, se disfruta mucho la experiencia!",
            fecha: "12 de Marzo de 2024",
            estado: 'aprobado'
        },
        {
            id: 2,
            nombre: "Camila Miranda Canales",
            comentario: "¡Increíble!",
            fecha: "24 de diciembre de 2025",
            estado: 'aprobado'
        },
        {
            id: 3,
            nombre: "Pedro Torres Gonzales",
            comentario: "¡Fue una experiencia absolutamente maravillosa que superó todas nuestras expectativas! El lugar tiene una magia especial y el tour está tan bien organizado que te permite disfrutar cada segundo sin preocupaciones. Lo más fascinante, sin duda, fue contemplar el amanecer; ver cómo los primeros rayos de luz transformaban el paisaje fue un espectáculo inolvidable. Compartir un momento de tanta paz y belleza con mis seres queridos fue un regalo para el alma. Recomiendo este destino de forma entusiasta a cualquiera que busque desconectar y vivir una aventura auténtica. ¡Es una vivencia que atesoraremos por siempre y que definitivamente planeamos repetir muy pronto!",
            fecha: "24 de noviembre de 2025",
            estado: 'pendiente'
        },
        {
            id: 4,
            nombre: "Mariana Ruiz Lopez",
            comentario: "Amé cada momento del tour. La guía fue muy amable y conocedora.",
            fecha: "15 de Junio de 2025",
            estado: 'pendiente'
        },
        {
            id: 5,
            nombre: "Sofia Morales Castro",
            comentario: "Perfecto.",
            fecha: "3 de Enero de 2025",
            estado: 'rechazado'
        },
        {
            id: 6,
            nombre: "Roberto Silva Mendez",
            comentario: "Increíble experiencia de aventura. Los paisajes son únicos y la organización impecable. Vale cada peso invertido. Definitivamente una de las mejores experiencias que he tenido en mucho tiempo.",
            fecha: "28 de Agosto de 2024",
            estado: 'rechazado'
        },
        {
            id: 7,
            nombre: "Ana Lucia Vargas",
            comentario: "Me encantó la conexión con la naturaleza. Un lugar mágico para desconectarse del estrés diario y recargar energías. La vista desde la cima es simplemente espectacular y el amanecer fue algo fuera de este mundo.",
            fecha: "10 de Octubre de 2024",
            estado: 'aprobado'
        },
        {
            id: 8,
            nombre: "Diego Fernandez Rojas",
            comentario: "Excelente atención.",
            fecha: "5 de Febrero de 2025",
            estado: 'pendiente'
        },
        {
            id: 9,
            nombre: "Valentina Cruz Herrera",
            comentario: "Una aventura que cambió mi perspectiva. El equipo es súper amigable y el lugar tiene una energía especial que te renueva por completo. Cada paso del sendero vale la pena y la experiencia completa es simplemente memorable. Sin duda volveré con toda mi familia para compartir esta magia con ellos.",
            fecha: "22 de Septiembre de 2024",
            estado: 'aprobado'
        }
    ];

    // TODO: HACER llamada a la API para obtener testimonios
    const fetchTestimonios = async () => {
        try {
            setError(null);
            
            // TODO: Llamada a la API para obtener los testimonios
            // const response = await fetch('/api/testimonios');
            // if (!response.ok) throw new Error('Error fetching testimonios');
            // const data = await response.json();
            // setTestimonios(data);
            
            // Por ahora usamos datos mockeados
            setTestimonios(mockTestimonios);
            
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error loading testimonios');
            console.error('Error fetching testimonios:', err);
        }
    };

    useEffect(() => {
        fetchTestimonios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Filter testimonios based on current filter
    const filteredTestimonios = testimonios.filter(testimonio => {
        if (currentFilter === 'todos') return true;
        // Fix: use 'pendiente' instead of 'pendientes' to match data
        if (currentFilter === 'pendientes') return testimonio.estado === 'pendiente';
        if (currentFilter === 'aprobados') return testimonio.estado === 'aprobado';
        if (currentFilter === 'rechazados') return testimonio.estado === 'rechazado';
        return testimonio.estado === currentFilter;
    });

    // Calculate counts for Cuadro components
    const testimoniosAprobados = testimonios.filter(t => t.estado === 'aprobado').length;
    const testimoniosRechazados = testimonios.filter(t => t.estado === 'rechazado').length;
    const testimoniosPendientes = testimonios.filter(t => t.estado === 'pendiente').length;

    const handleFilterSelect = (filter: string) => {
        setCurrentFilter(filter);
    };

    // Función para aprobar testimonio
    const handleApprove = async (testimonioId: number) => {
        try {
            // TODO: Llamar a la API para aprobar testimonio
            // await fetch(`/api/testimonios/${testimonioId}/approve`, { method: 'PUT' });
            
            // Actualizar estado local
            setTestimonios(prev => 
                prev.map(t => 
                    t.id === testimonioId 
                        ? { ...t, estado: 'aprobado' as const }
                        : t
                )
            );
        } catch (error) {
            console.error('Error al aprobar testimonio:', error);
            setError('Error al aprobar el testimonio');
        }
    };

    // Función para rechazar testimonio
    const handleReject = async (testimonioId: number) => {
        try {
            // TODO: Llamar a la API para rechazar testimonio
            // await fetch(`/api/testimonios/${testimonioId}/reject`, { method: 'PUT' });
            
            // Actualizar estado local
            setTestimonios(prev => 
                prev.map(t => 
                    t.id === testimonioId 
                        ? { ...t, estado: 'rechazado' as const }
                        : t
                )
            );
        } catch (error) {
            console.error('Error al rechazar testimonio:', error);
            setError('Error al rechazar el testimonio');
        }
    };
    
    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            <SideBarAdmin />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 flex flex-col ml-72  pt-20 px-8 min-h-0">
                     <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
                        {/* Fixed header section */}
                        <div className="flex-shrink-0">
                            <h1 className="text-3xl font-bold mb-1 text-black mt-4">Testimonios</h1>
                            <p className="mb-4 text-verde3">
                                Decida que opiniones de clientes se muestran en la página principal
                            </p>
                            <hr className="mb-8 border-borde1 border-1 w-full" />
                            <div className="mb-6 flex space-x-4">
                                <Cuadro texto="Testimonios Aprobados" cantidad={testimoniosAprobados} />
                                <Cuadro texto="Testimonios Rechazados" cantidad={testimoniosRechazados} />
                                <Cuadro texto="Testimonios Pendientes" cantidad={testimoniosPendientes} />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleFilterSelect("todos")}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                        currentFilter === "todos"
                                            ? 'bg-verde3 text-white'
                                            : 'bg-beige2 text-verde1 border border-borde1 hover:bg-tabla-header'
                                    }`}
                                >
                                    Todos
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleFilterSelect("pendientes")}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                        currentFilter === "pendientes"
                                            ? 'bg-verde3 text-white'
                                            : 'bg-beige2 text-verde1 border border-borde1 hover:bg-tabla-header'
                                    }`}
                                >
                                    Pendientes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleFilterSelect("aprobados")}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                        currentFilter === "aprobados"
                                            ? 'bg-verde3 text-white'
                                            : 'bg-beige2 text-verde1 border border-borde1 hover:bg-tabla-header'
                                    }`}
                                >
                                    Aprobados
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleFilterSelect("rechazados")}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                        currentFilter === "rechazados"
                                            ? 'bg-verde3 text-white'
                                            : 'bg-beige2 text-verde1 border border-borde1 hover:bg-tabla-header'
                                    }`}
                                >
                                    Rechazados
                                </button>
                            </div>
                            <hr className="mb-6 border-borde1 border-1 w-full mt-6" />
                        </div>
                        
                                
                        {/* Scrollable testimonios */}
                        <div className="flex-1 overflow-y-auto min-h-0">
                            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-3 xl:columns-3 gap-6 p-6">
                                {filteredTestimonios.length === 0 ? (
                                    <div className="col-span-full text-center py-8">
                                        <p className="text-gray-500 text-lg">
                                            {currentFilter === 'todos' 
                                                ? 'No hay testimonios disponibles' 
                                                : `No hay testimonios ${currentFilter}`
                                            }
                                        </p>
                                    </div>
                                ) : (
                                    filteredTestimonios.map((testimonio) => (
                                        <CardTestimonioAdmin
                                            key={testimonio.id}
                                            id={testimonio.id}
                                            nombre={testimonio.nombre}
                                            comentario={testimonio.comentario}
                                            fecha={testimonio.fecha}
                                            estado={testimonio.estado}
                                            onApprove={handleApprove}
                                            onReject={handleReject}
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