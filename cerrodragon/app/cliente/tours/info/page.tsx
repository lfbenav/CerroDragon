/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { CardPaquete, SideBarClient, TopBar } from "@/app/components";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

// Datos de ejemplo de tours - Reemplazar con llamada a API
const toursData = [
    { id: 1, nombre: "Tour al Amanecer", descripcion: "Disfruta de un espectacular amanecer en Cerro Dragón con nuestro tour guiado.", precio: 85, capacidad: 10, duracion: "3 horas", etiqueta: "Todos", imagen: "/tour1.png" },
    { id: 2, nombre: "Aventura Nocturna", descripcion: "Explora los senderos misteriosos del Cerro bajo la luz de las estrellas.", precio: 120, capacidad: 8, duracion: "5 horas", etiqueta: "Moderado", imagen: "/tour2.png" },
    { id: 3, nombre: "Expedición Extrema", descripcion: "Desafía tus límites con esta expedición completa a las cumbres más altas.", precio: 250, capacidad: 6, duracion: "1 día", etiqueta: "Experto", imagen: "/tour3.png" },
    { id: 4, nombre: "Caminata Familiar", descripcion: "Un tour relajado perfecto para toda la familia con paradas para descanso.", precio: 65, capacidad: 15, duracion: "2 horas", etiqueta: "Principiante", imagen: "/tour1.png" },
    { id: 5, nombre: "Safari Fotográfico", descripcion: "Captura la belleza natural del Cerro con nuestro guía especializado en fotografía.", precio: 95, capacidad: 12, duracion: "4 horas", etiqueta: "Todos", imagen: "/tour2.png" },
    { id: 6, nombre: "Ruta de las Cascadas", descripcion: "Descubre las cascadas ocultas en un recorrido lleno de aventura y naturaleza.", precio: 110, capacidad: 10, duracion: "6 horas", etiqueta: "Moderado", imagen: "/tour3.png" },
    { id: 7, nombre: "Trekking de Resistencia", descripcion: "Una prueba de resistencia física en los senderos más desafiantes del Cerro.", precio: 180, capacidad: 8, duracion: "8 horas", etiqueta: "Experto", imagen: "/tour1.png" },
    { id: 8, nombre: "Picnic en las Alturas", descripcion: "Disfruta de un almuerzo con vista panorámica en uno de los miradores más hermosos.", precio: 55, capacidad: 20, duracion: "3 horas", etiqueta: "Todos", imagen: "/tour2.png" },
];

export default function TourInfoPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const id = searchParams.get('id');
    const tourId = id ? parseInt(id) : 1;
    
    const [nombreTour, setNombreTour] = useState('Sendero Dragón');
    const [descripcionTour, setDescripcionTour] = useState('Recorrido completo del sendero principal, se proporciona comida ');
    const [duracionTour, setDuracionTour] = useState('3 horas');
    const [capacidadTour, setCapacidadTour] = useState(10);
    const [precioTour, setPrecioTour] = useState(15000);
    const [etiquetaTour, setEtiquetaTour] = useState('Moderado');
    const [paquetes] = useState([
        { nombre: 'Paquete 1', descripcion: 'Incluye: Almuerzo, Guía y Poliza INS', precio: 50 },
        { nombre: 'Paquete 2', descripcion: 'Incluye: Almuerzo, autoguiado y sin poliza INS', precio: 30 }
    ]);
    const [imagenTour, setImagenTour] = useState('/tour1.png');

    // Cargar datos del tour según el ID
    useEffect(() => {
        const tour = toursData.find(t => t.id === tourId);
        if (tour) {
            setNombreTour(tour.nombre);
            setDescripcionTour(tour.descripcion);
            setPrecioTour(tour.precio);
            setCapacidadTour(tour.capacidad);
            setDuracionTour(tour.duracion);
            setEtiquetaTour(tour.etiqueta);
            setImagenTour(tour.imagen);
        }
        // TODO: Reemplazar con llamada a API cuando esté disponible
        // const fetchTour = async () => {
        //     try {
        //         const response = await fetch(`/api/tours/${tourId}`);
        //         if (!response.ok) throw new Error('Error al cargar el tour');
        //         const data = await response.json();
        //         setNombreTour(data.nombre);
        //         setDescripcionTour(data.descripcion);
        //         setPrecioTour(data.precio);
        //         setCapacidadTour(data.capacidad);
        //         setDuracionTour(data.duracion);
        //         setEtiquetaTour(data.etiqueta);
        //         setImagenTour(data.imagen);
        //     } catch (error) {
        //         console.error('Error:', error);
        //     }
        // };
        // fetchTour();
    }, [tourId]);

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
                                    type="button"
                                    onClick={() => router.push(`/cliente/tours/reservar?tourId=${id}&nombre=${encodeURIComponent(nombreTour)}`)}
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
                                <div className="mb-6">
                                    <p className="text-md font-medium text-black">
                                        <span className="text-verde3 font-bold">Precio por persona:</span>
                                        <span className="ml-3 text-2xl font-bold text-naranja">₡{precioTour.toLocaleString()}</span>
                                    </p>
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