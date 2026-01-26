"use client";
import { useState, useEffect } from "react";
import { CardGuide, SideBarClient, TopBar } from "@/app/components";

const API_URL = "http://localhost:3000";

/* =========================
   TYPES
========================= */

interface GuideAPI {
    user_id: string;
    full_name: string;
    image_url: string | null;
    guide_active: boolean;
}

interface Guide {
    id: string;
    nombre: string;
    activo: "Activo";
    imagen: string;
}

/* =========================
   PAGE
========================= */

export default function Guias() {
    const [guides, setGuides] = useState<Guide[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /* =========================
       FETCH GUIDES
    ========================== */
    const fetchGuides = async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch(`${API_URL}/users/guides`);
            const json = await res.json();

            if (!res.ok) {
                throw new Error(json.message || "Error cargando guías");
            }

            const activeGuides: Guide[] = (json.data as GuideAPI[])
                .filter((g) => g.guide_active)
                .map((g) => ({
                    id: g.user_id,
                    nombre: g.full_name,
                    activo: "Activo",
                    imagen: g.image_url || "/guia1.png", // fallback visual
                }));

            setGuides(activeGuides);
        } catch (err) {
            console.error(err);
            setError(
                err instanceof Error
                    ? err.message
                    : "Error cargando guías"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGuides();
    }, []);

    /* =========================
       RENDER
    ========================== */

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            <SideBarClient />

            <div className="flex-1 flex flex-col">
                <TopBar />

                <main className="flex-1 flex flex-col ml-72 pt-20 px-8 min-h-0">
                    <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
                        {/* Header */}
                        <div className="flex-shrink-0">
                            <h1 className="text-3xl font-bold mb-1 text-black mt-4">
                                Nuestros Guías
                            </h1>
                            <p className="mb-4 text-verde3">
                                Conócenos!
                            </p>
                        </div>

                        {/* Grid */}
                        <div className="flex-1 overflow-y-auto min-h-0">
                            {loading ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="text-verde3 text-lg">
                                        Cargando guías...
                                    </div>
                                </div>
                            ) : error ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="text-red-500 text-lg">
                                        {error}
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-12 p-6">
                                    {guides.map((guide) => (
                                        <CardGuide
                                            key={guide.id}
                                            nombre={guide.nombre}
                                            activo={guide.activo}
                                            imagen={guide.imagen}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
