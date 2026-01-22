/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { CardPaquete, SideBarAdmin, TopBar, ConfirmModal } from "@/app/components";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";


export default function TourInfoPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const id = searchParams.get('id');
    const [nombreTour] = useState('Sendero Dragón');
    const [descripcionTour] = useState('Recorrido completo del sendero principal, se proporciona comida y un guía para la experiencia');
    const [duracionTour] = useState('2 horas');
    const [capacidadTour] = useState(15);
    const [etiquetaTour] = useState('Moderado');
    const [experienciasCompletadas] = useState(121);
    const [paquetes] = useState([
        { nombre: 'Paquete 1', descripcion: 'Incluye: Almuerzo, Guía y Poliza INS', precio: 50 },
        { nombre: 'Paquete 2', descripcion: 'Incluye: Almuerzo, autoguiado', precio: 30 }
    ]);
    const [imagenTour] = useState('/tour1.png');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [paqueteToDelete, setPaqueteToDelete] = useState<number | null>(null);

    const handleDeletePaquete = (index: number) => {
        setPaqueteToDelete(index);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        // TODO: Implementar lógica para eliminar paquete
        console.log('Eliminar paquete', paqueteToDelete);
        setShowDeleteModal(false);
        setPaqueteToDelete(null);
    };

    const handleEditPaquete = (index: number) => {
        router.push(`/admin/tours/editar-paquete?tourId=${id}&paqueteId=${index}`);
    };

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            <SideBarAdmin />
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
                                <div className="flex gap-3">
                                    <Link href={`/admin/tours/nuevo-paquete?tourId=${id}`}>
                                        <button
                                            type="button"
                                            className="mt-1 text-white bg-amarillo hover:bg-yellow-600 font-medium rounded-xl 
                                            text-md px-5 py-2.5 text-center flex items-center justify-center gap-2"
                                        >
                                            <svg
                                                className="w-6 h-6 text-white"
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
                                                    d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                                />
                                            </svg>
                                            Nuevo paquete
                                        </button>
                                    </Link>
                                    <Link href={`/admin/tours/editar?tourId=${id}`}>
                                        <button
                                            type="button"
                                            className="mt-1 text-white bg-verde3 hover:bg-verde2 font-medium rounded-xl 
                                            text-md px-5 py-2.5 text-center flex items-center justify-center gap-2"
                                        >
                                            <svg
                                                className="w-6 h-6 text-white"
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
                                                    d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
                                                />
                                            </svg>
                                            Editar Tour
                                        </button>
                                    </Link>
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
                                <p className="mb-24 text-black font-medium"> <span className="text-verde3 font-bold">Etiquetas:</span>     
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
                                
                            <div className="flex flex-col gap-4">
                                <Image
                                    src={imagenTour}
                                    alt={`Imagen del tour ${nombreTour}`}
                                    width={400}
                                    height={300}
                                    className="rounded-xl mt-2 mr-8"
                                />
                                <div className="bg-white rounded-xl p-6 shadow-sm border border-borde1 mr-8">
                                    <h3 className="text-lg font-semibold text-verde3 mb-2">Experiencias completadas</h3>
                                    <p className="text-6xl font-bold text-verde3">{experienciasCompletadas}</p>
                                </div>
                            </div>
                        </div>
                        

                        <div className="ml-12 mb-12">
                            <h3 className="text-2xl font-semibold mb-4 text-verde3">Paquetes Disponibles</h3>
                            <div className="overflow-x-scroll pb-4 max-w-full" style={{scrollbarWidth: 'thin'}}>
                                <div className="flex gap-3 min-w-max pb-2">
                                    {paquetes.map((paquete, index) => (
                                        <div key={index} className="flex-shrink-0 w-60">
                                            <div className="relative">
                                                <CardPaquete nombre={paquete.nombre} descripcion={paquete.descripcion} precio={paquete.precio} />
                                                <div className="flex justify-center gap-4 mt-3">
                                                    <button
                                                        onClick={() => handleEditPaquete(index)}
                                                        className="bg-white border border-borde1 rounded-lg p-2 hover:bg-gray-50 transition"
                                                        title="Editar paquete"
                                                    >
                                                        <svg
                                                            className="w-5 h-5 text-verde3"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
                                                            />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeletePaquete(index)}
                                                        className="bg-white border border-borde1 rounded-lg p-2 hover:bg-gray-50 transition"
                                                        title="Eliminar paquete"
                                                    >
                                                        <svg
                                                            className="w-5 h-5 text-red-500"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                            />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <ConfirmModal
                open={showDeleteModal}
                title="Eliminar Paquete"
                message="¿Está seguro de que desea eliminar este paquete?\nEsta acción no se puede deshacer."
                confirmText="Eliminar"
                cancelText="Cancelar"
                confirmVariant="danger"
                onConfirm={confirmDelete}
                onCancel={() => {
                    setShowDeleteModal(false);
                    setPaqueteToDelete(null);
                }}
            />
        </div>
    );
}