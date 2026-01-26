"use client";

import { CardTestimonio, SideBarClient, TopBar } from "@/app/components";
import { useEffect, useState } from "react";
import Link from "next/link";

const API_URL = "http://localhost:3000";

/* =======================
   Tipos BACKEND
======================= */

type TestimonialStatus = "APPROVED" | "REJECTED" | "PENDING";

interface TestimonialApi {
    id: number;
    customer_id: string | null;
    content: string;
    rating: number | null;
    status: TestimonialStatus;
    created_at: string;
    reviewed_at: string | null;
}

/* =======================
   Tipo para la UI
======================= */

interface Testimonio {
    id: number;
    nombre: string;
    comentario: string;
    fecha: string;
    likes: number;
}

/* =======================
   Utils
======================= */

const formatFecha = (isoDate: string): string => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("es-CR", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};

export default function Testimonios() {
    const [testimonios, setTestimonios] = useState<Testimonio[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    /* =======================
       Fetch real desde API
    ======================= */

    const fetchTestimonios = async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(
                `${API_URL}/others/testimonials/approved`
            );

            if (!response.ok) {
                throw new Error("Error al obtener testimonios");
            }

            const json: {
                success: boolean;
                data: TestimonialApi[];
            } = await response.json();

            if (!json.success) {
                throw new Error("Respuesta inválida del servidor");
            }

            // 🔑 Mapeo backend → UI
            const mapped: Testimonio[] = json.data.map((t) => ({
                id: t.id,
                nombre: "Cliente Anónimo", // Backend no expone nombre (correcto)
                comentario: t.content,
                fecha: formatFecha(t.created_at),
                likes: t.rating ?? 0, // placeholder hasta que exista likes real
            }));

            setTestimonios(mapped);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Error cargando testimonios"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTestimonios();
    }, []);

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            <SideBarClient />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 flex flex-col ml-72 pt-20 px-8 min-h-0">
                    <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
                        <div className="flex-shrink-0 flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold mb-1 text-black mt-4">
                                    Testimonios
                                </h1>
                                <p className="mb-4 text-verde3">
                                    Qué opina la gente sobre nosotros!
                                </p>
                                <hr className="border-1 border-borde1 my-4 w-full" />
                            </div>

                            <div className="flex justify-end mb-4">
                                <Link href="/cliente/testimonios/nuevo">
                                    <button className="bg-verde3 text-white px-4 py-2 rounded-lg hover:bg-verde2 transition justify-between items-center flex">
                                        <svg
                                            className="w-4 h-4 ml-2"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={2}
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                            />
                                        </svg>
                                        Nuevo Testimonio
                                    </button>
                                </Link>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                <p>Error: {error}</p>
                                <button
                                    onClick={fetchTestimonios}
                                    className="mt-2 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                                >
                                    Reintentar
                                </button>
                            </div>
                        )}

                        {/* Loading */}
                        {loading && (
                            <p className="text-gray-500 py-4">
                                Cargando testimonios...
                            </p>
                        )}

                        {/* Listado */}
                        <div className="flex-1 overflow-y-auto min-h-0">
                            <div className="columns-1 sm:columns-2 md:columns-3 gap-6 p-6">
                                {!loading && testimonios.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500 text-lg">
                                            No hay testimonios disponibles
                                        </p>
                                    </div>
                                ) : (
                                    testimonios.map((testimonio) => (
                                        <CardTestimonio
                                            key={testimonio.id}
                                            nombre={testimonio.nombre}
                                            comentario={testimonio.comentario}
                                            fecha={testimonio.fecha}
                                            likes={testimonio.likes}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
