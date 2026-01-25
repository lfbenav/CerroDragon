'use client';
import { CuadroTexto, SideBarAdmin, TopBar } from "@/app/components";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const API_URL = "http://localhost:3000";

interface ReservaData {
    id: string;
    clienteNombre: string;
    clienteEmail: string;
    tour: string;
    fecha: string;
    personas: number;
    monto: number;
    precioPorPersona: number;
    estado: 'confirmada' | 'pendiente' | 'cancelada' | 'reembolsada';
}

interface ReservaAPI {
    id: number;
    customer_id: number;
    tour_id: number;
    tour_date: string;
    persons: number;
    total_usd: number;
    subtotal_usd: number;
    status: string;
    tour_title: string;
}

export default function EditarReservas() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const reservaId = searchParams.get('id');

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Estados del formulario
    const [reserva, setReserva] = useState<ReservaData | null>(null);
    const [estado, setEstado] = useState<'confirmada' | 'pendiente' | 'cancelada' | 'reembolsada'>('pendiente');

    // Cargar datos iniciales
    useEffect(() => {
        if (!reservaId) {
            setError('ID de reserva no válido');
            setLoading(false);
            return;
        }

        const cargarDatos = async () => {
            try {
                setLoading(true);
                setError(null);

                // Extract numeric ID from "RV-123" format
                const numericId = reservaId.replace('RV-', '');
                
                const token = localStorage.getItem('access_token');
                const response = await fetch(`${API_URL}/reservations/${numericId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (!response.ok) throw new Error('Error al cargar datos');
                
                const json = await response.json();
                const r: ReservaAPI = json.data;

                const reservaData: ReservaData = {
                    id: reservaId,
                    clienteNombre: `Cliente #${r.customer_id}`,
                    clienteEmail: '',
                    tour: r.tour_title,
                    fecha: new Date(r.tour_date).toLocaleDateString('es-CR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    }),
                    personas: r.persons,
                    monto: r.total_usd,
                    precioPorPersona: r.persons > 0 ? Math.round(r.subtotal_usd / r.persons) : 0,
                    estado: r.status === 'CONFIRMED' ? 'confirmada' 
                          : r.status === 'CANCELLED' ? 'cancelada'
                          : r.status === 'REFUNDED' ? 'reembolsada'
                          : 'pendiente'
                };

                setReserva(reservaData);
                setEstado(reservaData.estado);

            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error desconocido');
                console.error('Error cargando datos:', err);
            } finally {
                setLoading(false);
            }
        };

        cargarDatos();
    }, [reservaId]);

    const handleEstadoChange = (nuevoEstado: 'confirmada' | 'pendiente' | 'cancelada' | 'reembolsada') => {
        setEstado(nuevoEstado);
    };

    const handleGuardar = async () => {
        if (!reserva) return;

        try {
            setSaving(true);
            setError(null);

            const numericId = reserva.id.replace('RV-', '');
            const token = localStorage.getItem('access_token');
            
            // Map status to API format
            const statusMap: Record<string, string> = {
                'confirmada': 'CONFIRMED',
                'pendiente': 'PENDING',
                'cancelada': 'CANCELLED',
                'reembolsada': 'REFUNDED'
            };

            const response = await fetch(`${API_URL}/reservations/${numericId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    status: statusMap[estado]
                })
            });

            if (!response.ok) {
                throw new Error('Error al actualizar la reserva');
            }

            router.push('/admin/reservas');
            
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al guardar');
            console.error('Error guardando:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleCancelar = () => {
        router.push('/admin/reservas');
    };

    if (loading) {
        return (
            <div className="h-screen bg-gray-50 flex overflow-hidden">
                <SideBarAdmin />
                <div className="flex-1 flex flex-col">
                    <TopBar />
                    <main className="flex-1 flex items-center justify-center ml-72 pt-20">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-verde3 mx-auto mb-4"></div>
                            <p className="text-verde3">Cargando información de la reserva...</p>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    if (error || !reserva) {
        return (
            <div className="h-screen bg-gray-50 flex overflow-hidden">
                <SideBarAdmin />
                <div className="flex-1 flex flex-col">
                    <TopBar />
                    <main className="flex-1 flex items-center justify-center ml-72 pt-20">
                        <div className="text-center">
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                {error || 'No se pudo cargar la información de la reserva'}
                            </div>
                            <button
                                onClick={handleCancelar}
                                className="px-4 py-2 bg-verde2 text-white rounded-lg hover:bg-verde3"
                            >
                                Volver a Reservas
                            </button>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            <SideBarAdmin />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 flex flex-col ml-72 pt-20 px-8 min-h-0">
                    <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
                        <div className="flex-shrink-0">
                            <h1 className="text-3xl font-bold mb-1 text-black mt-4">
                                Editar reserva #{reserva.id}
                            </h1>
                            <p className="mb-4 text-verde3">
                                Edite los detalles de la reserva aquí
                            </p>
                            <hr className="border-1 border-borde1 mt-2 w-full mb-6" />
                        </div>

                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                {error}
                            </div>
                        )}

                        <p className="text-verde1 mb-4">Información de la reserva:</p>
                        
                        <div className="grid grid-row-2 grid-col-2 gap-4 mb-6">
                            <div className="items-center justify-start flex flex-row gap-4">
                                <CuadroTexto texto={reserva.clienteNombre} titulo="Cliente" />
                                <CuadroTexto texto={reserva.tour} titulo="Tour" />
                            </div>
                            <div className="items-center justify-start flex flex-row gap-4">
                                <CuadroTexto texto={reserva.fecha} titulo="Fecha" />
                                <CuadroTexto texto={reserva.precioPorPersona.toLocaleString()} titulo="Precio por persona" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-6">
                            {/* Estado de la reserva */}
                            <div>
                                <label className="block mb-2 text-sm font-medium text-verde1">
                                    Estado de la reserva:
                                </label>
                                <select
                                    id="estado-reserva"
                                    value={estado}
                                    onChange={(e) => handleEstadoChange(e.target.value as typeof estado)}
                                    className="block w-full px-3 py-2.5 bg-beigeclaro border border-verde3 text-verde1 text-sm rounded-lg focus:ring-verde3 focus:border-verde3 shadow-sm"
                                    disabled={saving}
                                >
                                    <option value="confirmada">Confirmada</option>
                                    <option value="pendiente">Pendiente</option>
                                    <option value="cancelada">Cancelada</option>
                                    <option value="reembolsada">Reembolsada</option>
                                </select>
                            </div>
                        </div>

                        <p className="text-verde1 mb-6">
                            Cantidad de personas: 
                            <span className="ml-4 font-bold text-xl text-rojosuave">{reserva.personas}</span>
                        </p>

                        <p className="text-verde1 mb-8 text-xl font-bold">
                            Monto total: 
                            <span className="ml-4 font-bold text-4xl text-verde3">₡{reserva.monto.toLocaleString()}</span>
                        </p>

                        {/* Botones de acción */}
                        <div className="flex gap-4 mb-8">
                            <button
                                onClick={handleGuardar}
                                disabled={saving}
                                className="px-4 py-2 bg-verde2 text-white rounded-lg hover:bg-verde3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                
                                {saving ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                ): (
                                    <svg
                                        className="w-6 h-6 text-gray-800 dark:text-white"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={24}
                                        height={24}
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm13.707-1.293a1 1 0 0 0-1.414-1.414L11 12.586l-1.793-1.793a1 1 0 0 0-1.414 1.414l2.5 2.5a1 1 0 0 0 1.414 0l4-4Z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                )}
                                {saving ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                            
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="text-verde3 bg-white hover:bg-gray-50 font-medium rounded-xl text-md px-4 py-2 text-center border border-verde3"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}