"use client";
import { useState, useMemo } from "react";
import { TopBar, SideBarAdmin, Cuadro, SearchBarwFilters, TablaCupones } from "@/app/components";
import Link from "next/link";

// Datos de ejemplo para las reservas
const cuponesDataInicial = [
    {
        id: "RV-502",
        codigoAsociado: "CUP-308",
        descuento: 15,
        canjeados: 5,
        limite: 20,
        fechaCreacion: "15 de Diciembre de 2025"
    },
    {
        id: "RV-503",
        codigoAsociado: "CUP-309",
        descuento: 10,
        canjeados: 2,
        limite: 15,
        fechaCreacion: "20 de Diciembre de 2025"
    },
    {
        id: "RV-504",
        codigoAsociado: "CUP-310",
        descuento: 20,
        canjeados: 10,
        limite: 30,
        fechaCreacion: "18 de Diciembre de 2025"
    },
    {
        id: "RV-505",
        codigoAsociado: "CUP-311",
        descuento: 25,
        canjeados: 25,
        limite: 25,
        fechaCreacion: "22 de Diciembre de 2025"
    }
];

export default function Cupones() {
    const filtros = ["todos", "completos", "incompletos"];
    const [filtroSeleccionado, setFiltroSeleccionado] = useState("todos");
    const [cuponesData, setCuponesData] = useState(cuponesDataInicial);

    const cuponesFiltrados = useMemo(() => {
        switch (filtroSeleccionado) {
            case 'completos':
                return cuponesData.filter(c => c.canjeados >= c.limite);
            case 'incompletos':
                return cuponesData.filter(c => c.canjeados < c.limite);
            default:
                return cuponesData;
        }
    }, [filtroSeleccionado, cuponesData]);

    const handleFiltroChange = (filtro: string) => {
        setFiltroSeleccionado(filtro);
    };

    const handleEliminarCupon = (id: string) => {
        setCuponesData(prev => prev.filter(cupon => cupon.id !== id));
        console.log(`Cupón ${id} eliminado exitosamente`);
    };

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            <SideBarAdmin />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 flex flex-col ml-72  pt-20 px-8 min-h-0"> 
                    <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
                        <div className="flex-shrink-0 flex justify-between items-center mb-1">
                            <div className="">
                                <h1 className="text-3xl font-bold mb-1 text-black mt-4">Gestión de Cupones</h1>
                                <p className="mb-0 text-verde3">
                                    Administre los cupones de descuento disponibles
                                </p>
                            </div>
                            <div className="flex justify-end mb-0 items-center">
                                <Link href="/admin/cupones/nuevo">
                                    <button className="bg-verde3 text-white px-4 py-2 rounded-lg hover:bg-verde2 transition justify-between items-center flex">
                                        <svg
                                            className="w-6 h-6 text-white dark:text-white"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={24}
                                            height={24}
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4.243a1 1 0 1 0-2 0V11H7.757a1 1 0 1 0 0 2H11v3.243a1 1 0 1 0 2 0V13h3.243a1 1 0 1 0 0-2H13V7.757Z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        Nuevo Cupón
                                    </button>
                                </Link>
                            </div>
                        </div>
                        <hr className="border-1 border-borde1 mt-2 w-full mb-6" />
                        <div className="justify-center items-center flex gap-12 mb-4">
                            <Cuadro texto="Total de Cupones" cantidad={cuponesData.length} />
                            <Cuadro texto="Cupones completos" cantidad={cuponesData.filter(c => c.canjeados >= c.limite).length} />
                            <Cuadro texto="Cupones incompletos" cantidad={cuponesData.filter(c => c.canjeados < c.limite).length} />
                        </div>
                        <SearchBarwFilters 
                            texto="Buscar cupones..." 
                            filters={filtros} 
                            selectedFilter={filtroSeleccionado}
                            onFilterChange={handleFiltroChange}
                        />
                        <TablaCupones 
                            cupones={cuponesFiltrados} 
                            onEliminar={handleEliminarCupon}
                        />
                    </div>
                    
                </main>
            </div>
        </div>
    );
}