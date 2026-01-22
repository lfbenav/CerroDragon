"use client";
import { CardIncidencia, SideBarClient, TopBar } from "@/app/components";

export default function Clima() {
    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            <SideBarClient />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 flex flex-col ml-72  pt-20 px-8 min-h-0">
                    <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
                        {/* Fixed header section */}
                        <div className="flex-shrink-0">
                            <h1 className="text-3xl font-bold mb-1 text-black mt-4">Alertas de Clima e Incidencias</h1>
                            <p className="mb-4 text-verde3">
                                Cuando hay alguna alerta es posible que se cancelen o reasignen los tours programados
                            </p>
                            <hr className="border-1 border-borde1 my-4 w-full" />
                        </div>
                        
                        {/* Scrollable tours */}
                        <div className="flex-1 overflow-y-auto min-h-0">
                            <div className="grid grid-cols-1 p-6 gap-6">
                                <CardIncidencia
                                    titulo="Fuertes vientos en la zona"
                                    descripcion="Se esperan ráfagas de viento que podrían afectar la seguridad de los tours al aire libre. Recomendamos a los clientes estar atentos a las actualizaciones y seguir las indicaciones del personal."
                                    fecha="25 de noviembre de 2025" 
                                    tipo={"leve"}                                
                                />
                                <CardIncidencia
                                    titulo="Lluvia torrencial prevista"
                                    descripcion="Se pronostica lluvia intensa para las próximas 6 horas. Todos los tours programados para hoy han sido suspendidos por motivos de seguridad. Contacte con nuestro personal para reprogramar."
                                    fecha="26 de noviembre de 2025" 
                                    tipo={"critico"}                                
                                />
                                <CardIncidencia
                                    titulo="Temperatura extrema"
                                    descripcion="Las temperaturas alcanzarán los 38°C durante el mediodía. Se recomienda a los visitantes hidratarse constantemente y evitar la exposición prolongada al sol."
                                    fecha="24 de noviembre de 2025" 
                                    tipo={"grave"}                                
                                />
                                <CardIncidencia
                                    titulo="Cierre temporal del sendero norte"
                                    descripcion="Debido a trabajos de mantenimiento en el sendero norte, esta ruta permanecerá cerrada hasta nuevo aviso. Los tours han sido redirigidos al sendero sur sin costo adicional."
                                    fecha="23 de noviembre de 2025" 
                                    tipo={"moderado"}                                
                                />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}