'use client';
import { SideBarClient, TopBar } from "@/app/components";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function InfoAlojamiento() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    
    const [nombreCabana] = useState('Cabaña del Dragón');
    const [descripcion] = useState('Cabaña sencilla perfecta para una familia');
    const [capacidad] = useState(4);
    const [costoPorNoche] = useState(5000);
    const [imagenCabana] = useState('/tour3.png');

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            <SideBarClient />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 flex flex-col ml-72 pt-20 px-8 min-h-0">
                    <div className="max-w-7xl mx-auto w-full flex flex-col">
                        {/* Fixed header section */}
                        <div className="flex-shrink-0">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h1 className="text-3xl font-bold mb-1 text-black mt-4">Información del Alojamiento</h1>
                                    <p className="mb-4 text-verde3">
                                        Información actualizada sobre las cabañas disponibles en Cerro Dragón
                                    </p>
                                </div>
                                <div className="flex justify-end">
                                    <Link href={`/cliente/cabanas/reservar?id=${id}`}>
                                        <button
                                            type="button"
                                            className="mt-1 text-white bg-verde3 hover:bg-verde2 font-medium rounded-xl 
                                            text-md px-5 py-2.5 text-center flex items-center justify-center gap-2"
                                        >
                                            <svg
                                                className="w-6 h-6 text-white"
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                width={24}
                                                height={24}
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M9 3v14m7 0v4"
                                                />
                                            </svg>
                                            Reservar!
                                        </button>
                                    </Link>
                                </div>
                            </div>
                            <hr className="border-1 border-borde1 my-4 w-full" />
                        </div>

                        <div className="ml-12 mt-4 mb-4 flex flex-row gap-8">
                            <div className="flex-1">
                                <h2 className="text-5xl font-serif font-normal mb-6 text-black mt-4">{nombreCabana}</h2>
                                <p className="mb-6 text-verde2">{descripcion}</p>
                                
                                <div className="mb-6">
                                    <p className="text-md font-medium text-black mb-4">
                                        <span className="text-verde3 font-bold">Capacidad de personas:</span> {capacidad} personas
                                    </p>
                                    <p className="text-md font-medium text-black">
                                        <span className="text-verde3 font-bold">Costo por persona por noche:</span> {costoPorNoche} colones
                                    </p>
                                </div>
                            </div>
                                
                            <div className="flex-shrink-0">
                                <Image
                                    src={imagenCabana}
                                    alt={`Imagen de ${nombreCabana}`}
                                    width={500}
                                    height={400}
                                    className="rounded-xl mt-2 mr-8"
                                />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
