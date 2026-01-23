"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUpload, SideBarAdmin, TopBar, ConfirmModal, PlusIcon } from "@/app/components";

const NAME_MAX = 60;
const EMAIL_MAX = 80;
const CED_MAX = 12;     // e.g. 1-2345-6789
const PHONE_MAX = 8;

const MONTHS = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export default function NuevoGuiaPage() {
    const router = useRouter();

    const currentYear = new Date().getFullYear();
    const years = useMemo(() => {
        const arr: number[] = [];
        for (let y = currentYear; y >= currentYear - 90; y--) arr.push(y);
        return arr;
    }, [currentYear]);

    // form state
    const [cedula, setCedula] = useState("");
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [telefono, setTelefono] = useState("");

    const [day, setDay] = useState("01");
    const [month, setMonth] = useState("Enero");
    const [year, setYear] = useState(String(currentYear - 18));

    const [genero, setGenero] = useState("Otro");

    const [imagen, setImagen] = useState<File | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);

    // helpers
    const monthIndex = MONTHS.indexOf(month); // 0..11

    const computedAge = useMemo(() => {
        const d = Number(day);
        const y = Number(year);
        if (!Number.isFinite(d) || !Number.isFinite(y) || monthIndex < 0) return 0;

        const dob = new Date(y, monthIndex, d);
        if (Number.isNaN(dob.getTime())) return 0;

        const now = new Date();
        let age = now.getFullYear() - dob.getFullYear();
        const m = now.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
        return Math.max(0, age);
    }, [day, monthIndex, year]);

    const isEmailValid = useMemo(() => {
        const e = correo.trim();
        if (!e) return false;
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
    }, [correo]);

    const isCedulaValid = useMemo(() => {
        const c = cedula.trim();
        if (!c) return false;
        if (c.length > CED_MAX) return false;
        return /^[0-9-]+$/.test(c);
    }, [cedula]);

    const isPhoneValid = useMemo(() => {
        const t = telefono.trim();
        return /^\d{8}$/.test(t);
    }, [telefono]);

    const isNameValid = useMemo(() => nombre.trim().length >= 3, [nombre]);

    const isDobValid = useMemo(() => {
        const d = Number(day);
        const y = Number(year);
        if (!Number.isFinite(d) || !Number.isFinite(y) || monthIndex < 0) return false;
        const dob = new Date(y, monthIndex, d);
        return (
            dob.getFullYear() === y &&
            dob.getMonth() === monthIndex &&
            dob.getDate() === d
        );
    }, [day, monthIndex, year]);

    const isAgeValid = computedAge >= 18;

    const canSubmit =
        !isLoading &&
        isCedulaValid &&
        isNameValid &&
        isEmailValid &&
        isDobValid &&
        isAgeValid &&
        isPhoneValid &&
        genero.trim().length > 0;

    const handleBack = () => {
        router.back();
    };

    const handleSubmitRequest = (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;
        setConfirmOpen(true);
    };

    const confirmCreate = async () => {
        setConfirmOpen(false);
        setIsLoading(true);

        try {
            // TODO: API create guide
            // POST /api/guias  (cedula, nombre, correo, telefono, dob, genero, imagen)
            // const dobISO = `${year}-${String(monthIndex+1).padStart(2,"0")}-${day}`;

            router.push("/admin/guias");
        } catch (err) {
            console.error(err);
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
                        <div className="flex-shrink-0">
                            <div className="flex items-center justify-between mt-4">
                                <div>
                                    <h1 className="text-3xl font-serif text-black">Nuevo Guía</h1>
                                    <p className="text-verde3 mb-4">Complete la información</p>
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
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmitRequest} className="mt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Left column */}
                                <div className="space-y-4 max-w-xl">
                                    {/* Cédula */}
                                    <div>
                                        <label className="block text-sm font-medium text-black mb-1">Cédula</label>
                                        <input
                                            value={cedula}
                                            onChange={(e) =>
                                                setCedula(
                                                    e.target.value
                                                        .replace(/[^\d-]/g, "")
                                                        .slice(0, CED_MAX)
                                                )
                                            }
                                            placeholder="0-0000-0000"
                                            className="w-full bg-tabla-header border border-borde1 text-verde1 text-sm rounded-xl focus:ring-verde2 focus:border-verde2 block px-3 py-2.5 shadow-xs placeholder:text-verde2 placeholder:opacity-50"
                                            disabled={isLoading}
                                        />
                                        {!isCedulaValid && cedula.length > 0 && (
                                            <p className="text-xs text-rojovino mt-1">Solo números y guiones, máx {CED_MAX} caracteres.</p>
                                        )}
                                    </div>

                                    {/* Nombre */}
                                    <div>
                                        <label className="block text-sm font-medium text-black mb-1">Nombre del Guía</label>
                                        <input
                                            value={nombre}
                                            onChange={(e) => setNombre(e.target.value.slice(0, NAME_MAX))}
                                            placeholder="ej. Mateo Torres Jiménez"
                                            className="w-full bg-tabla-header border border-borde1 text-verde1 text-sm rounded-xl focus:ring-verde2 focus:border-verde2 block px-3 py-2.5 shadow-xs placeholder:text-verde2 placeholder:opacity-50"
                                            disabled={isLoading}
                                        />
                                        <div className="text-xs text-verde3 text-right mt-1">{nombre.length}/{NAME_MAX}</div>
                                        {!isNameValid && nombre.length > 0 && (
                                            <p className="text-xs text-rojovino mt-1">Ingrese un nombre válido (mín. 3 caracteres).</p>
                                        )}
                                    </div>

                                    {/* Correo */}
                                    <div>
                                        <label className="block text-sm font-medium text-black mb-1">Correo</label>
                                        <input
                                            value={correo}
                                            onChange={(e) => setCorreo(e.target.value.slice(0, EMAIL_MAX))}
                                            placeholder="ej. ejemplo@gmail.com"
                                            className="w-full bg-tabla-header border border-borde1 text-verde1 text-sm rounded-xl focus:ring-verde2 focus:border-verde2 block px-3 py-2.5 shadow-xs placeholder:text-verde2 placeholder:opacity-50"
                                            disabled={isLoading}
                                        />
                                        <div className="text-xs text-verde3 text-right mt-1">{correo.length}/{EMAIL_MAX}</div>
                                        {correo.length > 0 && !isEmailValid && (
                                            <p className="text-xs text-rojovino mt-1">Correo inválido.</p>
                                        )}
                                    </div>

                                    {/* Fecha de Nacimiento + Edad */}
                                    <div className="grid grid-cols-1 md:grid-cols-[1fr_120px] gap-4 items-end">
                                        <div>
                                            <label className="block text-sm font-medium text-black mb-1">Fecha de Nacimiento</label>
                                            <div className="flex gap-2">
                                                {/* Day */}
                                                <select
                                                    value={day}
                                                    onChange={(e) => setDay(e.target.value)}
                                                    className="bg-tabla-header border border-borde1 text-verde1 text-sm rounded-xl focus:ring-verde2 focus:border-verde2 px-3 py-2"
                                                    disabled={isLoading}
                                                >
                                                    {Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0")).map((d) => (
                                                        <option key={d} value={d}>{d}</option>
                                                    ))}
                                                </select>

                                                {/* Month */}
                                                <select
                                                    value={month}
                                                    onChange={(e) => setMonth(e.target.value)}
                                                    className="bg-tabla-header border border-borde1 text-verde1 text-sm rounded-xl focus:ring-verde2 focus:border-verde2 px-3 py-2"
                                                    disabled={isLoading}
                                                >
                                                    {MONTHS.map((m) => (
                                                        <option key={m} value={m}>{m}</option>
                                                    ))}
                                                </select>

                                                {/* Year */}
                                                <select
                                                    value={year}
                                                    onChange={(e) => setYear(e.target.value)}
                                                    className="bg-tabla-header border border-borde1 text-verde1 text-sm rounded-xl focus:ring-verde2 focus:border-verde2 px-3 py-2"
                                                    disabled={isLoading}
                                                >
                                                    {years.map((y) => (
                                                        <option key={y} value={String(y)}>{y}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            {!isDobValid && (
                                                <p className="text-xs text-rojovino mt-1">Fecha inválida.</p>
                                            )}
                                            {isDobValid && !isAgeValid && (
                                                <p className="text-xs text-rojovino mt-1">Debe ser mayor de 18 años.</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-black mb-1">Edad</label>
                                            <input
                                                value={String(computedAge).padStart(2, "0")}
                                                readOnly
                                                className="w-full bg-tabla-header border border-borde1 text-verde1 text-sm rounded-xl px-3 py-2.5 shadow-xs"
                                            />
                                        </div>
                                    </div>

                                    {/* Teléfono */}
                                    <div className="max-w-xs">
                                        <label className="block text-sm font-medium text-black mb-1">Teléfono</label>
                                        <input
                                            value={telefono}
                                            onChange={(e) =>
                                                setTelefono(e.target.value.replace(/[^\d]/g, "").slice(0, PHONE_MAX))
                                            }
                                            placeholder="8888-8888"
                                            className="w-full bg-tabla-header border border-borde1 text-verde1 text-sm rounded-xl focus:ring-verde2 focus:border-verde2 block px-3 py-2.5 shadow-xs placeholder:text-verde2 placeholder:opacity-50"
                                            disabled={isLoading}
                                        />
                                        {!isPhoneValid && telefono.length > 0 && (
                                            <p className="text-xs text-rojovino mt-1">Debe tener {PHONE_MAX} dígitos.</p>
                                        )}
                                    </div>

                                    {/* Género */}
                                    <div className="max-w-xs">
                                        <label className="block text-sm font-medium text-black mb-1">Género</label>
                                        <select
                                            value={genero}
                                            onChange={(e) => setGenero(e.target.value)}
                                            className="w-full bg-tabla-header border border-borde1 text-verde1 text-sm rounded-xl focus:ring-verde2 focus:border-verde2 px-3 py-2.5 shadow-xs"
                                            disabled={isLoading}
                                        >
                                            <option value="Masculino">Masculino</option>
                                            <option value="Femenino">Femenino</option>
                                            <option value="Otro">Otro</option>
                                        </select>
                                    </div>

                                    {/* Submit */}
                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            disabled={!canSubmit}
                                            className={[
                                                "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition",
                                                canSubmit
                                                    ? "bg-verde2 text-white hover:opacity-95"
                                                    : "bg-black/20 text-black/50 cursor-not-allowed",
                                            ].join(" ")}
                                        >
                                            <PlusIcon />
                                            {isLoading ? "Guardando..." : "Añadir Guía"}
                                        </button>
                                    </div>
                                </div>

                                {/* Right column: Image */}
                                <div className="flex justify-center md:justify-end">
                                    <div className="w-full max-w-xl">
                                        <ImageUpload imagen={imagen} onImageChange={setImagen} />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    <ConfirmModal
                        open={confirmOpen}
                        title="Crear guía"
                        message={`¿Desea crear este guía?\n\nNombre: ${nombre}\nCédula: ${cedula}\nCorreo: ${correo}`}
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
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
