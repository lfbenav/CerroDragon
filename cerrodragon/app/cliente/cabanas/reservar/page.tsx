'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SideBarClient, TopBar } from "@/app/components";

export default function ReservarAlojamiento() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const cabanaId = searchParams.get('id');
    
    const [cliente] = useState('Carlos Alvarado');
    const [nombreCabana] = useState('Cabaña del Dragón');
    const [fechaInicio, setFechaInicio] = useState('10/01/2026');
    const [fechaFin, setFechaFin] = useState('11/01/2026');
    const [precioPorNoche] = useState(5000);
    const [cantidadPersonas, setCantidadPersonas] = useState(1);
    const [montoFinal, setMontoFinal] = useState(5000);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // TODO: Cargar datos de la cabaña y usuario según cabanaId
        // Calcular número de noches entre fechas
        const calcularMontoFinal = () => {
            // Simple cálculo por ahora, puedes mejorarlo para calcular días reales
            const noches = 1; // TODO: calcular noches basado en fechas
            const total = precioPorNoche * cantidadPersonas * noches;
            setMontoFinal(total);
        };
        calcularMontoFinal();
    }, [cantidadPersonas, precioPorNoche]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (cantidadPersonas <= 0) {
            setError('La cantidad de personas debe ser mayor a 0');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // TODO: Implementar la lógica para crear la reserva
            // const response = await fetch('/api/reservas', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({
            //         cabanaId,
            //         fechaInicio,
            //         fechaFin,
            //         cantidadPersonas,
            //         montoFinal,
            //     }),
            // });

            // if (!response.ok) {
            //     throw new Error('Error al crear la reserva');
            // }

            // Navigate to reservations or confirmation page
            router.push('/cliente/reservas');
        } catch (error) {
            setError('Error al realizar la reserva. Por favor, intente nuevamente.');
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            <SideBarClient />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 flex flex-col ml-72 pt-20 px-8 min-h-0">
                    <div className="max-w-4xl mx-auto w-full flex flex-col">
                        {/* Fixed header section */}
                        <div className="flex-shrink-0">
                            <h1 className="text-3xl font-bold mb-1 text-black mt-4">Reservar Alojamiento</h1>
                            <p className="mb-8 text-verde3">
                                Reserve una cabina para su estadía en Cerro Dragón
                            </p>
                        </div>
                        
                        {/* Form */}
                        <div className="flex-1 overflow-y-auto">
                            <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block mb-2.5 text-md font-medium text-black">
                                            Cliente
                                        </label>
                                        <div className="bg-tabla-header border border-borde1 text-verde1 text-sm 
                                            rounded-xl block w-full px-3 py-2.5 shadow-xs">
                                            {cliente}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block mb-2.5 text-md font-medium text-black">
                                            Cabaña
                                        </label>
                                        <div className="bg-tabla-header border border-borde1 text-verde1 text-sm 
                                            rounded-xl block w-full px-3 py-2.5 shadow-xs">
                                            {nombreCabana}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label
                                            htmlFor="fechaInicio"
                                            className="block mb-2.5 text-md font-medium text-black"
                                        >
                                            Fechas de su estadía
                                        </label>
                                        <input
                                            type="text"
                                            id="fechaInicio"
                                            value={`${fechaInicio} al ${fechaFin}`}
                                            onChange={(e) => {
                                                // TODO: Implementar selector de fechas apropiado
                                                setFechaInicio(e.target.value);
                                            }}
                                            className="bg-tabla-header border border-borde1 text-verde1 text-sm 
                                            rounded-xl focus:ring-borde2 focus:border-borde2 block w-full px-3 py-2.5 
                                            shadow-xs"
                                            disabled={isLoading}
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-2.5 text-md font-medium text-black">
                                            Precio por persona por noche
                                        </label>
                                        <div className="bg-tabla-header border border-borde1 text-amarillo text-lg font-semibold
                                            rounded-xl block w-full px-3 py-2.5 shadow-xs">
                                            ₡ {precioPorNoche.toLocaleString()}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="cantidadPersonas"
                                        className="block mb-2.5 text-md font-medium text-black"
                                    >
                                        Cantidad personas:
                                    </label>
                                    <input
                                        type="number"
                                        id="cantidadPersonas"
                                        value={cantidadPersonas}
                                        onChange={(e) => setCantidadPersonas(parseInt(e.target.value) || 0)}
                                        className="bg-tabla-header border border-borde1 text-verde1 text-sm 
                                        rounded-xl focus:ring-borde2 focus:border-borde2 block w-32 px-3 py-2.5 
                                        shadow-xs"
                                        disabled={isLoading}
                                        min="1"
                                    />
                                </div>

                                <div className="bg-beige1 border border-borde1 rounded-xl p-6 shadow-sm">
                                    <label className="block mb-2.5 text-lg font-semibold text-verde3">
                                        Monto Final
                                    </label>
                                    <div className="text-4xl font-bold text-verde3">
                                        ₡ {montoFinal.toLocaleString()}
                                    </div>
                                </div>
                                
                                {error && (
                                    <div className="text-red-500 text-sm font-medium">
                                        {error}
                                    </div>
                                )}
                                
                                <div className="flex justify-center pb-8 pt-4">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="text-white bg-verde3 hover:bg-verde2 font-medium rounded-xl 
                                        text-md px-8 py-3 text-center flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {isLoading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Procesando...
                                            </>
                                        ) : (
                                            <>
                                                <svg
                                                    className="w-6 h-6 text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                                    />
                                                </svg>
                                                Reservar
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
