'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SideBarAdmin, TopBar } from "@/app/components";

const API_URL = "http://localhost:3000";

export default function EditarPaquete() {
    const searchParams = useSearchParams();
    const tourId = searchParams.get('tourId');
    const paqueteId = searchParams.get('paqueteId');
    const [descripcion, setDescripcion] = useState('');
    const [precio, setPrecio] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchPaquete = async () => {
            if (!paqueteId) return;
            
            try {
                setLoadingData(true);
                const response = await fetch(`${API_URL}/tour-packages?tour_id=${tourId}`);
                if (!response.ok) throw new Error('Error al cargar el paquete');
                const json = await response.json();
                
                // Find the specific package
                const paquete = json.data.find((p: { id: string }) => p.id === paqueteId);
                if (paquete) {
                    setDescripcion(paquete.name || '');
                    setPrecio(String(paquete.price_usd || ''));
                }
            } catch (error) {
                console.error('Error:', error);
                setError('Error al cargar el paquete');
            } finally {
                setLoadingData(false);
            }
        };
        
        fetchPaquete();
    }, [paqueteId, tourId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!descripcion.trim()) {
            setError('La descripción del paquete es requerida');
            return;
        }

        if (!precio || parseFloat(precio) <= 0) {
            setError('El precio debe ser mayor a 0');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`${API_URL}/tour-packages/${paqueteId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: descripcion.trim(),
                    price_usd: parseFloat(precio),
                }),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el paquete');
            }

            router.push(`/admin/tours/info?id=${tourId}`);
        } catch (error) {
            setError('Error al actualizar el paquete. Por favor, intente nuevamente.');
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (loadingData) {
        return (
            <div className="h-screen bg-gray-50 flex overflow-hidden">
                <SideBarAdmin />
                <div className="flex-1 flex flex-col">
                    <TopBar />
                    <main className="flex-1 flex items-center justify-center ml-72 pt-20">
                        <p className="text-verde3 text-lg">Cargando paquete...</p>
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
                    <div className="max-w-4xl mx-auto w-full flex flex-col">
                        {/* Fixed header section */}
                        <div className="flex-shrink-0">
                            <h1 className="text-3xl font-bold mb-1 text-black mt-4">Editar Paquete</h1>
                            <p className="mb-8 text-verde3">
                                Modifique la información del paquete
                            </p>
                        </div>
                        
                        {/* Form */}
                        <div className="flex-1 overflow-y-auto">
                            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                                <div>
                                    <label
                                        htmlFor="descripcion"
                                        className="block mb-2.5 text-md font-medium text-black"
                                    >
                                        Descripción del paquete
                                    </label>
                                    <textarea
                                        id="descripcion"
                                        value={descripcion}
                                        onChange={(e) => setDescripcion(e.target.value)}
                                        rows={6}
                                        className="bg-tabla-header border border-borde1 text-verde1 text-sm 
                                        rounded-xl focus:ring-borde2 focus:border-borde2 block w-full px-3 py-2.5 
                                        shadow-xs placeholder:text-verde2 placeholder:font-medium placeholder:opacity-50 resize-none"
                                        placeholder="ej. incluye:&#10;• Alimentación&#10;• Guía"
                                        disabled={isLoading}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="precio"
                                        className="block mb-2.5 text-md font-medium text-black"
                                    >
                                        Precio: $
                                    </label>
                                    <input
                                        type="number"
                                        id="precio"
                                        value={precio}
                                        onChange={(e) => setPrecio(e.target.value)}
                                        className="bg-tabla-header border border-borde1 text-verde1 text-sm 
                                        rounded-xl focus:ring-borde2 focus:border-borde2 block w-48 px-3 py-2.5 
                                        shadow-xs placeholder:text-verde2 placeholder:font-medium placeholder:opacity-50"
                                        placeholder="00000000"
                                        disabled={isLoading}
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                
                                {error && (
                                    <div className="text-red-500 text-sm font-medium">
                                        {error}
                                    </div>
                                )}
                                
                                <div className="flex justify-end space-x-4 pb-8 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => router.push(`/admin/tours/info?id=${tourId}`)}
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
                                                    className="w-5 h-5"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                                Confirmar
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
