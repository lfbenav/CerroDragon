"use client";
import { SideBarAdmin, TopBar, CardCabana, Cuadro } from "../../components";
import Link from "next/link";

export default function Cabannas() {

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            <SideBarAdmin />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 flex flex-col pt-20 px-8 min-h-0">
                    <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
                        {/* Fixed header section */}
                        <div className="flex-shrink-0 flex justify-between items-center">
                            <div className="">
                                <h1 className="text-3xl font-bold mb-1 text-black mt-4">Gestión de Alojamientos</h1>
                                <p className="mb-8 text-verde3">
                                    Administra cabañas del local
                                </p>
                                <hr className="border-1 border-borde1 mt-4 mb-12 w-full" />
                            </div>
                            <div className="flex justify-end mb-4">
                                <Link href="/admin/reservas">
                                    <button className="bg-verde3 text-white px-4 py-2 mr-4 rounded-lg hover:bg-verde2 transition justify-between items-center flex">
                                        <svg
                                            className="w-4 h-4 ml-2"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={2}
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                            />
                                        </svg>
                                        Reservas
                                    </button>
                                </Link>
                                <Link href="/admin/cabanas/crear">
                                    <button className="bg-verde3 text-white px-4 py-2 rounded-lg hover:bg-verde2 transition justify-between items-center flex">
                                        <svg
                                            className="w-4 h-4 ml-2"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={2}
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                            />
                                        </svg>
                                        Agregar
                                    </button>
                                </Link>
                                
                            </div>
                        </div>
                        <div className="flex-shrink-0">
                            <div className="mb-6 flex space-x-4">
                                <Cuadro texto="Cabañas Totales" cantidad={3} />
                                <Cuadro texto="Cabañas Disponibles" cantidad={5} />
                            </div>
                        </div>
                        
                        {/* Scrollable tours */}
                        <div className="flex-1 overflow-y-auto min-h-0">
                            <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6 p-6">
                                <CardCabana 
                                    id={1}
                                    nombre="Cabaña Alex" 
                                    descripcion="Cabaña sencilla" 
                                    imagen="/tour3.png" 
                                    capacidad={10} 
                                    etiqueta="Todos" 
                                />
                                <CardCabana
                                    id={2}
                                    nombre="Cabaña Naranjo" 
                                    descripcion="Cabaña para multiples personas" 
                                    imagen="/tour3.png" 
                                    capacidad={8} 
                                    etiqueta="Disponible" 
                                />
                                <CardCabana
                                    id={3}
                                    nombre="Cabaña de Lujo" 
                                    descripcion="Cabaña de lujo con todas las comodidades"  
                                    imagen="/tour3.png" 
                                    capacidad={6} 
                                    etiqueta="Ocupado" 
                                />
                                <CardCabana
                                    id={4}
                                    nombre="Cabaña Familiar" 
                                    descripcion="Cabaña económica para familias" 
                                    imagen="/tour3.png" 
                                    capacidad={15} 
                                    etiqueta="Disponible" 
                                />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}