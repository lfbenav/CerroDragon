"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SideBarClient, TopBar, WhatsAppButton } from "@/app/components";

const MONTHS = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export default function ReservarTourPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentYear = new Date().getFullYear();
    
    // Obtener parámetros de la URL
    const tourIdParam = searchParams.get("tourId");
    const nombreParam = searchParams.get("nombre");

    // Form state
    const [nombreTour, setNombreTour] = useState("Cerro Dragón");
    const [descripcion, setDescripcion] = useState("Una aventura increíble");
    const [cantidadPersonas, setCantidadPersonas] = useState("2");
    const [paquete, setPaquete] = useState("Completo");

    const [day, setDay] = useState("21");
    const [month, setMonth] = useState("Enero");
    const [year, setYear] = useState("2026");

    const [precioPorPersona] = useState(15000);
    const [montoFinal] = useState(30000);

    const [isLoading, setIsLoading] = useState(false);

    // Cargar datos del tour si vienen de la URL
    useEffect(() => {
        if (nombreParam) {
            setNombreTour(decodeURIComponent(nombreParam));
        }
        // TODO: Cargar más detalles del tour usando tourIdParam si es necesario
    }, [nombreParam, tourIdParam]);

    const handleBack = () => {
        router.back();
    };

    const handleReservar = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // TODO: API crear reserva
            // POST /api/reservas
            // const fechaTour = `${year}-${String(MONTHS.indexOf(month) + 1).padStart(2, "0")}-${day}`;

            // Redirigir a mis reservas después de crear
            router.push("/cliente/reservas");
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const canSubmit = 
        !isLoading &&
        nombreTour.trim().length > 0 &&
        descripcion.trim().length > 0 &&
        Number(cantidadPersonas) > 0 &&
        paquete.trim().length > 0;

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            <SideBarClient />

            <div className="flex-1 flex flex-col min-h-0">
                <TopBar />

                <main className="flex-1 overflow-y-auto pt-20 px-8 ml-72 min-h-0">
                    <div className="max-w-7xl mx-auto w-full flex flex-col">
                        {/* Header */}
                        <div className="shrink-0">
                            <div className="flex items-center justify-between mt-4">
                                <div>
                                    <h1 className="text-3xl font-serif text-black">Nueva Reserva</h1>
                                    <p className="text-verde3 mb-4">Complete la información</p>
                                </div>
                                <WhatsAppButton />
                            </div>
                            <div className="border-b border-black/20" />
                        </div>

                        {/* Form */}
                        <form onSubmit={handleReservar} className="mt-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Left column: Formulario */}
                                <div className="space-y-4 max-w-xl">
                                    {/* Nombre del tour */}
                                    <div>
                                        <label className="block text-sm font-medium text-black mb-1">
                                            Nombre del tour:
                                        </label>
                                        <input
                                            value={nombreTour}
                                            onChange={(e) => setNombreTour(e.target.value)}
                                            placeholder="Cerro Dragón"
                                            className="w-full bg-tabla-header border border-borde1 text-verde1 text-sm rounded-xl focus:ring-verde2 focus:border-verde2 block px-3 py-2.5 shadow-xs placeholder:text-verde2 placeholder:opacity-50"
                                            disabled={isLoading}
                                        />
                                    </div>

                                    {/* Descripción */}
                                    <div>
                                        <label className="block text-sm font-medium text-black mb-1">
                                            Descripción:
                                        </label>
                                        <input
                                            value={descripcion}
                                            onChange={(e) => setDescripcion(e.target.value)}
                                            placeholder="Una aventura increíble"
                                            className="w-full bg-tabla-header border border-borde1 text-verde1 text-sm rounded-xl focus:ring-verde2 focus:border-verde2 block px-3 py-2.5 shadow-xs placeholder:text-verde2 placeholder:opacity-50"
                                            disabled={isLoading}
                                        />
                                    </div>

                                    {/* Cantidad de personas y Paquete */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-black mb-1">
                                                Cantidad personas:
                                            </label>
                                            <input
                                                type="number"
                                                value={cantidadPersonas}
                                                onChange={(e) => setCantidadPersonas(e.target.value)}
                                                min="1"
                                                className="w-full bg-tabla-header border border-borde1 text-verde1 text-sm rounded-xl focus:ring-verde2 focus:border-verde2 block px-3 py-2.5 shadow-xs"
                                                disabled={isLoading}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-black mb-1">
                                                Paquete:
                                            </label>
                                            <select
                                                value={paquete}
                                                onChange={(e) => setPaquete(e.target.value)}
                                                className="w-full bg-tabla-header border border-borde1 text-verde1 text-sm rounded-xl focus:ring-verde2 focus:border-verde2 block px-3 py-2.5 shadow-xs"
                                                disabled={isLoading}
                                            >
                                                <option value="Completo">Completo</option>
                                                <option value="Básico">Básico</option>
                                                <option value="Premium">Premium</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Fecha del tour */}
                                    <div>
                                        <label className="block text-sm font-medium text-black mb-1">
                                            Fecha del tour
                                        </label>
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
                                                className="flex-1 bg-tabla-header border border-borde1 text-verde1 text-sm rounded-xl focus:ring-verde2 focus:border-verde2 px-3 py-2"
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
                                                {Array.from({ length: 3 }, (_, i) => currentYear + i).map((y) => (
                                                    <option key={y} value={String(y)}>{y}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Precio por persona y Monto final */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-black mb-1">
                                                Precio por persona
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-naranja font-semibold text-lg">
                                                    ₡
                                                </span>
                                                <input
                                                    value={precioPorPersona.toLocaleString()}
                                                    readOnly
                                                    className="w-full bg-tabla-header border border-borde1 text-naranja text-lg font-semibold rounded-xl px-8 py-2.5 shadow-xs"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-black mb-1">
                                                Monto Final
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-verde-apagado font-semibold text-lg">
                                                    ₡
                                                </span>
                                                <input
                                                    value={montoFinal.toLocaleString()}
                                                    readOnly
                                                    className="w-full bg-tabla-header border border-borde1 text-verde-apagado text-lg font-semibold rounded-xl px-8 py-2.5 shadow-xs"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Botones Reservar y Cancelar */}
                                    <div className="pt-6 space-y-3">
                                        <button
                                            type="submit"
                                            disabled={!canSubmit}
                                            className={[
                                                "w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-base font-medium transition",
                                                canSubmit
                                                    ? "bg-verde-apagado text-white hover:opacity-95"
                                                    : "bg-black/20 text-black/50 cursor-not-allowed",
                                            ].join(" ")}
                                        >
                                            <ClockIcon />
                                            {isLoading ? "Procesando..." : "Reservar"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleBack}
                                            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-base font-medium bg-red-600 text-white hover:bg-red-700 transition"
                                        >
                                            <CancelIcon />
                                            Cancelar
                                        </button>
                                    </div>
                                </div>

                                {/* Right column: Imagen */}
                                <div className="flex items-start justify-center lg:justify-end">
                                    <div className="w-full max-w-xl rounded-2xl overflow-hidden shadow-lg">
                                        <img
                                            src="/tour1.png"
                                            alt="Cerro Dragón"
                                            className="w-full h-auto object-cover"
                                        />
                                        <div className="p-4 bg-white">
                                            <p className="text-verde1 text-sm font-medium italic">
                                                Cerro Dragón
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}

function CancelIcon() {
    return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
                d="M6 18L18 6M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function ClockIcon() {
    return (
        <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
        </svg>
    );
}
