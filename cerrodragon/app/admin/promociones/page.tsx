"use client";
import { useState, useEffect } from "react";
import { SideBarAdmin, TopBar, CardPromocionAdmin, SearchBarAdmin, Cuadro} from "../../components";
import Link from "next/link";

interface Promocion {
    id: number;
    nombre: string;
    descripcion: string;
    precioAntes: number;
    precioAhora: number;
    descuento: number;
    imagen: string;
    capacidad: number;
    duracion: string;
    etiqueta: string;
    activo?: boolean;
}

export default function Promociones() {
    const [promociones, setPromociones] = useState<Promocion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    // Mock data for development
    const mockPromociones: Promocion[] = [
        { id: 1, nombre: "Tour al Amanecer", descripcion: "Disfruta de un espectacular amanecer en Cerro Dragón con nuestro tour guiado.", precioAntes: 100, precioAhora: 85, descuento: 15, imagen: "/tour1.png", capacidad: 10, duracion: "3 horas", etiqueta: "Todos", activo: true },
        { id: 2, nombre: "Aventura Nocturna", descripcion: "Explora los senderos misteriosos del Cerro bajo la luz de las estrellas.", precioAntes: 150, precioAhora: 120, descuento: 20, imagen: "/tour2.png", capacidad: 8, duracion: "5 horas", etiqueta: "Moderado", activo: true },
        { id: 3, nombre: "Expedición Extrema", descripcion: "Desafía tus límites con esta expedición completa a las cumbres más altas.", precioAntes: 300, precioAhora: 250, descuento: 17, imagen: "/tour3.png", capacidad: 6, duracion: "1 día", etiqueta: "Experto", activo: true },
        { id: 4, nombre: "Caminata Familiar", descripcion: "Un tour relajado perfecto para toda la familia con paradas para descanso.", precioAntes: 80, precioAhora: 65, descuento: 19, imagen: "/tour1.png", capacidad: 15, duracion: "2 horas", etiqueta: "Principiante", activo: false },
        { id: 5, nombre: "Safari Fotográfico", descripcion: "Captura la belleza natural del Cerro con nuestro guía especializado en fotografía.", precioAntes: 110, precioAhora: 95, descuento: 14, imagen: "/tour2.png", capacidad: 12, duracion: "4 horas", etiqueta: "Todos", activo: true },
        { id: 6, nombre: "Ruta de las Cascadas", descripcion: "Descubre las cascadas ocultas en un recorrido lleno de aventura y naturaleza.", precioAntes: 130, precioAhora: 110, descuento: 15, imagen: "/tour3.png", capacidad: 10, duracion: "6 horas", etiqueta: "Moderado", activo: true }
    ];

    const fetchPromociones = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // TODO: Reemplazar con endpoint real de API
            // const response = await fetch('/api/promociones');
            // if (!response.ok) throw new Error('Failed to fetch promociones');
            // const data = await response.json();
            // setPromociones(data);
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 500));
            setPromociones(mockPromociones);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error loading promociones');
        } finally {
            setLoading(false);
        }
    };

    //TODO: Poner el search funcional en components
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleSearch = (term: string) => {
        setSearchTerm(term);
    };

    // Filter promociones based on search term
    const filteredPromociones = promociones.filter(promocion =>
        promocion.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        promocion.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        promocion.etiqueta.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        fetchPromociones();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const activePromociones = promociones.filter(promocion => promocion.activo !== false);

    const handleDeletePromocion = async (id: number) => {
        try {
            // Update local state immediately for better UX
            setPromociones(prev => prev.filter(promocion => promocion.id !== id));

            // TODO: Reemplaza con llamada real a la API
            // const response = await fetch(`/api/promociones/${id}`, {
            //     method: 'DELETE',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     }
            // });
            // 
            // if (!response.ok) {
            //     throw new Error('Failed to delete promotion');
            // }
            
            console.log(`Promoción ${id} eliminada exitosamente`);
        } catch (error) {
            console.error('Error deleting promotion:', error);
            // Revert the change if API call fails
            setPromociones(mockPromociones);
            setError('Error al eliminar la promoción. Inténtalo de nuevo.');
            
            // Clear error after 3 seconds
            setTimeout(() => setError(null), 3000);
        }
    };

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            <SideBarAdmin/>
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 flex flex-col ml-72  ml-72 pt-20 px-8 min-h-0">
                    <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
                        {/* Fixed header section */}
                        <div className="flex-shrink-0">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h1 className="text-3xl font-bold mb-1 text-black mt-4">Gestión de Promociones</h1>
                                    <p className="mb-8 text-verde3">
                                        Administra promociones y descuentos especiales
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Link href="/admin/promociones/new">
                                        <button className="bg-verde3 text-white px-4 py-2 rounded-lg hover:bg-verde2 transition justify-between items-center flex">
                                            <svg
                                                className="w-6 h-6 text-white mr-2"
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
                                            Nueva Promoción
                                        </button>
                                    </Link>
                                </div>
                            </div>
                            <div className="mb-6 gap-4 flex space-x-4">
                                <Cuadro texto="Promociones Totales" cantidad={promociones.length} />
                                <Cuadro texto="Promociones Activas" cantidad={activePromociones.length} />
                                <Cuadro texto="Promociones Inactivas" cantidad={promociones.length - activePromociones.length} />
                            </div>
                            <div className="mb-6">
                                <SearchBarAdmin texto="Buscar promoción..." />
                            </div>
                        </div>
                        
                        {/* Scrollable promociones */}
                        <div className="flex-1 overflow-y-auto min-h-0">
                            {loading ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="text-verde3 text-lg">Cargando promociones...</div>
                                </div>
                            ) : error ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="text-red-500 text-lg">{error}</div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6 p-6">
                                    {filteredPromociones.map((promocion) => (
                                        <CardPromocionAdmin 
                                            key={promocion.id}
                                            id={promocion.id}
                                            nombre={promocion.nombre}
                                            descripcion={promocion.descripcion}
                                            precioAntes={promocion.precioAntes}
                                            precioAhora={promocion.precioAhora}
                                            descuento={promocion.descuento}
                                            imagen={promocion.imagen}
                                            capacidad={promocion.capacidad}
                                            duracion={promocion.duracion}
                                            etiqueta={promocion.etiqueta}
                                            onDelete={() => handleDeletePromocion(promocion.id)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}