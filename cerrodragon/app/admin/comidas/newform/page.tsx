'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SideBarAdmin, TopBar } from "@/app/components";

interface Reserva {
    id: string;
    codigo: string;
}

export default function NuevoComidaForm() {
    const [reservaSeleccionada, setReservaSeleccionada] = useState('');
    const [reservas, setReservas] = useState<Reserva[]>([]);
    const [isLoadingReservas, setIsLoadingReservas] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const loadReservas = async () => {
            try {
                // TODO: Replace with actual API call when backend is ready
                // const response = await fetch('/api/reservas');
                // const data = await response.json();
                // setReservas(data);
                
                // mock data TEMPORAL - quitar cuando ya se conecte al backend
                setTimeout(() => {
                    setReservas([
                        { id: '01', codigo: 'RV-500' },
                        { id: '02', codigo: 'RV-501' },
                        { id: '03', codigo: 'RV-502' }
                    ]);
                    setIsLoadingReservas(false);
                }, 1000);
            } catch (error) {
                console.error('Error loading reservas:', error);
                setError('Error al cargar las reservas');
                setIsLoadingReservas(false);
            }
        };

        loadReservas();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!reservaSeleccionada) {
            setError('Debe seleccionar una reserva');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // TODO: Implementar la lógica para generar código de alimentación
            // const response = await fetch('/api/formularios-alimentacion', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({ reservaId: reservaSeleccionada }),
            // });

            // if (!response.ok) {
            //     throw new Error('Error al generar código de alimentación');
            // }

            // Navigate back to management screen
            router.push('/admin/comidas');
        } catch (error) {
            setError('Error al generar el código. Por favor, intente nuevamente.');
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            <SideBarAdmin />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 flex flex-col pt-20 px-8 min-h-0">
                    <div className="max-w-7xl mx-auto w-full flex flex-col">
                        {/* Fixed header section */}
                        <div className="flex-shrink-0">
                            <h1 className="text-3xl font-bold mb-1 text-black mt-4">Nuevo Formulario de Alimentación</h1>
                            <p className="mb-8 text-verde3">
                                Complete la Información
                            </p>
                        </div>
                        
                        {/* Form */}
                        <div className="flex-1 flex justify-start">
                            <form onSubmit={handleSubmit} className="min-w-full space-y-4">
                                <div>
                                    <label
                                        htmlFor="reserva"
                                        className="block mb-2.5 text-md font-medium text-black"
                                    >
                                        Seleccione la reserva asociada
                                    </label>
                                    <select
                                        id="reserva"
                                        value={reservaSeleccionada}
                                        onChange={(e) => setReservaSeleccionada(e.target.value)}
                                        className="block w-90 px-3 py-2.5 bg-tabla-header placeholder:opacity-50 border border-verde1 text-verde1 text-sm rounded-base focus:ring-verde1 focus:border-verde1 shadow-xs placeholder:text-verde3"
                                        disabled={isLoadingReservas || isLoading}
                                    >
                                        <option value="">
                                            {isLoadingReservas ? 'Cargando reservas...' : 'Seleccione la reserva...'}
                                        </option>
                                        {reservas.map((reserva) => (
                                            <option key={reserva.id} value={reserva.id}>
                                                {reserva.codigo}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                {error && (
                                    <div className="text-red-500 text-sm font-medium">
                                        {error}
                                    </div>
                                )}
                                
                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => router.push('/admin/comidas')}
                                        className="mt-1 text-verde3 bg-white hover:bg-gray-50 font-medium rounded-xl 
                                        text-md px-5 py-2.5 text-center border border-verde3"
                                        disabled={isLoading}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="mt-1 text-white bg-verde3 hover:bg-verde2 font-medium rounded-xl 
                                        text-md px-5 py-2.5 text-center flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {isLoading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Guardando...
                                            </>
                                        ) : (
                                            <>
                                                <svg
                                                    className="w-6 h-6 text-white dark:text-white"
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
                                                Generar código de alimentación
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
