'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SideBarAdmin, TopBar } from "@/app/components";

interface CuponData {
    codigo: string;
    limite: number;
    descuento: number;
}

export default function NuevoCupon() {
    const [codigo, setCodigo] = useState('');
    const [limite, setLimite] = useState('');
    const [descuento, setDescuento] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!codigo.trim() || !descuento.trim() || !limite.trim()) {
            setError('Complete toda la información requerida.');
            return;
        }

        if (isNaN(Number(limite)) || Number(limite) <= 0) {
            setError('El límite debe ser un número válido mayor a 0.');
            return;
        }

        if (isNaN(Number(descuento)) || Number(descuento) <= 0 || Number(descuento) > 100) {
            setError('El descuento debe ser un número entre 1 y 100.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const cuponData: CuponData = {
                codigo: codigo.trim(),
                limite: Number(limite),
                descuento: Number(descuento)
            };

            // TODO: Implementar la lógica para guardar el nuevo cupón
            // const response = await fetch('/api/cupones', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(cuponData),
            // });

            // if (!response.ok) {
            //     throw new Error('Error al crear el cupón');
            // }

            router.push('/admin/cupones');
        } catch (error) {
            setError('Error al guardar el cupón. Por favor, intente nuevamente.');
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDescuentoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace('%', '');
        if (value === '' || /^\d+$/.test(value)) {
            if (value === '' || (Number(value) >= 0 && Number(value) <= 100)) {
                setDescuento(value);
            }
        }
    };

    const handleLimiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '' || /^\d+$/.test(value)) {
            setLimite(value);
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
                            <h1 className="text-3xl font-bold mb-1 text-black mt-4">Nuevo Cupón</h1>
                            <p className="mb-8 text-verde3">
                                Complete la información que se solicita
                            </p>
                        </div>
                        
                        {/* Form */}
                        <div className="flex-1 flex justify-start">
                            <form onSubmit={handleSubmit} className="min-w-full space-y-4">
                                <div>
                                    <label
                                    htmlFor="codigo"
                                    className="block mb-2.5 text-md font-medium text-black"
                                    >
                                        Código asociado al cupón:
                                    </label>
                                    <input
                                        type="text"
                                        id="codigo"
                                        value={codigo}
                                        onChange={(e) => setCodigo(e.target.value)}
                                        className="bg-tabla-header border border-borde1 text-verde1 text-sm 
                                        rounded-xl focus:ring-borde2 focus:border-borde2 block w-180 px-3 py-2.5 
                                        shadow-xs placeholder:text-verde2 placeholder:font-medium placeholder:opacity-50 mb-4"
                                        placeholder="ABC-123"
                                        disabled={isLoading}
                                    />
                                    <label
                                    htmlFor="limite"
                                    className="block mb-2.5 text-md font-medium text-black"
                                    >
                                        Límite de canjes:
                                    </label>
                                    <input
                                        type="text"
                                        id="limite"
                                        value={limite}
                                        onChange={handleLimiteChange}
                                        className="bg-tabla-header border border-borde1 text-verde1 text-sm 
                                        rounded-xl focus:ring-borde2 focus:border-borde2 block w-180 px-3 py-2.5 
                                        shadow-xs placeholder:text-verde2 placeholder:font-medium placeholder:opacity-50 mb-4"
                                        placeholder="100"
                                        disabled={isLoading}
                                    />
                                    <label
                                    htmlFor="descuento"
                                    className="block mb-2.5 text-md font-medium text-black"
                                    >
                                        Descuento:
                                    </label>
                                    <input
                                        type="text"
                                        id="descuento"
                                        value={descuento ? `${descuento}%` : ''}
                                        onChange={handleDescuentoChange}
                                        className="bg-tabla-header border border-borde1 text-verde1 text-sm 
                                        rounded-xl focus:ring-borde2 focus:border-borde2 block w-15 px-3 py-2.5 
                                        shadow-xs placeholder:text-verde2 placeholder:font-medium placeholder:opacity-50 mb-4"
                                        placeholder="00%"
                                        disabled={isLoading}
                                    />
                                </div>
                                
                                {error && (
                                    <div className="text-red-500 text-sm font-medium">
                                        {error}
                                    </div>
                                )}
                                
                                <div className="flex justify-end space-x-4 w-180">
                                    <button
                                    type="button"
                                    onClick={() => router.push('/admin/cupones')}
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
