"use client";
import { SideBarClient, TopBar, CardTour, SearchBarAdmin} from "../../components";

export default function Tours() {

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            <SideBarClient />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 flex flex-col ml-72  ml-72 pt-20 px-8 min-h-0">
                    <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
                        {/* Fixed header section */}
                        <div className="flex-shrink-0">
                            <h1 className="text-3xl font-bold mb-1 text-black mt-4">Gestión de Tours</h1>
                            <p className="mb-8 text-verde3">
                                Administra tours y experiencias!
                            </p>
                            <div className="mb-6">
                                <SearchBarAdmin texto="Buscar tour..."/>
                            </div>
                        </div>
                        
                        {/* Scrollable tours */}
                        <div className="flex-1 overflow-y-auto min-h-0">
                            <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6 p-6">
                                <CardTour 
                                    id={1}
                                    nombre="Tour al Amanecer" 
                                    descripcion="Disfruta de un espectacular amanecer en Cerro Dragón con nuestro tour guiado." 
                                    precio={85} 
                                    imagen="/tour1.png" 
                                    capacidad={10} 
                                    duracion="3 horas" 
                                    etiqueta="Todos" 
                                />
                                <CardTour 
                                    id={2}
                                    nombre="Aventura Nocturna" 
                                    descripcion="Explora los senderos misteriosos del Cerro bajo la luz de las estrellas." 
                                    precio={120} 
                                    imagen="/tour2.png" 
                                    capacidad={8} 
                                    duracion="5 horas" 
                                    etiqueta="Moderado" 
                                />
                                <CardTour 
                                    id={3}
                                    nombre="Expedición Extrema" 
                                    descripcion="Desafía tus límites con esta expedición completa a las cumbres más altas." 
                                    precio={250} 
                                    imagen="/tour3.png" 
                                    capacidad={6} 
                                    duracion="1 día" 
                                    etiqueta="Experto" 
                                />
                                <CardTour 
                                    id={4}
                                    nombre="Caminata Familiar" 
                                    descripcion="Un tour relajado perfecto para toda la familia con paradas para descanso." 
                                    precio={65} 
                                    imagen="/tour1.png" 
                                    capacidad={15} 
                                    duracion="2 horas" 
                                    etiqueta="Principiante" 
                                />
                            <CardTour 
                                id={5}
                                nombre="Safari Fotográfico" 
                                descripcion="Captura la belleza natural del Cerro con nuestro guía especializado en fotografía." 
                                precio={95} 
                                imagen="/tour2.png" 
                                capacidad={12} 
                                duracion="4 horas" 
                                etiqueta="Todos" 
                            />
                            <CardTour 
                                id={6}
                                nombre="Ruta de las Cascadas" 
                                descripcion="Descubre las cascadas ocultas en un recorrido lleno de aventura y naturaleza." 
                                precio={110} 
                                imagen="/tour3.png" 
                                capacidad={10} 
                                duracion="6 horas" 
                                etiqueta="Moderado" 
                            />
                            <CardTour 
                                id={7}
                                nombre="Trekking de Resistencia" 
                                descripcion="Una prueba de resistencia física en los senderos más desafiantes del Cerro." 
                                precio={180} 
                                imagen="/tour1.png" 
                                capacidad={8} 
                                duracion="8 horas" 
                                etiqueta="Experto" 
                            />
                            <CardTour 
                                id={8}
                                nombre="Picnic en las Alturas" 
                                descripcion="Disfruta de un almuerzo con vista panorámica en uno de los miradores más hermosos." 
                                precio={75} 
                                imagen="/tour2.png" 
                                capacidad={20} 
                                duracion="3 horas" 
                                etiqueta="Principiante" 
                            />
                            <CardTour 
                                id={9}
                                nombre="Escalada Técnica" 
                                descripcion="Para expertos en escalada que buscan conquistar las paredes rocosas más retadoras." 
                                precio={300} 
                                imagen="/tour3.png" 
                                capacidad={4} 
                                duracion="1 día" 
                                etiqueta="Experto" 
                            />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}