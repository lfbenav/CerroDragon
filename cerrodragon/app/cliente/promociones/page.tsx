'use client';
import { useState, useEffect } from "react";
import { CardPromocion, SearchBar, SideBarClient, TopBar } from "@/app/components";

const API_URL = "http://localhost:3000";

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

interface PromocionDisplay {
    id: number;
    nombre: string;
    descripcion: string;
    precioAntes: number;
    precioAhora: number;
    capacidad: number;
    descuento: number;
    duracion: string;
    etiqueta: string;
    imagen: string;
}

export default function Promociones() {
    const [promociones, setPromociones] = useState<PromocionDisplay[]>([]);
    const [filteredPromociones, setFilteredPromociones] = useState<PromocionDisplay[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPromociones = async () => {
            try {
                // Fetch active promotions
                const promoRes = await fetch(`${API_URL}/promotions?active_only=true`);
                if (!promoRes.ok) throw new Error('Error al cargar promociones');
                const promoJson = await promoRes.json();
                
                // Fetch all tours to get details
                const toursRes = await fetch(`${API_URL}/tours/allActive`);
                const toursJson = toursRes.ok ? await toursRes.json() : { data: [] };
                const toursMap = new Map<number, TourAPI>();
                toursJson.data.forEach((t: TourAPI) => toursMap.set(t.id, t));

                const mapped: PromocionDisplay[] = promoJson.data.map((p: PromocionAPI) => {
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
                        capacidad: tour?.max_persons || 10,
                        descuento: descuento > 1 ? Math.round((descuento / precioOriginal) * 100) : descuento,
                        duracion: tour 
                            ? (tour.duration_days > 0 
                                ? `${tour.duration_days} día${tour.duration_days > 1 ? 's' : ''}` 
                                : `${tour.duration_hours} hora${tour.duration_hours > 1 ? 's' : ''}`)
                            : '3 horas',
                        etiqueta: 'Todos',
                        imagen: tour?.image_url || '/tour1.png'
                    };
                });

                setPromociones(mapped);
                setFilteredPromociones(mapped);
            } catch (error) {
                console.error('Error cargando promociones:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPromociones();
    }, []);

    useEffect(() => {
        const q = search.toLowerCase();
        const filtered = promociones.filter(
            (p) =>
                p.nombre.toLowerCase().includes(q) ||
                p.descripcion.toLowerCase().includes(q)
        );
        setFilteredPromociones(filtered);
    }, [search, promociones]);

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            <SideBarClient />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 flex flex-col ml-72  pt-20 px-8 min-h-0">
                    <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
                        {/* Fixed header section */}
                        <div className="flex-shrink-0">
                            <h1 className="text-3xl font-bold mb-1 text-black mt-4">Promociones</h1>
                            <p className="mb-8 text-verde3">
                                Aproveche nuestras ofertas!
                            </p>
                            <div className="mb-6">
                                <SearchBar 
                                    texto="Buscar promoción..."
                                    value={search}
                                    onChange={setSearch}
                                />
                            </div>
                        </div>
                        
                        {/* Scrollable promociones */}
                        <div className="flex-1 overflow-y-auto min-h-0">
                            {loading ? (
                                <p className="text-verde3 mt-10">Cargando promociones...</p>
                            ) : filteredPromociones.length === 0 ? (
                                <p className="text-verde3 mt-10">No hay promociones disponibles</p>
                            ) : (
                                <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6 p-6">
                                    {filteredPromociones.map((promo) => (
                                        <CardPromocion 
                                            key={promo.id}
                                            id={promo.id}
                                            nombre={promo.nombre} 
                                            descripcion={promo.descripcion} 
                                            precioAntes={promo.precioAntes} 
                                            precioAhora={promo.precioAhora}
                                            capacidad={promo.capacidad}
                                            descuento={promo.descuento}
                                            duracion={promo.duracion}
                                            etiqueta={promo.etiqueta}
                                            imagen={promo.imagen} 
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