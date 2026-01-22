"use client";
import { SideBarClient, TopBar, CardCabana, Cuadro } from "../../components";

export default function Cabannas() {

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            <SideBarClient />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 flex flex-col ml-72  pt-20 px-8 min-h-0">
                    <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
                        {/* Fixed header section */}
                        <div className="flex-shrink-0">
                            <h1 className="text-3xl font-bold mb-1 text-black mt-4">Alojamientos</h1>
                            <p className="mb-8 text-verde3">
                                Reserve una cabina para su estadía en Cerro Dragón
                            </p>
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