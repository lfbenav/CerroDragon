"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    ImageUpload,
    SideBarAdmin,
    TopBar,
    ConfirmModal,
} from "@/app/components";

const NAME_MAX = 60;
const PHONE_MAX = 8;
const BIO_MAX = 400;

const API_URL = "http://localhost:3000";

export default function EditarGuiaPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const guiaId = searchParams.get("id");

    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [telefono, setTelefono] = useState("");
    const [bio, setBio] = useState("");
    const [imagen, setImagen] = useState<File | null>(null);
    const [imagenActual, setImagenActual] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);

    /* =========================
       CARGAR GUÍA
    ========================== */
    useEffect(() => {
        if (!guiaId) return;

        const fetchGuide = async () => {
            try {
                const res = await fetch(`${API_URL}/users/${guiaId}/guide`);
                const json = await res.json();

                if (!res.ok) {
                    throw new Error(json.message || "Error cargando guía");
                }

                const g = json.data;

                setNombre(g.full_name || "");
                setCorreo(g.email || "");
                setTelefono(g.phone || "");
                setBio(g.bio || "");
                setImagenActual(g.image_url || null);
            } catch (err) {
                console.error(err);
                alert("Error cargando información del guía");
            }
        };

        fetchGuide();
    }, [guiaId]);

    /* =========================
       VALIDACIONES
    ========================== */

    const isNameValid = nombre.trim().length >= 3;
    const isPhoneValid = telefono === "" || /^\d{8}$/.test(telefono);

    const canSubmit =
        !isLoading &&
        isNameValid &&
        isPhoneValid;

    /* =========================
       ACTIONS
    ========================== */

    const handleBack = () => router.back();

    const handleSubmitRequest = (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;
        setConfirmOpen(true);
    };

    const confirmUpdate = async () => {
        setConfirmOpen(false);
        setIsLoading(true);

        try {
            let imageUrl = imagenActual;

            /* =========================
               SUBIR NUEVA IMAGEN
            ========================== */
            if (imagen) {
                const formData = new FormData();
                formData.append("image", imagen);

                const imgRes = await fetch(
                    `${API_URL}/images/upload/guides`,
                    {
                        method: "POST",
                        body: formData,
                    }
                );

                const imgJson = await imgRes.json();

                if (!imgRes.ok) {
                    throw new Error(imgJson.message || "Error subiendo imagen");
                }

                imageUrl = `${API_URL}${imgJson.file.path}`;
            }

            /* =========================
               UPDATE GUÍA
            ========================== */
            const res = await fetch(
                `${API_URL}/users/${guiaId}/guide`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        full_name: nombre.trim(),
                        phone: telefono.trim() || null,
                        bio: bio.trim() || null,
                        image_url: imageUrl,
                    }),
                }
            );

            const json = await res.json();

            if (!res.ok) {
                throw new Error(json.message || "Error actualizando guía");
            }

            router.push("/admin/guias");
        } catch (err) {
            console.error(err);
            alert(
                err instanceof Error
                    ? err.message
                    : "Error actualizando guía"
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            <SideBarAdmin />

            <div className="flex-1 flex flex-col min-h-0">
                <TopBar />

                <main className="flex-1 overflow-y-auto pt-20 px-8 ml-72 min-h-0">
                    <div className="max-w-7xl mx-auto w-full flex flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between mt-4">
                            <div>
                                <h1 className="text-3xl font-serif text-black">
                                    Editar Guía
                                </h1>
                                <p className="text-verde3 mb-4">
                                    Actualice la información del guía
                                </p>
                            </div>

                            <button
                                onClick={handleBack}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-verde2 text-white text-sm font-medium hover:opacity-95"
                            >
                                <BackIcon />
                                Volver
                            </button>
                        </div>

                        <div className="border-b border-black/20" />

                        {/* Form */}
                        <form
                            onSubmit={handleSubmitRequest}
                            className="mt-6"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* LEFT */}
                                <div className="space-y-4 max-w-xl">
                                    {/* Nombre */}
                                    <div>
                                        <label className="block text-sm font-medium text-black mb-1">
                                            Nombre del Guía
                                        </label>
                                        <input
                                            value={nombre}
                                            onChange={(e) =>
                                                setNombre(
                                                    e.target.value.slice(
                                                        0,
                                                        NAME_MAX
                                                    )
                                                )
                                            }
                                            placeholder="ej. Mateo Torres Jiménez"
                                            className="w-full bg-tabla-header border border-borde1 text-verde1 text-sm rounded-xl px-3 py-2.5"
                                            disabled={isLoading}
                                        />
                                    </div>

                                    {/* Correo (solo lectura) */}
                                    <div>
                                        <label className="block text-sm font-medium text-black mb-1">
                                            Correo
                                        </label>
                                        <input
                                            value={correo}
                                            readOnly
                                            className="w-full bg-black/5 border border-borde1 text-black text-sm rounded-xl px-3 py-2.5 cursor-not-allowed"
                                        />
                                    </div>

                                    {/* Teléfono */}
                                    <div className="max-w-xs">
                                        <label className="block text-sm font-medium text-black mb-1">
                                            Teléfono
                                        </label>
                                        <input
                                            value={telefono}
                                            onChange={(e) =>
                                                setTelefono(
                                                    e.target.value
                                                        .replace(/[^\d]/g, "")
                                                        .slice(0, PHONE_MAX)
                                                )
                                            }
                                            placeholder="88888888"
                                            className="w-full bg-tabla-header border border-borde1 text-verde1 text-sm rounded-xl px-3 py-2.5"
                                            disabled={isLoading}
                                        />
                                    </div>

                                    {/* Bio */}
                                    <div>
                                        <label className="block text-sm font-medium text-black mb-1">
                                            Biografía
                                        </label>
                                        <textarea
                                            value={bio}
                                            onChange={(e) =>
                                                setBio(
                                                    e.target.value.slice(
                                                        0,
                                                        BIO_MAX
                                                    )
                                                )
                                            }
                                            rows={4}
                                            placeholder="Breve descripción del guía"
                                            className="w-full bg-tabla-header border border-borde1 text-verde1 text-sm rounded-xl px-3 py-2.5 resize-none"
                                            disabled={isLoading}
                                        />
                                        <div className="text-xs text-verde3 text-right">
                                            {bio.length}/{BIO_MAX}
                                        </div>
                                    </div>

                                    {/* Submit */}
                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            disabled={!canSubmit}
                                            className={[
                                                "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium",
                                                canSubmit
                                                    ? "bg-verde2 text-white"
                                                    : "bg-black/20 text-black/50 cursor-not-allowed",
                                            ].join(" ")}
                                        >
                                            <CheckIcon />
                                            {isLoading
                                                ? "Guardando..."
                                                : "Confirmar"}
                                        </button>
                                    </div>
                                </div>

                                {/* RIGHT */}
                                <div className="flex justify-center md:justify-end">
                                    <div className="w-full max-w-xl space-y-4">
                                        {imagenActual && !imagen && (
                                            <img
                                                src={imagenActual}
                                                alt="Imagen actual"
                                                className="rounded-xl"
                                            />
                                        )}
                                        <ImageUpload
                                            imagen={imagen}
                                            onImageChange={setImagen}
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    <ConfirmModal
                        open={confirmOpen}
                        title="Actualizar guía"
                        message={`¿Desea actualizar la información de este guía?\n\nNombre: ${nombre}\nCorreo: ${correo}`}
                        confirmText="Actualizar"
                        cancelText="Cancelar"
                        confirmVariant="primary"
                        onConfirm={confirmUpdate}
                        onCancel={() => setConfirmOpen(false)}
                    />
                </main>
            </div>
        </div>
    );
}

/* =========================
   ICONS
========================= */

function BackIcon() {
    return (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
            <path
                d="M15 18l-6-6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function CheckIcon() {
    return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <path
                d="M5 13l4 4L19 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
