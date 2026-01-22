'use client';
import { CardPaquetePromo, SideBarAdmin, TopBar, ConfirmModal } from "@/app/components";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

interface PromocionData {
    id: number;
    nombre: string;
    descripcion: string;
    duracion: string;
    capacidad: number;
    descuento: number;
    etiqueta: string;
    imagen: string;
    activa: boolean;
    paquete: {
        nombre: string;
        descripcion: string;
        precioAntes: number;
        precioAhora: number;
    };
}

export default function InfoPromocion() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    
    const [promocionData, setPromocionData] = useState<PromocionData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pendingAction, setPendingAction] = useState<'activar' | 'desactivar' | null>(null);

    // Mock data
    const mockData: PromocionData = {
        id: Number(id) || 1,
        nombre: 'Sendero Dragón',
        descripcion: 'Recorrido completo del sendero principal, se proporciona comida',
        duracion: '3 horas',
        capacidad: 10,
        descuento: 20,
        etiqueta: 'Moderado',
        imagen: '/tour1.png',
        activa: true,
        paquete: {
            nombre: 'Paquete 1',
            descripcion: 'Incluye: Almuerzo, Guía y Poliza INS',
            precioAntes: 70,
            precioAhora: 50
        }
    };

    const fetchPromocionData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // TODO: Replace with actual API endpoint
            // const response = await fetch(`/api/promociones/${id}`);
            // if (!response.ok) throw new Error('Failed to fetch promotion data');
            // const data = await response.json();
            // setPromocionData(data);
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 500));
            setPromocionData(mockData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error loading promotion data');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = (action: 'activar' | 'desactivar') => {
        setPendingAction(action);
        setShowConfirmModal(true);
    };

    const confirmToggleStatus = async () => {
        if (!promocionData || !pendingAction) return;

        try {
            setIsUpdating(true);
            const newStatus = pendingAction === 'activar';

            // TODO: Replace with actual API endpoint
            // const response = await fetch(`/api/promociones/${id}/toggle-status`, {
            //     method: 'PATCH',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({
            //         activa: newStatus
            //     })
            // });
            // 
            // if (!response.ok) {
            //     throw new Error('Failed to update promotion status');
            // }

            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 800));

            // Update local state optimistically
            setPromocionData(prev => prev ? { ...prev, activa: newStatus } : null);
            
            console.log(`Promoción ${newStatus ? 'activada' : 'desactivada'} exitosamente`);
            
        } catch (error) {
            console.error('Error updating promotion status:', error);
            setError('Error al actualizar el estado de la promoción. Inténtalo de nuevo.');
            
            // Clear error after 3 seconds
            setTimeout(() => setError(null), 3000);
        } finally {
            setIsUpdating(false);
            setShowConfirmModal(false);
            setPendingAction(null);
        }
    };

    const cancelToggleStatus = () => {
        setShowConfirmModal(false);
        setPendingAction(null);
    };

    useEffect(() => {
        if (id) {
            fetchPromocionData();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    if (loading) {
        return (
            <div className="h-screen bg-gray-50 flex overflow-hidden">
                <SideBarAdmin />
                <div className="flex-1 flex flex-col">
                    <TopBar />
                    <main className="flex-1 flex items-center justify-center ml-72 pt-20">
                        <div className="text-verde3 text-lg">Cargando información de la promoción...</div>
                    </main>
                </div>
            </div>
        );
    }

    if (error || !promocionData) {
        return (
            <div className="h-screen bg-gray-50 flex overflow-hidden">
                <SideBarAdmin />
                <div className="flex-1 flex flex-col">
                    <TopBar />
                    <main className="flex-1 flex items-center justify-center ml-72 pt-20">
                        <div className="text-red-500 text-lg">{error || 'Promoción no encontrada'}</div>
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
                    <div className="max-w-7xl mx-auto w-full flex flex-col">
                        {/* Fixed header section */}
                        <div className="flex-shrink-0">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h1 className="text-3xl font-bold mb-1 text-black mt-4">Información sobre la Promoción</h1>
                                    <p className="mb-4 text-verde3">
                                        Información actualizada de la promoción seleccionada
                                    </p>
                                    {error && (
                                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                                            {error}
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-end">
                                    {promocionData.activa ? (
                                        <button
                                            onClick={() => handleToggleStatus('desactivar')}
                                            disabled={isUpdating}
                                            className="mt-1 text-black bg-rojosuave hover:bg-rojotrans hover:cursor-pointer font-semibold rounded-lg 
                                            text-md px-5 py-2.5 text-center flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                                        >
                                            <svg
                                                className="w-6 h-6 text-black dark:text-black"
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
                                                    d="M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M9 3v14m7 0v4"
                                                />
                                            </svg>
                                            {isUpdating ? 'Desactivando...' : 'Desactivar'}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleToggleStatus('activar')}
                                            disabled={isUpdating}
                                            className="mt-1 text-white bg-verde3 hover:bg-verde2 font-medium rounded-xl 
                                            text-md px-5 py-2.5 text-center flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                                        >
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
                                                    d="M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M9 3v14m7 0v4"
                                                />
                                            </svg>
                                            {isUpdating ? 'Activando...' : 'Activar'}
                                        </button>
                                    )}
                                </div>
                            </div>
                            <hr className="border-1 border-borde1 my-4 w-full" />
                        </div>
                        
                        <div className="ml-12 mt-4 mb-4 flex flex-row gap-8">
                            <div className="flex-1">
                                <h2 className="text-5xl font-serif font-normal mb-6 text-black mt-4">{promocionData.nombre}</h2>
                                <p className="mb-6 text-verde2">{promocionData.descripcion}</p>
                                <div className="mb-6 flex flex-row gap-12">
                                    <p className="text-md font-medium text-black"> <span className="text-verde3 font-bold"> Tiempo: </span> {promocionData.duracion}</p>
                                    <p className="text-md font-medium text-black ml-24"><span className="text-verde3 font-bold">Cantidad de personas:</span> {promocionData.capacidad} personas</p>
                                </div>
                                <p className="mb-24 text-black font-medium"> <span className="text-verde3 font-bold">Etiqueta:</span>     
                                    {promocionData.etiqueta === 'Moderado' ? (
                                        <span className="inline-flex items-center mx-8 px-6 py-0.5 text-amarillo text-sm font-bold rounded bg-amarillotrans">
                                            Moderado
                                        </span>
                                    ) : promocionData.etiqueta === 'Experto' ? (
                                        <span className="inline-flex items-center mx-8 px-6 py-0.5 text-rojovino text-sm font-bold rounded bg-rojotrans">
                                            Experto
                                        </span>
                                    ) : promocionData.etiqueta === 'Fácil' ? (
                                        <span className="inline-flex items-center mx-8 px-6 py-0.5 text-verde3 text-sm font-bold rounded bg-verdetrans">
                                            Fácil
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center mx-8 px-6 py-0.5 text-azul1 text-sm font-bold rounded bg-azultrans">
                                            Todos
                                        </span>
                                    )}
                                </p>
                            </div>
                                
                            <div className="flex-shrink-0">
                                <div className="relative">
                                    <div className="absolute top-6 left-4 bg-rojo2 text-black text-sm font-bold px-2 py-1 rounded-md z-20 transform -rotate-12">
                                        PROMOCIÓN -{promocionData.descuento}%
                                    </div>
                                    <Image
                                        src={promocionData.imagen}
                                        alt={`Imagen del tour ${promocionData.nombre}`}
                                        width={400}
                                        height={300}
                                        className="rounded-xl mt-2 mr-8"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="ml-12 mb-12">
                            <h3 className="text-2xl font-semibold mb-4 text-verde3">Paquete en Promoción</h3>
                            <div className="flex-shrink-0 w-60">
                                <CardPaquetePromo 
                                    nombre={promocionData.paquete.nombre} 
                                    descripcion={promocionData.paquete.descripcion} 
                                    precioAntes={promocionData.paquete.precioAntes} 
                                    precioAhora={promocionData.paquete.precioAhora}
                                />
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Confirmation Modal */}
            <ConfirmModal
                open={showConfirmModal}
                title={pendingAction === 'activar' ? 'Activar Promoción' : 'Desactivar Promoción'}
                message={
                    pendingAction === 'activar' 
                        ? `¿Está seguro de que desea activar la promoción "${promocionData.nombre}"?\n\nEsto la hará visible para los clientes.`
                        : `¿Está seguro de que desea desactivar la promoción "${promocionData.nombre}"?\n\nEsto la ocultará de los clientes.`
                }
                confirmText={pendingAction === 'activar' ? 'Activar' : 'Desactivar'}
                cancelText="Cancelar"
                confirmVariant={pendingAction === 'activar' ? 'primary' : 'danger'}
                onConfirm={confirmToggleStatus}
                onCancel={cancelToggleStatus}
            />
        </div>
    );
}