'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SideBarAdmin, TopBar } from "@/app/components";

export default function EditarTour() {
    const searchParams = useSearchParams();
    const tourId = searchParams.get('tourId');
    const [nombre, setNombre] = useState('Sendero del Dragón');
    const [descripcion, setDescripcion] = useState('Recorrido completo del sendero principal, se proporciona comida y un guía para la experiencia');
    const [horas, setHoras] = useState('2');
    const [dias, setDias] = useState('00');
    const [personas, setPersonas] = useState('15');
    const [precio, setPrecio] = useState('15000');
    const [etiquetas, setEtiquetas] = useState<string[]>(['Experto', 'Moderado']);
    const [imagen, setImagen] = useState<File | null>(null);
    const [imagenActual, setImagenActual] = useState('/tour1.png');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const etiquetasDisponibles = ['Experto', 'Moderado', 'Fácil', 'Todos'];

    useEffect(() => {
        // TODO: Cargar datos del tour según el tourId
        // const fetchTour = async () => {
        //     try {
        //         const response = await fetch(`/api/tours/${tourId}`);
        //         if (!response.ok) throw new Error('Error al cargar el tour');
        //         const data = await response.json();
        //         setNombre(data.nombre);
        //         setDescripcion(data.descripcion);
        //         setHoras(data.horas);
        //         setDias(data.dias);
        //         setPersonas(data.personas);
        //         setEtiquetas(data.etiquetas);
        //         setImagenActual(data.imagen);
        //     } catch (error) {
        //         console.error('Error:', error);
        //     }
        // };
        // fetchTour();
    }, [tourId]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImagen(e.target.files[0]);
        }
    };

    const handleEtiquetaToggle = (etiqueta: string) => {
        if (etiquetas.includes(etiqueta)) {
            setEtiquetas(etiquetas.filter(e => e !== etiqueta));
        } else {
            setEtiquetas([...etiquetas, etiqueta]);
        }
    };

    const handleEliminar = () => {
        if (confirm('¿Está seguro de que desea eliminar este tour?')) {
            // TODO: Implementar la lógica para eliminar el tour
            router.push('/admin/tours');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!nombre.trim()) {
            setError('El nombre del tour es requerido');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // TODO: Implementar la lógica para actualizar el tour
            // const formData = new FormData();
            // formData.append('nombre', nombre.trim());
            // formData.append('descripcion', descripcion.trim());
            // formData.append('horas', horas);
            // formData.append('dias', dias);
            // formData.append('personas', personas);
            // formData.append('etiquetas', JSON.stringify(etiquetas));
            // if (imagen) formData.append('imagen', imagen);

            // const response = await fetch(`/api/tours/${tourId}`, {
            //     method: 'PUT',
            //     body: formData,
            // });

            // if (!response.ok) {
            //     throw new Error('Error al actualizar el tour');
            // }

            // Navigate back to info screen
            router.push(`/admin/tours/info?id=${tourId}`);
        } catch (error) {
            setError('Error al actualizar el tour. Por favor, intente nuevamente.');
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getEtiquetaColor = (etiqueta: string) => {
        switch (etiqueta) {
            case 'Experto':
                return 'bg-rojotrans text-rojovino border-rojovino';
            case 'Moderado':
                return 'bg-amarillotrans text-amarillo border-amarillo';
            case 'Fácil':
                return 'bg-verdetrans text-verde3 border-verde3';
            case 'Todos':
                return 'bg-azultrans text-azul1 border-azul1';
            default:
                return 'bg-gray-200 text-gray-700 border-gray-400';
        }
    };

    const displayImage = imagen ? URL.createObjectURL(imagen) : imagenActual;

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            <SideBarAdmin />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 flex flex-col ml-72 pt-20 px-8 min-h-0">
                    <div className="max-w-7xl mx-auto w-full flex flex-col">
                        {/* Fixed header section */}
                        <div className="flex-shrink-0">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h1 className="text-3xl font-bold mb-1 text-black mt-4">Editar Tour</h1>
                                    <p className="mb-8 text-verde3">
                                        Modifique la información
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleEliminar}
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition flex items-center gap-2"
                                >
                                    <svg
                                        className="w-5 h-5"
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
                                    Eliminar
                                </button>
                            </div>
                        </div>
                        
                        {/* Form */}
                        <div className="flex-1 overflow-y-auto">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Left column - Form fields */}
                                    <div className="space-y-4">
                                        <div>
                                            <label
                                                htmlFor="nombre"
                                                className="block mb-2.5 text-md font-medium text-black"
                                            >
                                                Nombre del Tour
                                            </label>
                                            <input
                                                type="text"
                                                id="nombre"
                                                value={nombre}
                                                onChange={(e) => setNombre(e.target.value)}
                                                className="bg-tabla-header border border-borde1 text-verde1 text-sm 
                                                rounded-xl focus:ring-borde2 focus:border-borde2 block w-full px-3 py-2.5 
                                                shadow-xs placeholder:text-verde2 placeholder:font-medium placeholder:opacity-50"
                                                placeholder="Sendero del Dragón"
                                                disabled={isLoading}
                                            />
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="descripcion"
                                                className="block mb-2.5 text-md font-medium text-black"
                                            >
                                                Descripción
                                            </label>
                                            <textarea
                                                id="descripcion"
                                                value={descripcion}
                                                onChange={(e) => setDescripcion(e.target.value)}
                                                rows={4}
                                                className="bg-tabla-header border border-borde1 text-verde1 text-sm 
                                                rounded-xl focus:ring-borde2 focus:border-borde2 block w-full px-3 py-2.5 
                                                shadow-xs placeholder:text-verde2 placeholder:font-medium placeholder:opacity-50 resize-none"
                                                placeholder="Recorrido completo del sendero principal, se proporciona comida y un guía para la experiencia"
                                                disabled={isLoading}
                                            />
                                        </div>

                                        <div>
                                            <label className="block mb-2.5 text-md font-medium text-black">
                                                Tiempo:
                                            </label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        id="horas"
                                                        value={horas}
                                                        onChange={(e) => setHoras(e.target.value)}
                                                        className="bg-tabla-header border border-borde1 text-verde1 text-sm 
                                                        rounded-xl focus:ring-borde2 focus:border-borde2 block w-20 px-3 py-2.5 
                                                        shadow-xs placeholder:text-verde2 placeholder:font-medium placeholder:opacity-50"
                                                        placeholder="2"
                                                        disabled={isLoading}
                                                        min="0"
                                                    />
                                                    <span className="text-verde1 font-medium">Horas</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        id="dias"
                                                        value={dias}
                                                        onChange={(e) => setDias(e.target.value)}
                                                        className="bg-tabla-header border border-borde1 text-verde1 text-sm 
                                                        rounded-xl focus:ring-borde2 focus:border-borde2 block w-20 px-3 py-2.5 
                                                        shadow-xs placeholder:text-verde2 placeholder:font-medium placeholder:opacity-50"
                                                        placeholder="00"
                                                        disabled={isLoading}
                                                        min="0"
                                                    />
                                                    <span className="text-verde1 font-medium">Días</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="personas"
                                                className="block mb-2.5 text-md font-medium text-black"
                                            >
                                                Personas
                                            </label>
                                            <input
                                                type="number"
                                                id="personas"
                                                value={personas}
                                                onChange={(e) => setPersonas(e.target.value)}
                                                className="bg-tabla-header border border-borde1 text-verde1 text-sm 
                                                rounded-xl focus:ring-borde2 focus:border-borde2 block w-32 px-3 py-2.5 
                                                shadow-xs placeholder:text-verde2 placeholder:font-medium placeholder:opacity-50"
                                                placeholder="15"
                                                disabled={isLoading}
                                                min="1"
                                            />
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="precio"
                                                className="block mb-2.5 text-md font-medium text-black"
                                            >
                                                Precio por persona (₡)
                                            </label>
                                            <input
                                                type="number"
                                                id="precio"
                                                value={precio}
                                                onChange={(e) => setPrecio(e.target.value)}
                                                className="bg-tabla-header border border-borde1 text-verde1 text-sm 
                                                rounded-xl focus:ring-borde2 focus:border-borde2 block w-full px-3 py-2.5 
                                                shadow-xs placeholder:text-verde2 placeholder:font-medium placeholder:opacity-50"
                                                placeholder="15000"
                                                disabled={isLoading}
                                                min="0"
                                                step="100"
                                            />
                                        </div>

                                        <div>
                                            <label className="block mb-2.5 text-md font-medium text-black">
                                                Etiquetas:
                                            </label>
                                            <div className="flex gap-3">
                                                {etiquetasDisponibles.map((etiqueta) => (
                                                    <button
                                                        key={etiqueta}
                                                        type="button"
                                                        onClick={() => handleEtiquetaToggle(etiqueta)}
                                                        className={`px-4 py-2 rounded-lg border-2 font-semibold transition-all ${
                                                            etiquetas.includes(etiqueta)
                                                                ? getEtiquetaColor(etiqueta)
                                                                : 'bg-white text-gray-400 border-gray-300 hover:border-gray-400'
                                                        }`}
                                                        disabled={isLoading}
                                                    >
                                                        {etiquetas.includes(etiqueta) && (
                                                            <svg
                                                                className="w-4 h-4 inline mr-1"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={3}
                                                                    d="M5 13l4 4L19 7"
                                                                />
                                                            </svg>
                                                        )}
                                                        {etiqueta}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right column - Image */}
                                    <div>
                                        <label className="block mb-2.5 text-md font-medium text-black">
                                            Imagen
                                        </label>
                                        <div className="border-2 border-borde1 rounded-xl h-80 flex items-center justify-center bg-tabla-header overflow-hidden">
                                            <div className="relative w-full h-full">
                                                <img 
                                                    src={displayImage} 
                                                    alt="Tour" 
                                                    className="w-full h-full object-cover"
                                                />
                                                <label 
                                                    htmlFor="imagen-upload" 
                                                    className="absolute bottom-2 right-2 bg-amarillo hover:bg-yellow-600 text-white px-3 py-1.5 rounded-lg cursor-pointer text-sm flex items-center gap-2"
                                                >
                                                    <svg 
                                                        className="w-5 h-5"
                                                        xmlns="http://www.w3.org/2000/svg" 
                                                        fill="none" 
                                                        viewBox="0 0 24 24" 
                                                        stroke="currentColor"
                                                    >
                                                        <path 
                                                            strokeLinecap="round" 
                                                            strokeLinejoin="round" 
                                                            strokeWidth={2} 
                                                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" 
                                                        />
                                                        <path 
                                                            strokeLinecap="round" 
                                                            strokeLinejoin="round" 
                                                            strokeWidth={2} 
                                                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" 
                                                        />
                                                    </svg>
                                                    Cambiar foto
                                                    <input
                                                        id="imagen-upload"
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                        className="hidden"
                                                        disabled={isLoading}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {error && (
                                    <div className="text-red-500 text-sm font-medium">
                                        {error}
                                    </div>
                                )}
                                
                                <div className="flex justify-end space-x-4 pb-8">
                                    <button
                                        type="button"
                                        onClick={() => router.push(`/admin/tours/info?id=${tourId}`)}
                                        className="mt-1 text-verde3 bg-white hover:bg-gray-50 font-medium rounded-xl 
                                        text-md px-5 py-2.5 text-center border border-verde3"
                                        disabled={isLoading}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="mt-1 text-white bg-verde3 hover:bg-verde2 font-medium rounded-xl 
                                        text-md px-5 py-2.5 text-center flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {isLoading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Guardando...
                                            </>
                                        ) : (
                                            <>
                                                <svg
                                                    className="w-5 h-5"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                                Confirmar
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
