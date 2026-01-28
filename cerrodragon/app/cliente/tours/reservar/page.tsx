"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SideBarClient, TopBar, WhatsAppButton } from "@/app/components";

const API_URL = "http://localhost:3000";

const MONTHS = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

interface TourAPI {
    id: string;
    title: string;
    description: string;
    person_price: number;
    max_persons: number;
    image_url: string | null;
}

interface PaqueteAPI {
    id: string;
    name: string;
    price_usd: number;
}

export default function ReservarTourPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentYear = new Date().getFullYear();
    
    // Obtener parámetros de la URL
    const tourIdParam = searchParams.get("tourId");
    const nombreParam = searchParams.get("nombre");
    const promotionIdParam = searchParams.get("promotionId");
    const precioPromoParam = searchParams.get("precioPromo");

    // Tour data
    const [tourData, setTourData] = useState<TourAPI | null>(null);
    const [paquetes, setPaquetes] = useState<PaqueteAPI[]>([]);
    const [loadingTour, setLoadingTour] = useState(true);

    // Form state
    const [nombreTour, setNombreTour] = useState("Cerro Dragón");
    const [descripcion, setDescripcion] = useState("Una aventura increíble");
    const [cantidadPersonas, setCantidadPersonas] = useState("2");
    const [paqueteId, setPaqueteId] = useState("");

    const [day, setDay] = useState("21");
    const [month, setMonth] = useState("Enero");
    const [year, setYear] = useState("2026");

    const [isLoading, setIsLoading] = useState(false);

    // Cargar datos del tour desde la API
    useEffect(() => {
        const fetchTourData = async () => {
            if (!tourIdParam) {
                setLoadingTour(false);
                return;
            }

            try {
                // Fetch tour details
                const tourRes = await fetch(`${API_URL}/tours/${tourIdParam}`);
                if (tourRes.ok) {
                    const tourJson = await tourRes.json();
                    const tour: TourAPI = tourJson.data;
                    setTourData(tour);
                    setNombreTour(tour.title);
                    setDescripcion(tour.description || '');
                }

                // Fetch packages for this tour
                const pkgRes = await fetch(`${API_URL}/tour-packages?tour_id=${tourIdParam}`);
                if (pkgRes.ok) {
                    const pkgJson = await pkgRes.json();
                    setPaquetes(pkgJson.data);
                    if (pkgJson.data.length > 0) {
                        setPaqueteId(String(pkgJson.data[0].id));
                    }
                }
            } catch (error) {
                console.error('Error loading tour data:', error);
            } finally {
                setLoadingTour(false);
            }
        };

        fetchTourData();
    }, [tourIdParam]);

    // Si viene el nombre de la URL, actualizarlo
    useEffect(() => {
        if (nombreParam) {
            setNombreTour(decodeURIComponent(nombreParam));
        }
    }, [nombreParam]);

    // Calcular precios
    const precioPorPersona = useMemo(() => {
        // Si hay precio de promoción, usarlo
        if (precioPromoParam) {
            return parseFloat(precioPromoParam);
        }
        // Si hay paquete seleccionado, usar su precio
        if (paqueteId && paquetes.length > 0) {
            const selectedPkg = paquetes.find(p => String(p.id) === paqueteId);
            if (selectedPkg) return selectedPkg.price_usd;
        }
        return tourData?.person_price || 0;
    }, [paqueteId, paquetes, tourData, precioPromoParam]);

    const montoFinal = useMemo(() => {
        return precioPorPersona * parseInt(cantidadPersonas || '0');
    }, [precioPorPersona, cantidadPersonas]);

    const handleBack = () => {
        router.back();
    };

    const handleReservar = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const token = localStorage.getItem('access_token');
            const userData = JSON.parse(localStorage.getItem('user') || '{}');
            
            // Validate customer_id exists
            if (!userData.customer_id) {
                alert('Error: No se encontró tu perfil de cliente. Por favor cierra sesión y vuelve a iniciar sesión.');
                setIsLoading(false);
                return;
            }
            
            // Format date
            const monthIndex = MONTHS.indexOf(month) + 1;
            const fechaTour = `${year}-${String(monthIndex).padStart(2, "0")}-${day.padStart(2, "0")}`;

            console.log('Enviando reserva:', {
                customer_id: userData.customer_id,
                tour_id: tourIdParam,
                promotion_id: promotionIdParam || null,
                tour_package_id: paqueteId || null,
                tour_date: fechaTour,
                persons: parseInt(cantidadPersonas),
                subtotal_usd: montoFinal,
                total_usd: montoFinal
            });

            const response = await fetch(`${API_URL}/reservations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    customer_id: userData.customer_id,
                    tour_id: tourIdParam,
                    promotion_id: promotionIdParam || null,
                    tour_package_id: paqueteId || null,
                    tour_date: fechaTour,
                    persons: parseInt(cantidadPersonas),
                    subtotal_usd: montoFinal,
                    total_usd: montoFinal
                })
            });

            if (!response.ok) {
                throw new Error('Error al crear la reserva');
            }

            router.push("/cliente/reservas");
        } catch (err) {
            console.error(err);
            alert('Error al crear la reserva. Por favor intente de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    const canSubmit = 
        !isLoading &&
        !loadingTour &&
        nombreTour.trim().length > 0 &&
        Number(cantidadPersonas) > 0 &&
        tourIdParam;

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
                                                max={tourData?.max_persons || 20}
                                                className="w-full bg-tabla-header border border-borde1 text-verde1 text-sm rounded-xl focus:ring-verde2 focus:border-verde2 block px-3 py-2.5 shadow-xs"
                                                disabled={isLoading}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-black mb-1">
                                                Paquete:
                                            </label>
                                            <select
                                                value={paqueteId}
                                                onChange={(e) => setPaqueteId(e.target.value)}
                                                className="w-full bg-tabla-header border border-borde1 text-verde1 text-sm rounded-xl focus:ring-verde2 focus:border-verde2 block px-3 py-2.5 shadow-xs"
                                                disabled={isLoading || paquetes.length === 0}
                                            >
                                                <option value="">Sin paquete (precio base)</option>
                                                {paquetes.map((pkg) => (
                                                    <option key={pkg.id} value={pkg.id}>
                                                        {pkg.name} - ₡{pkg.price_usd}
                                                    </option>
                                                ))}
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
                                                {promotionIdParam && (
                                                    <span className="ml-2 text-xs text-verde3 bg-verdetrans px-2 py-0.5 rounded">
                                                        Promoción aplicada
                                                    </span>
                                                )}
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
