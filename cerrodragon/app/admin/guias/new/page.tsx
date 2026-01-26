"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    ImageUpload,
    SideBarAdmin,
    TopBar,
    ConfirmModal,
    PlusIcon,
} from "@/app/components";

const NAME_MAX = 60;
const EMAIL_MAX = 80;
const PHONE_MAX = 8;
const BIO_MAX = 400;

const API_URL = "http://localhost:3000";

export default function NuevoGuiaPage() {
    const router = useRouter();

    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [telefono, setTelefono] = useState("");
    const [bio, setBio] = useState("");

    const [imagen, setImagen] = useState<File | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);

    /* ======================
       VALIDATIONS
    ====================== */

    const isNameValid = nombre.trim().length >= 3;
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim());
    const isPhoneValid = /^\d{8}$/.test(telefono.trim());

    const canSubmit =
        !isLoading &&
        isNameValid &&
        isEmailValid &&
        isPhoneValid;

    /* ======================
       ACTIONS
    ====================== */

    const handleBack = () => router.back();

    const handleSubmitRequest = (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;
        setConfirmOpen(true);
    };

    const confirmCreate = async () => {
        setConfirmOpen(false);
        setIsLoading(true);

        try {
            let imageUrl: string | null = null;

            /* =========================
               1. SUBIR IMAGEN
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
                    throw new Error(imgJson.message || "Error al subir imagen");
                }

                imageUrl = `${API_URL}${imgJson.file.path}`;
            }

            /* =========================
               2. CREAR GUÍA
            ========================== */

            const password = `${correo.split("@")[0]}@Cd`;

            const res = await fetch(
                `${API_URL}/auth/register/guide`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: correo.trim(),
                        password,
                        full_name: nombre.trim(),
                        phone: telefono.trim(),
                        bio: bio.trim() || null,
                        image_url: imageUrl,
                    }),
                }
            );

            const json = await res.json();

            if (!res.ok) {
                throw new Error(json.message || "Error al crear el guía");
            }

            router.push("/admin/guias");
        } catch (err) {
            console.error(err);
            alert(err instanceof Error ? err.message : "Error creando guía");
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
                                    Nuevo Guía
                                </h1>
                                <p className="text-verde3 mb-4">
                                    Complete la información
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
                        <form onSubmit={handleSubmitRequest} className="mt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Left */}
                                <div className="space-y-4 max-w-xl">
                                    {/* Nombre */}
                                    <div>
                                        <label className="block text-sm font-medium text-black mb-1">
                                            Nombre del Guía
                                        </label>
                                        <input
                                            value={nombre}
                                            onChange={(e) =>
                                                setNombre(e.target.value.slice(0, NAME_MAX))
                                            }
                                            placeholder="Nombre del guía"
                                            className="w-full bg-tabla-header border border-borde1 text-verde1 text-sm rounded-xl px-3 py-2.5"
                                            disabled={isLoading}
                                        />
                                        {!isNameValid && nombre && (
                                            <p className="text-xs text-rojovino mt-1">
                                                Mínimo 3 caracteres
                                            </p>
                                        )}
                                    </div>

                                    {/* Correo */}
                                    <div>
                                        <label className="block text-sm font-medium text-black mb-1">
                                            Correo
                                        </label>
                                        <input
                                            value={correo}
                                            onChange={(e) =>
                                                setCorreo(e.target.value.slice(0, EMAIL_MAX))
                                            }
                                            placeholder="ex: guía@gmail.com"
                                            className="w-full bg-tabla-header border border-borde1 text-verde1 text-sm rounded-xl px-3 py-2.5"
                                            disabled={isLoading}
                                        />
                                        {!isEmailValid && correo && (
                                            <p className="text-xs text-rojovino mt-1">
                                                Correo inválido
                                            </p>
                                        )}
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
                                                    e.target.value.replace(/[^\d]/g, "").slice(0, PHONE_MAX)
                                                )
                                            }
                                            placeholder="8888-8888"
                                            className="w-full bg-tabla-header border border-borde1 text-verde1 text-sm rounded-xl px-3 py-2.5"
                                            disabled={isLoading}
                                        />
                                        {!isPhoneValid && telefono && (
                                            <p className="text-xs text-rojovino mt-1">
                                                Debe tener 8 dígitos
                                            </p>
                                        )}
                                    </div>

                                    {/* Bio */}
                                    <div>
                                        <label className="block text-sm font-medium text-black mb-1">
                                            Biografía
                                        </label>
                                        <textarea
                                            value={bio}
                                            onChange={(e) =>
                                                setBio(e.target.value.slice(0, BIO_MAX))
                                            }
                                            rows={4}
                                            placeholder="Agrega info importante del guía, edad, intereses, pronombres, etc."
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
                                            <PlusIcon />
                                            {isLoading ? "Guardando..." : "Añadir Guía"}
                                        </button>
                                    </div>
                                </div>

                                {/* Right */}
                                <div className="flex justify-center md:justify-end">
                                    <div className="w-full max-w-xl">
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
                        title="Crear guía"
                        message={`¿Desea crear este guía?\n\nNombre: ${nombre}\nCorreo: ${correo}`}
                        confirmText="Crear"
                        cancelText="Cancelar"
                        confirmVariant="primary"
                        onConfirm={confirmCreate}
                        onCancel={() => setConfirmOpen(false)}
                    />
                </main>
            </div>
        </div>
    );
}

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
