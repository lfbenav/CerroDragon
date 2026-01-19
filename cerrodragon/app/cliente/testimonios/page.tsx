"use client";
import { CardTestimonio, SideBarClient, TopBar } from "@/app/components";

export default function Testimonios() {
    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            <SideBarClient />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 flex flex-col pt-20 px-8 min-h-0">
                    <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
                        <div className="flex-shrink-0 flex justify-between items-center">
                            <div className="">
                                <h1 className="text-3xl font-bold mb-1 text-black mt-4">Testimonios</h1>
                                <p className="mb-4 text-verde3">
                                    Qué opina la gente sobre nosotros!
                                </p>
                                <hr className="border-1 border-borde1 my-4 w-full" />
                            </div>
                            <div className="flex justify-end mb-4">
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
                                    Nuevo Testimonio
                                </button>
                            </div>
                        </div>
                        
                        {/* Scrollable testimonios */}
                        <div className="flex-1 overflow-y-auto min-h-0">
                            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-3 xl:columns-3 gap-6 p-6">
                                <CardTestimonio
                                    nombre="Alex Naranjo Naranjo"
                                    comentario="Lleve ropa cómoda porque si se camina bastante, se disfruta mucho la experiencia!" 
                                    fecha="12 de Marzo de 2024"
                                    likes={34}
                                />
                                <CardTestimonio
                                    nombre="Camila Miranda Canales"
                                    comentario="¡Increíble!" 
                                    fecha="24 de diciembre de 2025"
                                    likes={20}
                                />
                                <CardTestimonio
                                    nombre="Pedro Torres Gonzales"
                                    comentario="¡Fue una experiencia absolutamente maravillosa que superó todas nuestras expectativas! El lugar tiene una magia especial y el tour está tan bien organizado que te permite disfrutar cada segundo sin preocupaciones. Lo más fascinante, sin duda, fue contemplar el amanecer; ver cómo los primeros rayos de luz transformaban el paisaje fue un espectáculo inolvidable. Compartir un momento de tanta paz y belleza con mis seres queridos fue un regalo para el alma. Recomiendo este destino de forma entusiasta a cualquiera que busque desconectar y vivir una aventura auténtica. ¡Es una vivencia que atesoraremos por siempre y que definitivamente planeamos repetir muy pronto!" 
                                    fecha="24 de noviembre de 2025"
                                    likes={10}
                                />
                                <CardTestimonio
                                    nombre="Mariana Ruiz Lopez"
                                    comentario="Amé cada momento del tour. La guía fue muy amable y conocedora." 
                                    fecha="15 de Junio de 2025"
                                    likes={2}
                                />
                                <CardTestimonio
                                    nombre="Sofia Morales Castro"
                                    comentario="Perfecto." 
                                    fecha="3 de Enero de 2025"
                                    likes={18}
                                />
                                <CardTestimonio
                                    nombre="Roberto Silva Mendez"
                                    comentario="Increíble experiencia de aventura. Los paisajes son únicos y la organización impecable. Vale cada peso invertido. Definitivamente una de las mejores experiencias que he tenido en mucho tiempo." 
                                    fecha="28 de Agosto de 2024"
                                    likes={45}
                                />
                                <CardTestimonio
                                    nombre="Ana Lucia Vargas"
                                    comentario="Me encantó la conexión con la naturaleza. Un lugar mágico para desconectarse del estrés diario y recargar energías. La vista desde la cima es simplemente espectacular y el amanecer fue algo fuera de este mundo." 
                                    fecha="10 de Octubre de 2024"
                                    likes={27}
                                />
                                <CardTestimonio
                                    nombre="Diego Fernandez Rojas"
                                    comentario="Excelente atención." 
                                    fecha="5 de Febrero de 2025"
                                    likes={38}
                                />
                                <CardTestimonio
                                    nombre="Valentina Cruz Herrera"
                                    comentario="Una aventura que cambió mi perspectiva. El equipo es súper amigable y el lugar tiene una energía especial que te renueva por completo. Cada paso del sendero vale la pena y la experiencia completa es simplemente memorable. Sin duda volveré con toda mi familia para compartir esta magia con ellos." 
                                    fecha="22 de Septiembre de 2024"
                                    likes={31}
                                />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}