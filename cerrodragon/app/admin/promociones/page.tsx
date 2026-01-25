"use client";
import { useState, useEffect } from "react";
import { SideBarAdmin, TopBar, CardPromocionAdmin, SearchBarAdmin, Cuadro} from "../../components";
import Link from "next/link";

const API_URL = "http://localhost:3000";

interface Promocion {
    id: number;
    nombre: string;
    descripcion: string;
    precioAntes: number;
    precioAhora: number;
    descuento: number;
    imagen: string;
    capacidad: number;
    duracion: string;
    etiqueta: string;
    activo?: boolean;
}

interface PromocionAPI {
    id: number;
    tour_id: number;
    title: string;
    description: string;
    discount_value: number;
    starts_at: string | null;
    ends_at: string | null;
    is_active: boolean;
    created_at: string;
    tour_title: string;
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
}

export default function Promociones() {
    const [promociones, setPromociones] = useState<Promocion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchPromociones = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Fetch all promotions
            const promoRes = await fetch(`${API_URL}/promotions`);
            if (!promoRes.ok) throw new Error('Error al cargar promociones');
            const promoJson = await promoRes.json();
            
            // Fetch all tours to get details
            const toursRes = await fetch(`${API_URL}/tours/all`);
            const toursJson = toursRes.ok ? await toursRes.json() : { data: [] };
            const toursMap = new Map<number, TourAPI>();
            toursJson.data.forEach((t: TourAPI) => toursMap.set(t.id, t));

            const mapped: Promocion[] = promoJson.data.map((p: PromocionAPI) => {
                const tour = toursMap.get(p.tour_id);
                const precioOriginal = tour?.person_price || 100;
                const descuento = p.discount_value;
                const precioFinal = precioOriginal - descuento;
                
                return {
                    id: p.id,
                    nombre: `${p.title} - ${p.tour_title}`,
                    descripcion: p.description || tour?.description || '',
                    precioAntes: precioOriginal,
                    precioAhora: precioFinal > 0 ? precioFinal : precioOriginal * (1 - descuento/100),
                    descuento: descuento > 1 ? Math.round((descuento / precioOriginal) * 100) : descuento,
                    imagen: tour?.image_url || '/tour1.png',
                    capacidad: tour?.max_persons || 10,
                    duracion: tour 
                        ? (tour.duration_days > 0 
                            ? `${tour.duration_days} día${tour.duration_days > 1 ? 's' : ''}` 
                            : `${tour.duration_hours} hora${tour.duration_hours > 1 ? 's' : ''}`)
                        : '3 horas',
                    etiqueta: 'Todos',
                    activo: p.is_active
                };
            });

            setPromociones(mapped);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error loading promociones');
        } finally {
            setLoading(false);
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleSearch = (term: string) => {
        setSearchTerm(term);
    };

    // Filter promociones based on search term
    const filteredPromociones = promociones.filter(promocion =>
        promocion.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        promocion.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        promocion.etiqueta.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        fetchPromociones();
    }, []);

    const activePromociones = promociones.filter(promocion => promocion.activo !== false);

    const handleDeletePromocion = async (id: number) => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`${API_URL}/promotions/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                setPromociones(prev => prev.filter(promocion => promocion.id !== id));
            } else {
                throw new Error('Error al eliminar promoción');
            }
        } catch (error) {
            console.error('Error deleting promotion:', error);
            setError('Error al eliminar la promoción. Inténtalo de nuevo.');
            setTimeout(() => setError(null), 3000);
        }
    };

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
                                    <h1 className="text-3xl font-bold mb-1 text-black mt-4">Gestión de Promociones</h1>
                                    <p className="mb-8 text-verde3">
                                        Administra promociones y descuentos especiales
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Link href="/admin/promociones/new">
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
                                            Nueva Promoción
                                        </button>
                                    </Link>
                                </div>
                            </div>
                            <div className="mb-6 gap-4 flex space-x-4">
                                <Cuadro texto="Promociones Totales" cantidad={promociones.length} />
                                <Cuadro texto="Promociones Activas" cantidad={activePromociones.length} />
                                <Cuadro texto="Promociones Inactivas" cantidad={promociones.length - activePromociones.length} />
                            </div>
                            <div className="mb-6">
                                <SearchBarAdmin texto="Buscar promoción..." />
                            </div>
                        </div>
                        
                        {/* Scrollable promociones */}
                        <div className="flex-1 overflow-y-auto min-h-0">
                            {loading ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="text-verde3 text-lg">Cargando promociones...</div>
                                </div>
                            ) : error ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="text-red-500 text-lg">{error}</div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6 p-6">
                                    {filteredPromociones.map((promocion) => (
                                        <CardPromocionAdmin 
                                            key={promocion.id}
                                            id={promocion.id}
                                            nombre={promocion.nombre}
                                            descripcion={promocion.descripcion}
                                            precioAntes={promocion.precioAntes}
                                            precioAhora={promocion.precioAhora}
                                            descuento={promocion.descuento}
                                            imagen={promocion.imagen}
                                            capacidad={promocion.capacidad}
                                            duracion={promocion.duracion}
                                            etiqueta={promocion.etiqueta}
                                            onDelete={() => handleDeletePromocion(promocion.id)}
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