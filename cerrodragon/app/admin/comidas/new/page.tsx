'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SideBarAdmin, TopBar } from "@/app/components";

export default function NuevoComidaFormPage() {
    const [nombre, setNombre] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!nombre.trim()) {
            setError('El nombre de la comida es requerido');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // TODO: Implementar la lógica para guardar la nueva comida
            // const response = await fetch('/api/comidas', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({ nombre: nombre.trim() }),
            // });

            // if (!response.ok) {
            //     throw new Error('Error al crear la comida');
            // }

            // Navigate back to management screen
            router.push('/admin/comidas/gestion');
        } catch (error) {
            setError('Error al guardar la comida. Por favor, intente nuevamente.');
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
                <main className="flex-1 flex flex-col ml-72  pt-20 px-8 min-h-0">
                    <div className="max-w-7xl mx-auto w-full flex flex-col">
                        {/* Fixed header section */}
                        <div className="flex-shrink-0">
                            <h1 className="text-3xl font-bold mb-1 text-black mt-4">Nueva Comida</h1>
                            <p className="mb-8 text-verde3">
                                Introduzca el nombre de la nueva comida
                            </p>
                        </div>
                        
                        {/* Form */}
                        <div className="flex-1 flex justify-start">
                            <form onSubmit={handleSubmit} className="min-w-full space-y-4">
                                <div>
                                    <label
                                    htmlFor="nombre"
                                    className="block mb-2.5 text-md font-medium text-black"
                                    >
                                        Nombre de la comida:
                                    </label>
                                    <input
                                    type="text"
                                    id="nombre"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    className="bg-tabla-header border border-borde1 text-verde1 text-sm 
                                    rounded-xl focus:ring-borde2 focus:border-borde2 block w-full px-3 py-2.5 
                                    shadow-xs placeholder:text-verde2 placeholder:font-medium placeholder:opacity-50"
                                    placeholder="Arroz con camarones"
                                    disabled={isLoading}
                                    />
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
                                                Agregar
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
