"use client";
import { CardPunto, SideBarClient, TopBar, WhatsAppButton } from "@/app/components";

export default function Puntos() {
    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            <SideBarClient />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 flex flex-col pt-20 px-8 min-h-0">
                    <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
                        <div className="flex-shrink-0 flex justify-between items-center">
                            <div className="">
                                <h1 className="text-3xl font-bold mb-1 text-black mt-4">Puntos de encuentro</h1>
                                <p className="mb-4 text-verde3">
                                    Le ofrecemos transporte desde estos puntos estratégicos.
                                </p>
                                <hr className="border-1 border-borde1 my-4" />
                            </div>
                            <div className="flex justify-end mb-4">
                                <WhatsAppButton />
                            </div>
                        </div>
                        
                        {/* Scrollable puntos */}
                        <div className="overflow-x-auto mb-6">
                            <div className="flex gap-12 p-6 min-w-max">
                                <CardPunto
                                    nombre="Uruca"
                                    ubicacion="https://share.google/ncSBFPw2B6kwbG8Lw"
                                    direccion="500 mts este del palo de mamón chino" 
                                />
                                <CardPunto
                                    nombre="Ceiba Alta"
                                    ubicacion="https://share.google/ncSBFPw2B6kwbG8Lw"
                                    direccion="200 mts oeste del palo de mango" 
                                />
                                <CardPunto
                                    nombre="Ceiba Alta"
                                    ubicacion="https://share.google/ncSBFPw2B6kwbG8Lw"
                                    direccion="200 mts oeste del palo de mango" 
                                />
                                <CardPunto
                                    nombre="Ceiba Alta"
                                    ubicacion="https://share.google/ncSBFPw2B6kwbG8Lw"
                                    direccion="200 mts oeste del palo de mango" 
                                />
                                <CardPunto
                                    nombre="Ceiba Alta"
                                    ubicacion="https://share.google/ncSBFPw2B6kwbG8Lw"
                                    direccion="200 mts oeste del palo de mango" 
                                />
                                <CardPunto
                                    nombre="Ceiba Alta"
                                    ubicacion="https://share.google/ncSBFPw2B6kwbG8Lw"
                                    direccion="200 mts oeste del palo de mango" 
                                />
                                <CardPunto
                                    nombre="Ceiba Alta"
                                    ubicacion="https://share.google/ncSBFPw2B6kwbG8Lw"
                                    direccion="200 mts oeste del palo de mango" 
                                />
                            </div>
                        </div>
                        <div className="">
                            <p className="text-md text-verde3 mb-6 font-medium">
                                Si desea solicitar un servicio de trasbordo en alguno de los puntos de encuentro debe enviar un mensaje de whatsapp con la siguiente información: 
                                <span className="font-bold text-black"> 
                                    <br/>
                                    <br/> Nombre del Cliente
                                    <br/>Identificador de Reserva
                                    <br/>Solicita transporte desde
                                </span>
                            </p>
                            <h2 className="text-2xl font-bold mb-2 text-black mt-4">Ejemplo</h2>
                            <hr className="border-1 border-borde1" />
                            <p className="text-md text-verde3 mb-1 font-medium">
                                <span className="font-bold text-black"> 
                                    <br/> Nombre del Cliente: <span className="text-amarillo">Juan Pérez</span>
                                    <br/>Identificador de Reserva: <span className="text-amarillo">RV-2345</span>
                                    <br/>Solicita transporte desde: <span className="text-amarillo">Uruca</span>
                                </span>
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}