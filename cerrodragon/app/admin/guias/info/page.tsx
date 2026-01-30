'use client';
import { SideBarAdmin, TopBar } from "@/app/components";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

const API_URL = "http://localhost:3000";

/* ======================
   TYPES
====================== */

interface GuiaAPI {
    user_id: string;
    email: string;
    is_active: boolean;
    full_name: string;
    phone: string | null;
    bio: string | null;
    image_url: string | null;
    guide_active: boolean;
}

interface GuiaData {
    id: string;
    nombreGuia: string;
    telefono: string | null;
    correo: string;
    bio: string | null;
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

    /* ======================
       FETCH
    ====================== */
    useEffect(() => {
        if (!id) return;

        const fetchGuiaData = async () => {
            try {
                setIsLoading(true);
                setError("");

                const token = localStorage.getItem("access_token");

                const res = await fetch(`${API_URL}/users/${id}/guide`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error("Error al cargar información del guía");
                }

                const json: { data: GuiaAPI } = await res.json();
                const g = json.data;

                setGuiaData({
                    id: g.user_id,
                    nombreGuia: g.full_name,
                    telefono: g.phone,
                    correo: g.email,
                    bio: g.bio, // ✅ BIO incluida
                    activo: g.guide_active,
                    imagenGuia: g.image_url ?? "/guia1.png",
                });
            } catch (err) {
                console.error(err);
                setError("Error al cargar la información del guía");
            } finally {
                setIsLoading(false);
            }
        };

        fetchGuiaData();
    }, [id]);

    /* ======================
       ACTIONS
    ====================== */

    const handleToggleActivo = async () => {
        if (!guiaData) return;

        try {
            setIsUpdatingStatus(true);
            const token = localStorage.getItem("access_token");

            const endpoint = guiaData.activo ? "deactivate" : "activate";

            const res = await fetch(
                `${API_URL}/users/${guiaData.id}/${endpoint}`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!res.ok) {
                throw new Error("Error al actualizar estado");
            }

            setGuiaData({ ...guiaData, activo: !guiaData.activo });
        } catch (error) {
            console.error(error);
            setError("Error al actualizar el estado del guía");
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    const handleEliminarGuia = async () => {
        if (!guiaData) return;

        setIsDeleting(true);
        try {
            const token = localStorage.getItem("access_token");

            await fetch(
                `${API_URL}/users/${guiaData.id}/deactivate`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            router.push('/admin/guias');
        } catch (error) {
            console.error(error);
            setError('Error al eliminar el guía');
        } finally {
            setIsDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            <SideBarAdmin />

            <div className="flex-1 flex flex-col min-h-0">
                <TopBar />

                {/* ✅ SCROLL EN TODO EL CONTENIDO */}
                <main className="flex-1 overflow-y-auto pt-20 px-8 ml-72 min-h-0">
                    <div className="max-w-7xl mx-auto w-full flex flex-col">
                        {/* Header */}
                        <div className="flex justify-between items-center mt-4">
                            <div>
                                <h1 className="text-3xl font-bold text-black">
                                    Información del Guía
                                </h1>
                                <p className="mb-4 text-verde3">
                                    Información actual sobre el personal guía
                                </p>
                            </div>

                           
                        </div>

                        <hr className="border-1 border-borde1 my-4 w-full" />

                        {/* Delete Modal */}
                        {showDeleteConfirm && (
                            <div className="fixed inset-0 flex items-center justify-center z-50">
                                <div className="bg-beige1 shadow-lg border-borde1 border-1 rounded-xl p-6 max-w-md w-full mx-4">
                                    <h3 className="text-lg font-bold text-black mb-4">Confirmar eliminación</h3>
                                    <p className="text-gray-600 mb-6">
                                        ¿Está seguro que desea eliminar al guía{" "}
                                        <strong>{guiaData?.nombreGuia}</strong>?
                                        Esta acción no se puede deshacer.
                                    </p>
                                    <div className="flex justify-end space-x-4">
                                        <button
                                            onClick={() => setShowDeleteConfirm(false)}
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

                        {/* Error */}
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

                        {/* Body */}
                        {isLoading ? (
                            <div className="ml-6 mt-4 mb-4 text-center">
                                <p className="text-lg text-gray-500">Cargando información del guía...</p>
                            </div>
                        ) : guiaData ? (
                            <div className="ml-6 mt-4 mb-10 flex flex-row gap-8">
                                <div className="flex-1">
                                    <h3 className="text-4xl font-serif font-normal mb-6 text-black mt-4">
                                        {guiaData.nombreGuia}
                                    </h3>

                                    <p className="mb-4 text-lg text-black">
                                        <span className="font-bold text-black">Teléfono: </span>
                                        {guiaData.telefono ?? "No registrado"}
                                    </p>

                                    <p className="mb-4 text-lg text-black">
                                        <span className="font-bold text-black">Correo: </span>
                                        {guiaData.correo}
                                    </p>

                                    {/* ✅ BIO visible */}
                                    <p className="mb-4 text-lg text-black">
                                        <span className="font-bold text-black">Bio: </span>
                                        {guiaData.bio?.trim() ? guiaData.bio : "Sin biografía"}
                                    </p>

                                    {/* Switch ORIGINAL */}
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
                                    <img
                                        src={guiaData.imagenGuia}
                                        alt={`Imagen del guía ${guiaData.nombreGuia}`}
                                        className="rounded-xl mt-2 mr-8 w-[400px] h-auto"
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
