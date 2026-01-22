'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SideBarAdmin, TopBar } from "@/app/components";

export default function NuevoPaquete() {
    const searchParams = useSearchParams();
    const tourId = searchParams.get('tourId');
    const [descripcion, setDescripcion] = useState('');
    const [precio, setPrecio] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

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
            // TODO: Implementar la lógica para guardar el nuevo paquete
            // const response = await fetch('/api/paquetes', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({
            //         tourId: tourId,
            //         descripcion: descripcion.trim(),
            //         precio: parseFloat(precio),
            //     }),
            // });

            // if (!response.ok) {
            //     throw new Error('Error al crear el paquete');
            // }

            // Navigate back to tour info screen
            router.push(`/admin/tours/info?id=${tourId}`);
        } catch (error) {
            setError('Error al guardar el paquete. Por favor, intente nuevamente.');
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
                <main className="flex-1 flex flex-col ml-72 pt-20 px-8 min-h-0">
                    <div className="max-w-4xl mx-auto w-full flex flex-col">
                        {/* Fixed header section */}
                        <div className="flex-shrink-0">
                            <h1 className="text-3xl font-bold mb-1 text-black mt-4">Nuevo Paquete</h1>
                            <p className="mb-8 text-verde3">
                                Complete la información
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
                                                        d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                                                    />
                                                </svg>
                                                Guardar
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
