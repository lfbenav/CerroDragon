/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { CardPaquete, SideBarClient, TopBar } from "@/app/components";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Image from "next/image";


export default function TourInfoPage() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [nombreTour] = useState('Sendero Dragón');
    const [descripcionTour] = useState('Recorrido completo del sendero principal, se proporciona comida ');
    const [duracionTour] = useState('3 horas');
    const [capacidadTour] = useState(10);
    const [etiquetaTour] = useState('Moderado');
    const [paquetes] = useState([
        { nombre: 'Paquete 1', descripcion: 'Incluye: Almuerzo, Guía y Poliza INS', precio: 50 },
        { nombre: 'Paquete 2', descripcion: 'Incluye: Almuerzo, autoguiado y sin poliza INS', precio: 30 }
    ]);
    const [imagenTour] = useState('/tour1.png');

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            <SideBarClient />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 flex flex-col ml-72  pt-20 px-8 min-h-0">
                    <div className="max-w-7xl mx-auto w-full flex flex-col">
                        {/* Fixed header section */}
                        <div className="flex-shrink-0">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h1 className="text-3xl font-bold mb-1 text-black mt-4">Información del Tour</h1>
                                    <p className="mb-4 text-verde3">
                                        Información actual sobre el tour
                                    </p>
                                </div>
                                <div className="flex justify-end">
                                    <button
                                    type="submit"
                                    className="mt-1 text-white bg-verde3 hover:bg-verde2 font-medium rounded-xl 
                                    text-md px-5 py-2.5 text-center flex items-center justify-center gap-2"
                                    >
                                        <svg
                                            className="w-6 h-6 text-gray-800 dark:text-white"
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
                                </div>
                            </div>
                            <hr className="border-1 border-borde1 my-4 w-full" />
                        </div>
                        <div className="ml-12 mt-4 mb-4 flex flex-row gap-8">
                            <div className="flex-1">
                                <h2 className="text-5xl font-serif font-normal mb-6 text-black mt-4">{nombreTour}</h2>
                                <p className="mb-6 text-verde2">{descripcionTour}</p>
                                <div className="mb-6 flex flex-row gap-12">
                                    <p className="text-md font-medium text-black"> <span className="text-verde3 font-bold"> Tiempo: </span> {duracionTour}</p>
                                    <p className="text-md font-medium text-black ml-24"><span className="text-verde3 font-bold">Cantidad de personas:</span> {capacidadTour} personas</p>
                                </div>
                                <p className="mb-24 text-black font-medium"> <span className="text-verde3 font-bold">Etiqueta:</span>     
                                    {etiquetaTour === 'Moderado' ? (
                                        <span className="inline-flex items-center mx-8 px-6 py-0.5 text-amarillo text-sm font-bold rounded bg-amarillotrans">
                                            Moderado
                                        </span>
                                    ) : etiquetaTour === 'Experto' ? (
                                        <span className="inline-flex items-center mx-8 px-6 py-0.5 text-rojovino text-sm font-bold rounded bg-rojotrans">
                                            Experto
                                        </span>
                                    ) : etiquetaTour === 'Fácil' ? (
                                        <span className="inline-flex items-center mx-8 px-6 py-0.5 text-verde3 text-sm font-bold rounded bg-verdetrans">
                                            Fácil
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center mx-8 px-6 py-0.5 text-azul1 text-sm font-bold rounded bg-azultrans">
                                            Todos
                                        </span>
                                    )}
                                </p>
                            </div>
                                
                            <div className="flex-shrink-0">
                                <Image
                                    src={imagenTour}
                                    alt={`Imagen del tour ${nombreTour}`}
                                    width={400}
                                    height={300}
                                    className="rounded-xl mt-2 mr-8"
                                />
                            </div>
                        </div>
                        

                        <div className="ml-12 mb-12">
                            <h3 className="text-2xl font-semibold mb-4 text-verde3">Paquetes Disponibles</h3>
                            <div className="overflow-x-scroll pb-4 max-w-full" style={{scrollbarWidth: 'thin'}}>
                                <div className="flex gap-3 min-w-max pb-2">
                                    {paquetes.map((paquete, index) => (
                                        <div key={index} className="flex-shrink-0 w-60">
                                            <CardPaquete nombre={paquete.nombre} descripcion={paquete.descripcion} precio={paquete.precio} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}