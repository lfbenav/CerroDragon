"use client";
import { CardGuide, SideBarClient, TopBar } from "@/app/components";

export default function Guias() {
    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            <SideBarClient />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 flex flex-col ml-72  pt-20 px-8 min-h-0">
                    <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
                        {/* Fixed header section */}
                        <div className="flex-shrink-0">
                            <h1 className="text-3xl font-bold mb-1 text-black mt-4">Nuestros Guías</h1>
                            <p className="mb-4 text-verde3">
                                Conócenos!
                            </p>
                        </div>
                        
                        {/* Scrollable tours */}
                        <div className="flex-1 overflow-y-auto min-h-0">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-12 p-6">
                                <CardGuide
                                    nombre="Alex Naranjo"
                                    activo="Activo" 
                                    imagen="/guia1.png"
                                />
                                <CardGuide
                                    nombre="Luis Perez"
                                    activo="Inactivo" 
                                    imagen="/guia2.png"
                                />
                                <CardGuide
                                    nombre="Maria Gomez"
                                    activo="Activo" 
                                    imagen="/guia3.png"
                                />
                                <CardGuide
                                    nombre="Carlos Ruiz" 
                                    activo="Activo" 
                                    imagen="/guia4.png"
                                />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}