'use client';
import { CardPromocion, SearchBar, SideBarClient, TopBar } from "@/app/components";

export default function Promociones() {
    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            <SideBarClient />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 flex flex-col pt-20 px-8 min-h-0">
                    <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
                        {/* Fixed header section */}
                        <div className="flex-shrink-0">
                            <h1 className="text-3xl font-bold mb-1 text-black mt-4">Promociones</h1>
                            <p className="mb-8 text-verde3">
                                Aproveche nuestras ofertas!
                            </p>
                            <div className="mb-6">
                                <SearchBar texto="Buscar promoción..."/>
                            </div>
                        </div>
                        
                        {/* Scrollable tours */}
                        <div className="flex-1 overflow-y-auto min-h-0">
                            <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6 p-6">
                                <CardPromocion 
                                    id={1}
                                    nombre="50% OFF - Tour al Amanecer" 
                                    descripcion="Disfruta de un espectacular amanecer en Cerro Dragón con 50% de descuento." 
                                    precioAntes={170} 
                                    precioAhora={85}
                                    capacidad={10}
                                    descuento={50}
                                    duracion="3 horas"
                                    etiqueta="Todos"
                                    imagen="/tour1.png" 
                                />
                                <CardPromocion 
                                    id={2}
                                    nombre="Aventura Nocturna - Precio Especial" 
                                    descripcion="Explora los senderos misteriosos del Cerro con precio promocional." 
                                    precioAntes={150} 
                                    precioAhora={120}
                                    capacidad={8}
                                    descuento={20}
                                    duracion="5 horas"
                                    etiqueta="Moderado"
                                    imagen="/tour2.png" 
                                />
                                <CardPromocion 
                                    id={3}
                                    nombre="Expedición Extrema - Oferta Limitada" 
                                    descripcion="Desafía tus límites con esta expedición completa a precio especial." 
                                    precioAntes={300} 
                                    precioAhora={250}
                                    capacidad={6}
                                    descuento={17}
                                    duracion="1 día"
                                    etiqueta="Experto"
                                    imagen="/tour3.png" 
                                />
                                <CardPromocion 
                                    id={4}
                                    nombre="Caminata Familiar - Promoción Especial" 
                                    descripcion="Un tour relajado perfecto para toda la familia con descuento familiar." 
                                    precioAntes={80} 
                                    precioAhora={65}
                                    capacidad={15}
                                    descuento={19}
                                    duracion="2 horas"
                                    etiqueta="Principiante"
                                    imagen="/tour1.png" 
                                />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}