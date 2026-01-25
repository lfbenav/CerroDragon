"use client";
import { useState, useEffect } from "react";
import { SideBarAdmin, TopBar, CardTourAdmin, SearchBarAdmin, Cuadro} from "../../components";
import Link from "next/link";

const API_URL = "http://localhost:3000";

interface Tour {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    imagen: string;
    capacidad: number;
    duracion: string;
    etiqueta: string;
    activo?: boolean;
}

interface TourAPI {
    id: number;
    title: string;
    description: string;
    duration_hours: number;
    duration_days: number;
    max_persons: number;
    person_price: number;
    image_url: string | null;
    base_location: string | null;
    is_active: boolean;
    created_at: string;
}

export default function Tours() {
    const [tours, setTours] = useState<Tour[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchTours = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch(`${API_URL}/tours/all`);
            if (!response.ok) throw new Error('Error al cargar tours');
            const json = await response.json();
            
            // Mapear datos de la API al formato del componente
            const mappedTours: Tour[] = json.data.map((tour: TourAPI) => {
                let imgUrl = '/tour1.png';
                if (tour.image_url) {
                    if (tour.image_url.startsWith('http')) {
                        imgUrl = tour.image_url;
                    } else if (tour.image_url.startsWith('/')) {
                        imgUrl = `${API_URL}${tour.image_url}`;
                    } else {
                        imgUrl = tour.image_url;
                    }
                }
                return {
                    id: tour.id,
                    nombre: tour.title,
                    descripcion: tour.description || '',
                    precio: tour.person_price,
                    imagen: imgUrl,
                    capacidad: tour.max_persons,
                    duracion: tour.duration_days > 0 
                        ? `${tour.duration_days} día${tour.duration_days > 1 ? 's' : ''}` 
                        : `${tour.duration_hours} hora${tour.duration_hours > 1 ? 's' : ''}`,
                    etiqueta: 'Todos',
                    activo: tour.is_active
                };
            });
            
            setTours(mappedTours);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error loading tours');
        } finally {
            setLoading(false);
        }
    };


    // TODO: Poner el search funcional en components
    //
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleSearch = (term: string) => {
        setSearchTerm(term);
    };

    // Filter tours based on search term
    const filteredTours = tours.filter(tour =>
        tour.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.etiqueta.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        fetchTours();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const activeTours = tours.filter(tour => tour.activo !== false);

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            <SideBarAdmin/>
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 flex flex-col ml-72  ml-72 pt-20 px-8 min-h-0">
                    <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
                        {/* Fixed header section */}
                        <div className="flex-shrink-0">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h1 className="text-3xl font-bold mb-1 text-black mt-4">Gestión de Tours</h1>
                                    <p className="mb-8 text-verde3">
                                        Administra tours y experiencias
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Link href="/admin/tours/nuevo">
                                        <button className="bg-verde3 text-white px-4 py-2 rounded-lg hover:bg-verde2 transition justify-between items-center flex">
                                            <svg
                                                className="w-6 h-6 text-white mr-2"
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
                                                    d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                                />
                                            </svg>
                                            Nuevo Tour
                                        </button>
                                    </Link>
                                </div>
                            </div>
                            <div className="mb-6 flex space-x-4">
                                <Cuadro texto="Tours Totales" cantidad={tours.length} />
                                <Cuadro texto="Tours Activos" cantidad={activeTours.length} />
                            </div>
                            <div className="mb-6">
                                <SearchBarAdmin texto="Buscar tour..." />
                            </div>
                        </div>
                        
                        {/* Scrollable tours */}
                        <div className="flex-1 overflow-y-auto min-h-0">
                            {loading ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="text-verde3 text-lg">Cargando tours...</div>
                                </div>
                            ) : error ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="text-red-500 text-lg">{error}</div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6 p-6">
                                    {filteredTours.map((tour) => (
                                        <CardTourAdmin 
                                            key={tour.id}
                                            id={tour.id}
                                            nombre={tour.nombre}
                                            descripcion={tour.descripcion}
                                            precio={tour.precio}
                                            imagen={tour.imagen}
                                            capacidad={tour.capacidad}
                                            duracion={tour.duracion}
                                            etiqueta={tour.etiqueta}
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