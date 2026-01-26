"use client";

import {
    CardTestimonioAdmin,
    Cuadro,
    SideBarAdmin,
    TopBar,
} from "@/app/components";
import { useEffect, useState } from "react";

const API_URL = "http://localhost:3000";

/* =======================
   Tipos BACKEND
======================= */

type TestimonialStatusApi = "APPROVED" | "REJECTED" | "PENDING";

interface TestimonialApi {
    id: number;
    customer_id: string | null;
    content: string;
    status: TestimonialStatusApi;
    created_at: string;
}

/* =======================
   Tipo UI
======================= */

type EstadoUI = "pendiente" | "aprobado" | "rechazado";

interface Testimonio {
    id: number;
    nombre: string;
    comentario: string;
    fecha: string;
    estado: EstadoUI;
}

/* =======================
   Utils
======================= */

const mapStatusToUI = (status: TestimonialStatusApi): EstadoUI => {
    switch (status) {
        case "APPROVED":
            return "aprobado";
        case "REJECTED":
            return "rechazado";
        default:
            return "pendiente";
    }
};

const mapStatusToApi = (estado: EstadoUI): TestimonialStatusApi => {
    switch (estado) {
        case "aprobado":
            return "APPROVED";
        case "rechazado":
            return "REJECTED";
        default:
            return "PENDING";
    }
};

const formatFecha = (iso: string): string =>
    new Date(iso).toLocaleDateString("es-CR", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

/* =======================
   Page
======================= */

export default function TestimoniosAdmin() {
    const [currentFilter, setCurrentFilter] = useState("todos");
    const [testimonios, setTestimonios] = useState<Testimonio[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    /* =======================
       Fetch
    ======================= */

    const fetchTestimonios = async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch(`${API_URL}/others/testimonials`);

            if (!res.ok) {
                throw new Error("Error al cargar testimonios");
            }

            const json: {
                success: boolean;
                data: TestimonialApi[];
            } = await res.json();

            const mapped: Testimonio[] = json.data.map((t) => ({
                id: t.id,
                nombre: "Cliente", // backend no expone nombre (correcto)
                comentario: t.content,
                fecha: formatFecha(t.created_at),
                estado: mapStatusToUI(t.status),
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

    /* =======================
       Filters & counts
    ======================= */

    const filteredTestimonios = testimonios.filter((t) => {
        if (currentFilter === "todos") return true;
        if (currentFilter === "pendientes") return t.estado === "pendiente";
        if (currentFilter === "aprobados") return t.estado === "aprobado";
        if (currentFilter === "rechazados") return t.estado === "rechazado";
        return true;
    });

    const testimoniosAprobados = testimonios.filter(
        (t) => t.estado === "aprobado"
    ).length;
    const testimoniosRechazados = testimonios.filter(
        (t) => t.estado === "rechazado"
    ).length;
    const testimoniosPendientes = testimonios.filter(
        (t) => t.estado === "pendiente"
    ).length;

    /* =======================
       Review actions
    ======================= */

    const reviewTestimonio = async (
        id: number,
        estado: EstadoUI
    ): Promise<void> => {
        try {
            const rawUser = localStorage.getItem("user");
            const user = rawUser ? JSON.parse(rawUser) : null;

            const res = await fetch(
                `${API_URL}/others/testimonials/${id}/review`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        status: mapStatusToApi(estado),
                        reviewed_by_user_id: user?.id ?? null,
                    }),
                }
            );

            if (!res.ok) {
                throw new Error("Error al actualizar testimonio");
            }

            // Optimistic update
            setTestimonios((prev) =>
                prev.map((t) =>
                    t.id === id ? { ...t, estado } : t
                )
            );
        } catch (err) {
            console.error(err);
            setError("Error al actualizar el testimonio");
        }
    };

    const handleApprove = (id: number) =>
        reviewTestimonio(id, "aprobado");

    const handleReject = (id: number) =>
        reviewTestimonio(id, "rechazado");

    /* =======================
       Render
    ======================= */

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            <SideBarAdmin />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 flex flex-col ml-72 pt-20 px-8 min-h-0">
                    <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
                        {/* Header */}
                        <div className="flex-shrink-0">
                            <h1 className="text-3xl font-bold mb-1 text-black mt-4">
                                Testimonios
                            </h1>
                            <p className="mb-4 text-verde3">
                                Decida qué opiniones de clientes se muestran en la página principal
                            </p>

                            <hr className="mb-8 border-borde1 border-1 w-full" />

                            <div className="mb-6 flex space-x-4">
                                <Cuadro
                                    texto="Testimonios Aprobados"
                                    cantidad={testimoniosAprobados}
                                />
                                <Cuadro
                                    texto="Testimonios Rechazados"
                                    cantidad={testimoniosRechazados}
                                />
                                <Cuadro
                                    texto="Testimonios Pendientes"
                                    cantidad={testimoniosPendientes}
                                />
                            </div>

                            {/* Filtros */}
                            <div className="flex gap-2">
                                {[
                                    ["todos", "Todos"],
                                    ["pendientes", "Pendientes"],
                                    ["aprobados", "Aprobados"],
                                    ["rechazados", "Rechazados"],
                                ].map(([key, label]) => (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => setCurrentFilter(key)}
                                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                            currentFilter === key
                                                ? "bg-verde3 text-white"
                                                : "bg-beige2 text-verde1 border border-borde1 hover:bg-tabla-header"
                                        }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>

                            <hr className="mb-6 border-borde1 border-1 w-full mt-6" />
                        </div>

                        {/* Error */}
                        {error && (
                            <p className="text-red-600 mb-4">{error}</p>
                        )}

                        {/* Listado */}
                        <div className="flex-1 overflow-y-auto min-h-0">
                            <div className="columns-1 sm:columns-2 md:columns-3 gap-6 p-6">
                                {!loading && filteredTestimonios.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500 text-lg">
                                            No hay testimonios
                                        </p>
                                    </div>
                                ) : (
                                    filteredTestimonios.map((t) => (
                                        <CardTestimonioAdmin
                                            key={t.id}
                                            id={t.id}
                                            nombre={t.nombre}
                                            comentario={t.comentario}
                                            fecha={t.fecha}
                                            estado={t.estado}
                                            onApprove={handleApprove}
                                            onReject={handleReject}
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
