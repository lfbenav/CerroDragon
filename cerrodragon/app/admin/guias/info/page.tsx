'use client';
import { SideBarAdmin, TopBar } from "@/app/components";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface GuiaData {
    id: string;
    nombreGuia: string;
    cedula: string;
    genero: string;
    telefono: string;
    correo: string;
    fechaNacimiento: string;
    edad: number;
    fechaIngreso: string;
    cargo: string;
    activo: boolean;
    imagenGuia: string;
}

export default function TourInfoPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const id = searchParams.get('id');
    
    const [guiaData, setGuiaData] = useState<GuiaData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        if (id) {
            fetchGuiaData();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);
    
    const fetchGuiaData = async () => {
        try {
            // TODO: Implementar llamada al backend
            // const response = await fetch(`/api/guias/${id}`);
            // if (!response.ok) throw new Error('Error al cargar información del guía');
            // const data = await response.json();
            // setGuiaData(data);
            
            // Datos temporales hasta que esté el backend
            const tempData: GuiaData = {
                id: id || '1',
                nombreGuia: 'Juan Carlos Morales',
                cedula: '1-1234-5678',
                genero: 'Masculino',
                telefono: '+506 8888-9999',
                correo: 'juan.morales@cerrodragon.com',
                fechaNacimiento: '15 de Marzo de 1985',
                edad: 39,
                fechaIngreso: '10 de Enero de 2020',
                cargo: 'Guía Senior',
                activo: true,
                imagenGuia: '/guia1.png'
            };
            setGuiaData(tempData);
        } catch (error) {
            console.error('Error fetching guia data:', error);
            setError('Error al cargar la información del guía');
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleActivo = async () => {
        if (!guiaData) return;
        
        try {
            setIsUpdatingStatus(true);
            // TODO: Implementar llamada al backend para actualizar estado
            // const response = await fetch(`/api/guias/${id}/toggle-status`, {
            //     method: 'PATCH',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ activo: !guiaData.activo })
            // });
            // if (!response.ok) throw new Error('Error al actualizar estado');
            
            // Actualizar estado local temporalmente
            setGuiaData({ ...guiaData, activo: !guiaData.activo });
        } catch (error) {
            console.error('Error updating status:', error);
            setError('Error al actualizar el estado del guía');
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    const handleEliminarGuia = async () => {
        if (!id || !guiaData) return;
        
        setIsDeleting(true);
        try {
            // TODO: Implementar llamada al backend para eliminar guía
            // const response = await fetch(`/api/guias/${id}`, {
            //     method: 'DELETE',
            //     headers: { 'Content-Type': 'application/json' }
            // });
            // 
            // if (!response.ok) {
            //     throw new Error('Error al eliminar el guía');
            // }

            // Simular eliminación exitosa
            console.log(`Eliminando guía ${guiaData.nombreGuia} con ID: ${id}`);
            
            // Redireccionar a la lista de guías después de eliminar
            router.push('/admin/guias');
        } catch (error) {
            console.error('Error deleting guia:', error);
            setError('Error al eliminar el guía. Por favor, intente nuevamente.');
        } finally {
            setIsDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    const confirmDelete = () => {
        setShowDeleteConfirm(true);
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
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
                            <div className="flex justify-between items-center">
                                <div>
                                    <h1 className="text-3xl font-bold mb-1 text-black mt-4">Información del Guía</h1>
                                    <p className="mb-4 text-verde3">
                                        Información actual sobre el personal guía
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        className="bg-rojosuave px-4 py-2 text-black flex items-center justify-center rounded-lg gap-2 disabled:opacity-50"
                                        onClick={confirmDelete}
                                        disabled={isDeleting || isLoading}
                                    >
                                        {isDeleting ? (
                                            <>
                                                <svg className="animate-spin h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Eliminando...
                                            </>
                                        ) : (
                                            <>
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
                                                        d="M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                                    />
                                                </svg>
                                                Eliminar
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                            <hr className="border-1 border-borde1 my-4 w-full" />
                        </div>

                        {/* Delete Confirmation Modal */}
                        {showDeleteConfirm && (
                            <div className="fixed inset-0 flex items-center justify-center z-50">
                                <div className="bg-beige1 shadow-lg border-borde1 border-1 rounded-xl p-6 max-w-md w-full mx-4">
                                    <h3 className="text-lg font-bold text-black mb-4">Confirmar eliminación</h3>
                                    <p className="text-gray-600 mb-6">
                                        ¿Está seguro que desea eliminar al guía <strong>{guiaData?.nombreGuia}</strong>? 
                                        Esta acción no se puede deshacer.
                                    </p>
                                    <div className="flex justify-end space-x-4">
                                        <button
                                            onClick={cancelDelete}
                                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50"
                                            disabled={isDeleting}
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={handleEliminarGuia}
                                            className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:opacity-50"
                                            disabled={isDeleting}
                                        >
                                            {isDeleting ? 'Eliminando...' : 'Eliminar'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Error message */}
                        {error && (
                            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl">
                                {error}
                                <button 
                                    onClick={() => setError('')}
                                    className="ml-4 text-red-500 hover:text-red-700"
                                >
                                    ✕
                                </button>
                            </div>
                        )}

                        {/* Rest of the component */}
                        {isLoading ? (
                            <div className="ml-6 mt-4 mb-4 text-center">
                                <p className="text-lg text-gray-500">Cargando información del guía...</p>
                            </div>
                        ) : error ? (
                            <div className="ml-6 mt-4 mb-4 text-center">
                                <p className="text-lg text-red-500">{error}</p>
                            </div>
                        ) : guiaData ? (
                            <div className="ml-6 mt-4 mb-4 flex flex-row gap-8">
                                <div className="flex-1">
                                    <h3 className="text-4xl font-serif font-normal mb-6 text-black mt-4">{guiaData.nombreGuia}</h3>
                                    <p className="mb-4 text-lg text-black"><span className="font-bold">Cédula: </span>{guiaData.cedula}</p>
                                    <p className="mb-4 text-lg text-black"><span className="font-bold">Género: </span>{guiaData.genero}</p>
                                    <p className="mb-4 text-lg text-black"><span className="font-bold">Teléfono: </span>{guiaData.telefono}</p>
                                    <p className="mb-4 text-lg text-black"><span className="font-bold">Correo: </span>{guiaData.correo}</p>
                                    <p className="mb-4 text-lg text-black"><span className="font-bold">Fecha de Nacimiento: </span>{guiaData.fechaNacimiento}</p>
                                    <p className="mb-4 text-lg text-black"><span className="font-bold">Edad: </span>{guiaData.edad} años</p>
                                    <p className="mb-4 text-lg text-black"><span className="font-bold">Fecha de Ingreso: </span>{guiaData.fechaIngreso}</p>
                                    <p className="mb-4 text-lg text-black"><span className="font-bold">Cargo: </span>{guiaData.cargo}</p>
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            checked={guiaData.activo}
                                            onChange={handleToggleActivo}
                                            disabled={isUpdatingStatus}
                                            className="sr-only peer" 
                                        />
                                        <div className={`relative w-9 h-5 peer-focus:outline-none peer-focus:ring-2 
                                            peer-focus:ring-opacity-50 rounded-full peer 
                                            peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full 
                                            peer-checked:after:border-white after:content-[''] 
                                            after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full 
                                            after:h-4 after:w-4 after:transition-all ${
                                                guiaData.activo ? 'bg-verde2 peer-focus:ring-verdetrans' 
                                                    : 'bg-rojosuave peer-focus:ring-rojotrans'
                                            } ${isUpdatingStatus ? 'opacity-50' : ''}`} />
                                        <span className="select-none ms-3 text-lg font-medium text-black font-semibold">
                                            {isUpdatingStatus ? 'Actualizando...' : (guiaData.activo ? 'Activo' : 'Inactivo')}
                                        </span>
                                    </label>
                                </div>
                                    
                                <div className="flex flex-col gap-4">
                                    <Image
                                        src={guiaData.imagenGuia}
                                        alt={`Imagen del guía ${guiaData.nombreGuia}`}
                                        width={400}
                                        height={300}
                                        className="rounded-xl mt-2 mr-8"
                                    />
                                    <div className="justify-end flex mt-2 mr-8">
                                        <Link href={`/admin/guias/editar?id=${id}`}>
                                            <button className="flex items-center justify-center gap-2 bg-verde3 hover:bg-verde2 text-white font-medium py-2 px-4 rounded-xl">
                                                <svg
                                                    className="w-6 h-6 text-gray-800 dark:text-white"
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
                                                        d="M18 5V4a1 1 0 0 0-1-1H8.914a1 1 0 0 0-.707.293L4.293 7.207A1 1 0 0 0 4 7.914V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5M9 3v4a1 1 0 0 1-1 1H4m11.383.772 2.745 2.746m1.215-3.906a2.089 2.089 0 0 1 0 2.953l-6.65 6.646L9 17.95l.739-3.692 6.646-6.646a2.087 2.087 0 0 1 2.958 0Z"
                                                    />
                                                </svg>
                                                Editar
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </main>
            </div>
        </div>
    );
}