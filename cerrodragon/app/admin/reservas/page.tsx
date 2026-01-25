"use client";
import { useState, useEffect } from "react";
import { TopBar, SideBarAdmin, Cuadro, SearchBar, TablaGestionReservas } from "@/app/components";

const API_URL = "http://localhost:3000";

interface ReservaAPI {
    id: number;
    customer_id: number;
    tour_id: number;
    tour_date: string;
    persons: number;
    total_usd: number;
    status: string;
    tour_title: string;
}

interface GuiaAPI {
    id: number;
    full_name: string;
    phone: string;
    is_active: boolean;
}

interface ReservaDisplay {
    id: string;
    clienteNombre: string;
    clienteEmail: string;
    tour: string;
    monto: number;
    fecha: string;
    personas: number;
    guiaAsignado: string;
    estado: "confirmada" | "pendiente" | "reembolsada" | "cancelada";
}

interface GuiaDisplay {
    id: string;
    nombre: string;
}

export default function Reservas() {
    const [reservas, setReservas] = useState<ReservaDisplay[]>([]);
    const [guias, setGuias] = useState<GuiaDisplay[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('access_token');
                
                // Fetch reservations
                const resReservas = await fetch(`${API_URL}/reservations`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (resReservas.ok) {
                    const jsonReservas = await resReservas.json();
                    
                    const mappedReservas: ReservaDisplay[] = jsonReservas.data.map((r: ReservaAPI) => ({
                        id: `RV-${r.id}`,
                        clienteNombre: `Cliente #${r.customer_id}`,
                        clienteEmail: '',
                        tour: r.tour_title,
                        monto: r.total_usd,
                        fecha: new Date(r.tour_date).toLocaleDateString('es-CR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        }),
                        personas: r.persons,
                        guiaAsignado: '',
                        estado: r.status === 'CONFIRMED' ? 'confirmada' 
                              : r.status === 'CANCELLED' ? 'cancelada'
                              : r.status === 'REFUNDED' ? 'reembolsada'
                              : 'pendiente'
                    }));
                    
                    setReservas(mappedReservas);
                }

                // Fetch guides (if endpoint exists)
                try {
                    const resGuias = await fetch(`${API_URL}/guides`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    
                    if (resGuias.ok) {
                        const jsonGuias = await resGuias.json();
                        const mappedGuias: GuiaDisplay[] = jsonGuias.data
                            .filter((g: GuiaAPI) => g.is_active)
                            .map((g: GuiaAPI) => ({
                                id: `G-${g.id}`,
                                nombre: g.full_name
                            }));
                        setGuias(mappedGuias);
                    }
                } catch {
                    // Guides endpoint may not exist, use empty array
                    setGuias([]);
                }
                
            } catch (error) {
                console.error('Error cargando datos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredReservas = reservas.filter(r => 
        r.clienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.tour.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const confirmadas = reservas.filter(r => r.estado === 'confirmada').length;
    const pendientes = reservas.filter(r => r.estado === 'pendiente').length;

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            <SideBarAdmin />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 flex flex-col ml-72  pt-20 px-8 min-h-0"> 
                    <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
                        <div className="flex-shrink-0 mb-6">
                            <h1 className="text-3xl font-bold mb-1 text-black">Gestión de Reservas</h1>
                            <p className="text-verde3 mb-6">
                                Revise todas las reservas y asigne a los guías correspondientes
                            </p>
                            <hr className="border-1 border-borde1 w-full" />
                        </div>
                        <div className="justify-center items-center flex gap-12 mb-4">
                            <Cuadro texto="Total de Reservas" cantidad={reservas.length} />
                            <Cuadro texto="Reservas Confirmadas" cantidad={confirmadas} />
                            <Cuadro texto="Reservas Pendientes" cantidad={pendientes} />
                        </div>
                        <SearchBar 
                            texto="Buscar reservas..." 
                            value={searchTerm}
                            onChange={setSearchTerm}
                        />
                        {loading ? (
                            <p className="text-verde3 mt-4">Cargando reservas...</p>
                        ) : (
                            <TablaGestionReservas reservas={filteredReservas} guias={guias} />
                        )}
                    </div>
                    
                </main>
            </div>
        </div>
    );
}