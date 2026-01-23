"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
    SideBarAdmin,
    TopBar,
    ImageUpload,
    ConfirmModal,
    PlusIcon,
} from "@/app/components";

type Option = {
    id: string;
    nombre: string;
    precio: number;
};

export default function NuevaPromocionPage() {
    const router = useRouter();

    // Dummy options (API-ready)
    const tours: Option[] = useMemo(
        () => [
            { id: "T-001", nombre: "Cerro Dragón", precio: 65 },
            { id: "T-002", nombre: "Mirador Dragón", precio: 50 },
            { id: "T-003", nombre: "Cataratas", precio: 45 },
        ],
        []
    );

    const paquetes: Option[] = useMemo(
        () => [
            { id: "P-001", nombre: "Paquete Familiar", precio: 120 },
            { id: "P-002", nombre: "Paquete Aventurero", precio: 90 },
            { id: "P-003", nombre: "Paquete Premium", precio: 150 },
        ],
        []
    );

    // State
    const [tourId, setTourId] = useState("");
    const [paqueteId, setPaqueteId] = useState("");
    const [promoPrice, setPromoPrice] = useState("65");
    const [imagen, setImagen] = useState<File | null>(null);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Helpers
    const selectedTour = tours.find((t) => t.id === tourId) ?? null;
    const selectedPaquete = paquetes.find((p) => p.id === paqueteId) ?? null;

    const handleBack = () => {
        router.back();
    };

    // Only one should be selected at once (like typical UI). If they select one, clear the other.
    const handleSelectTour = (id: string) => {
        setTourId(id);
        setPaqueteId("");
        const t = tours.find((x) => x.id === id);
        if (t) setPromoPrice(String(t.precio));
    };

    const handleSelectPaquete = (id: string) => {
        setPaqueteId(id);
        setTourId("");
        const p = paquetes.find((x) => x.id === id);
        if (p) setPromoPrice(String(p.precio));
    };

    const currentPrice = selectedTour?.precio ?? selectedPaquete?.precio ?? 0;

    const promoNum = Number(promoPrice);
    const promoNumValid = Number.isFinite(promoNum) && promoNum > 0;

    const hasSelection = !!selectedTour || !!selectedPaquete;

    const promoLessThanCurrent = hasSelection ? promoNum < currentPrice : false;

    const discountPct = useMemo(() => {
        if (!hasSelection) return 0;
        if (!promoNumValid) return 0;
        if (currentPrice <= 0) return 0;
        const pct = Math.round(((currentPrice - promoNum) / currentPrice) * 100);
        return Math.max(0, pct);
    }, [hasSelection, promoNumValid, currentPrice, promoNum]);

    const canSubmit =
        !isLoading &&
        hasSelection &&
        promoNumValid &&
        promoLessThanCurrent;

    const requestCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;
        setConfirmOpen(true);
    };

    const cancelCreate = () => setConfirmOpen(false);

    const confirmCreate = async () => {
        setConfirmOpen(false);
        setIsLoading(true);

        try {
            // TODO: API call
            // POST /promociones
            // body: { tourId, paqueteId, promoPrice: promoNum, discountPct, imagen }
            // (tourId OR paqueteId should be set, not both)

            router.push("/admin/promociones"); // adjust if your route differs
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
                                    <h1 className="text-3xl font-serif text-black">
                                        Nueva Promoción
                                    </h1>
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

                        {/* Content */}
                        <form onSubmit={requestCreate} className="mt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                {/* Left */}
                                <div className="max-w-2xl space-y-5">
                                    {/* Tour */}
                                    <div>
                                        <label className="block text-sm font-medium text-black mb-1">
                                            Tour por Promocionar
                                        </label>
                                        <select
                                            value={tourId}
                                            onChange={(e) => handleSelectTour(e.target.value)}
                                            className="w-full bg-tabla-header border border-borde1 text-verde1 text-sm rounded-xl focus:ring-verde2 focus:border-verde2 px-3 py-2.5 shadow-xs"
                                            disabled={isLoading}
                                        >
                                            <option value="">Seleccione el tour</option>
                                            {tours.map((t) => (
                                                <option key={t.id} value={t.id}>
                                                    {t.nombre}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Paquete */}
                                    <div>
                                        <label className="block text-sm font-medium text-black mb-1">
                                            Paquete por Promocionar
                                        </label>
                                        <select
                                            value={paqueteId}
                                            onChange={(e) => handleSelectPaquete(e.target.value)}
                                            className="w-full bg-tabla-header border border-borde1 text-verde1 text-sm rounded-xl focus:ring-verde2 focus:border-verde2 px-3 py-2.5 shadow-xs"
                                            disabled={isLoading}
                                        >
                                            <option value="">Seleccione el paquete</option>
                                            {paquetes.map((p) => (
                                                <option key={p.id} value={p.id}>
                                                    {p.nombre}
                                                </option>
                                            ))}
                                        </select>

                                        <p className="text-xs text-black/60 mt-2">
                                            * Seleccione un tour o un paquete (no ambos).
                                        </p>
                                    </div>

                                    {/* Price row */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center pt-2">
                                        <div className="text-sm text-black">
                                            <span className="font-medium">Precio Actual:</span>{" "}
                                            <span className="ml-2">
                                                $ {hasSelection ? currentPrice : 0}
                                            </span>
                                        </div>

                                        <div className="text-sm text-black">
                                            <span className="font-medium">Descuento:</span>{" "}
                                            <span className="ml-2">% {discountPct}</span>
                                        </div>
                                    </div>

                                    {/* Promo price */}
                                    <div className="flex items-center gap-3">
                                        <label className="text-sm font-medium text-black">
                                            Precio Promoción:
                                        </label>
                                        <span className="text-sm text-black">$</span>
                                        <input
                                            value={promoPrice}
                                            onChange={(e) =>
                                                setPromoPrice(e.target.value.replace(/[^\d]/g, "").slice(0, 6))
                                            }
                                            className="w-24 bg-tabla-header border border-borde1 text-verde1 text-sm rounded-xl focus:ring-verde2 focus:border-verde2 px-3 py-2 shadow-xs"
                                            disabled={isLoading}
                                        />
                                    </div>

                                    {/* Validation hints */}
                                    {!hasSelection && (
                                        <p className="text-xs text-rojovino">
                                            Debe seleccionar un tour o un paquete.
                                        </p>
                                    )}
                                    {hasSelection && promoNumValid && !promoLessThanCurrent && (
                                        <p className="text-xs text-rojovino">
                                            El precio de promoción debe ser menor al precio actual.
                                        </p>
                                    )}

                                    {/* Button */}
                                    <div className="pt-3">
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
                                            {isLoading ? "Creando..." : "Crear Promo"}
                                        </button>
                                    </div>
                                </div>

                                {/* Right */}
                                <div className="flex justify-center md:justify-end">
                                    <div className="w-full max-w-2xl">
                                        <ImageUpload imagen={imagen} onImageChange={setImagen} />
                                    </div>
                                </div>
                            </div>
                        </form>

                        {/* Confirm modal */}
                        <ConfirmModal
                            open={confirmOpen}
                            title="Crear promoción"
                            message={
                                hasSelection
                                    ? `¿Desea crear esta promoción?\n\nItem: ${
                                            selectedTour?.nombre ?? selectedPaquete?.nombre
                                        }\nPrecio actual: $ ${currentPrice}\nPrecio promo: $ ${promoNum}\nDescuento: % ${discountPct}`
                                    : "¿Desea crear esta promoción?"
                            }
                            confirmText="Crear"
                            cancelText="Cancelar"
                            confirmVariant="primary"
                            onConfirm={confirmCreate}
                            onCancel={cancelCreate}
                        />
                    </div>
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
