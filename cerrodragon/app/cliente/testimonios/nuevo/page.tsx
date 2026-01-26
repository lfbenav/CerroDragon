"use client";

import { SideBarClient, TopBar } from "@/app/components";
import { useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:3000";

/* =======================
   Tipos
======================= */

interface UserFromStorage {
    id: string;
    email: string;
    type: string;
    customer_id: string | null;
}

export default function NuevoTestimonioPage() {
    const router = useRouter();

    const [content, setContent] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    /* =======================
       Submit
    ======================= */

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!content.trim()) {
            setError("El testimonio no puede estar vacío");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const rawUser = localStorage.getItem("user");
            const user: UserFromStorage | null = rawUser
                ? JSON.parse(rawUser)
                : null;

            const response = await fetch(
                `${API_URL}/others/testimonials`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        customer_id: user?.customer_id ?? null,
                        content,
                        rating: null,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Error al enviar el testimonio");
            }

            setSuccess(true);
            setContent("");

            // Redirigir luego de un pequeño delay
            setTimeout(() => {
                router.push("/cliente/testimonios");
            }, 1200);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Error inesperado"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            <SideBarClient />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 flex flex-col ml-72 pt-20 px-8 min-h-0">
                    <div className="max-w-7xl mx-auto w-full flex flex-col">
                        {/* Header */}
                        <div className="flex-shrink-0">
                            <h1 className="text-3xl font-bold mb-1 text-black mt-4">
                                Nuevo Testimonio
                            </h1>
                            <p className="mb-8 text-verde3">
                                Escríbanos su experiencia y su opinión será muy valiosa para nosotros!
                            </p>
                        </div>

                        {/* Form */}
                        <div className="flex-1 flex justify-start">
                            <form
                                className="min-w-full space-y-4"
                                onSubmit={handleSubmit}
                            >
                                <div>
                                    <label
                                        htmlFor="testimonio"
                                        className="block mb-2.5 text-md font-medium text-black"
                                    >
                                        Escriba su testimonio:
                                    </label>
                                    <textarea
                                        id="testimonio"
                                        rows={6}
                                        value={content}
                                        onChange={(e) =>
                                            setContent(e.target.value)
                                        }
                                        className="bg-tabla-header border border-borde1 text-verde1 text-sm 
                                        rounded-xl focus:ring-borde2 focus:border-borde2 block w-full px-3 py-2.5 
                                        shadow-xs placeholder:text-verde2 placeholder:font-medium placeholder:opacity-50 resize-y"
                                        placeholder="Comparta su experiencia con nosotros..."
                                        disabled={loading}
                                    />
                                </div>

                                {/* Error */}
                                {error && (
                                    <p className="text-red-600 text-sm">
                                        {error}
                                    </p>
                                )}

                                {/* Success */}
                                {success && (
                                    <p className="text-green-600 text-sm">
                                        Testimonio enviado correctamente. Quedará pendiente de aprobación.
                                    </p>
                                )}

                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="mt-1 text-white bg-verde3 hover:bg-verde2 font-medium rounded-xl 
                                        text-md px-5 py-2.5 text-center flex items-center justify-center gap-2 disabled:opacity-60"
                                    >
                                        <svg
                                            className="w-6 h-6"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M12 3a1 1 0 0 1 .78.375l4 5a1 1 0 1 1-1.56 1.25L13 6.85V14a1 1 0 1 1-2 0V6.85L8.78 9.626a1 1 0 1 1-1.56-1.25l4-5A1 1 0 0 1 12 3ZM9 14v-1H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-4v1a3 3 0 1 1-6 0Zm8 2a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H17Z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        {loading ? "Enviando..." : "Enviar"}
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
