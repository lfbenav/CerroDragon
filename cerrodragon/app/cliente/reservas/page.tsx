"use client";
import { useState, useEffect, useCallback } from "react";
import { SideBarClient, TopBar, TablaReservas, WhatsAppButton } from "@/app/components";

const API_URL = "http://localhost:3000";

interface ReservaAPI {
    id: string;
    customer_id: string;
    tour_id: string;
    tour_date: string;
    persons: number;
    total_usd: number;
    status: string;
    tour_title: string;
}

interface ReservaDisplay {
    id: string;
    rawId: string;
    clienteNombre: string;
    clienteEmail: string;
    tour: string;
    monto: number;
    fecha: string;
    personas: number;
    estado: "confirmada" | "pendiente" | "reembolsada" | "cancelada" | "solicitado";
}

export default function Reservas() {
    const [reservas, setReservas] = useState<ReservaDisplay[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchReservas = useCallback(async () => {
        try {
            const token = localStorage.getItem('access_token');
            const res = await fetch(`${API_URL}/my-reservations`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (res.ok) {
                const json = await res.json();
                const userData = JSON.parse(localStorage.getItem('user') || '{}');
                
                const mapped: ReservaDisplay[] = json.data.map((r: ReservaAPI) => ({
                    id: `RV-${r.id.substring(0, 8)}`,
                    rawId: r.id,
                    clienteNombre: userData.full_name || 'Usuario',
                    clienteEmail: userData.email || '',
                    tour: r.tour_title,
                    monto: r.total_usd,
                    fecha: new Date(r.tour_date).toLocaleDateString('es-CR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    }),
                    personas: r.persons,
                    estado: r.status === 'CONFIRMED' ? 'confirmada' 
                          : r.status === 'CANCELLED' ? 'cancelada'
                          : r.status === 'REFUNDED' ? 'reembolsada'
                          : r.status === 'REFUND_REQUESTED' ? 'solicitado'
                          : 'pendiente'
                }));
                
                setReservas(mapped);
            }
        } catch (error) {
            console.error('Error cargando reservas:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReservas();
    }, [fetchReservas]);

    const handleRefundRequested = () => {
        // Recargar las reservas para mostrar el nuevo estado
        fetchReservas();
    };

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            <SideBarClient />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 flex flex-col ml-72  pt-20 px-8 min-h-0"> 
                    <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
                        <div className="flex-shrink-0 mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h1 className="text-3xl font-bold mb-1 text-black">Mis Reservas</h1>
                                    <p className="text-verde3">
                                        Revise todas sus reservas y solicite reembolsos si es necesario
                                    </p>
                                </div>
                                <WhatsAppButton />
                            </div>
                            <hr className="border-1 border-borde1 w-full" />
                        </div>
                        
                        {loading ? (
                            <p className="text-verde3">Cargando reservas...</p>
                        ) : reservas.length === 0 ? (
                            <p className="text-verde3">No tienes reservas aún</p>
                        ) : (
                            <TablaReservas reservas={reservas} onRefundRequested={handleRefundRequested} />
                        )}
                    </div>
                    
                </main>
            </div>
        </div>
    );
}