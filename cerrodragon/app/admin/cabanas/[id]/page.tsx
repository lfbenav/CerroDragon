'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { SideBarAdmin, TopBar } from "@/app/components";

export default function ModificarAlojamiento() {
    const params = useParams();
    const id = params?.id as string;
    const [nombre, setNombre] = useState('Cabaña del Dragón');
    const [descripcion, setDescripcion] = useState('Cabaña sencilla perfecta para una familia');
    const [colones, setColones] = useState('5000');
    const [personas, setPersonas] = useState('04');
    const [imagen, setImagen] = useState<File | null>(null);
    const [imagenActual, setImagenActual] = useState('/tour3.png');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        // TODO: Cargar datos de la cabaña según el ID
        // const fetchCabana = async () => {
        //     try {
        //         const response = await fetch(`/api/cabanas/${id}`);
        //         if (!response.ok) throw new Error('Error al cargar la cabaña');
        //         const data = await response.json();
        //         setNombre(data.nombre);
        //         setDescripcion(data.descripcion);
        //         setColones(data.colones);
        //         setPersonas(data.personas);
        //         setImagenActual(data.imagen);
        //     } catch (error) {
        //         console.error('Error:', error);
        //     }
        // };
        // fetchCabana();
    }, [id]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImagen(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!nombre.trim()) {
            setError('El nombre de la cabaña es requerido');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // TODO: Implementar la lógica para actualizar la cabaña
            // const formData = new FormData();
            // formData.append('nombre', nombre.trim());
            // formData.append('descripcion', descripcion.trim());
            // formData.append('colones', colones);
            // formData.append('personas', personas);
            // if (imagen) formData.append('imagen', imagen);

            // const response = await fetch(`/api/cabanas/${id}`, {
            //     method: 'PUT',
            //     body: formData,
            // });

            // if (!response.ok) {
            //     throw new Error('Error al actualizar la cabaña');
            // }

            // Navigate back to management screen
            router.push('/admin/cabanas');
        } catch (error) {
            setError('Error al actualizar la cabaña. Por favor, intente nuevamente.');
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const displayImage = imagen ? URL.createObjectURL(imagen) : imagenActual;

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            <SideBarAdmin />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 flex flex-col ml-72  pt-20 px-8 min-h-0">
                    <div className="max-w-7xl mx-auto w-full flex flex-col">
                        {/* Fixed header section */}
                        <div className="flex-shrink-0">
                            <h1 className="text-3xl font-bold mb-1 text-black mt-4">Modificar Alojamiento</h1>
                            <p className="mb-8 text-verde3">
                                Actualizar los datos de una cabaña
                            </p>
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
                                                Nombre de la Cabaña
                                            </label>
                                            <input
                                                type="text"
                                                id="nombre"
                                                value={nombre}
                                                onChange={(e) => setNombre(e.target.value)}
                                                className="bg-tabla-header border border-borde1 text-verde1 text-sm 
                                                rounded-xl focus:ring-borde2 focus:border-borde2 block w-full px-3 py-2.5 
                                                shadow-xs placeholder:text-verde2 placeholder:font-medium placeholder:opacity-50"
                                                placeholder="Ingrese nombre aquí"
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
                                                placeholder="Cabaña sencilla perfecta para una familia"
                                                disabled={isLoading}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label
                                                    htmlFor="colones"
                                                    className="block mb-2.5 text-md font-medium text-black"
                                                >
                                                    Colones por persona por noche
                                                </label>
                                                <input
                                                    type="number"
                                                    id="colones"
                                                    value={colones}
                                                    onChange={(e) => setColones(e.target.value)}
                                                    className="bg-tabla-header border border-borde1 text-verde1 text-sm 
                                                    rounded-xl focus:ring-borde2 focus:border-borde2 block w-full px-3 py-2.5 
                                                    shadow-xs placeholder:text-verde2 placeholder:font-medium placeholder:opacity-50"
                                                    placeholder="5000"
                                                    disabled={isLoading}
                                                    min="0"
                                                />
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
                                                    rounded-xl focus:ring-borde2 focus:border-borde2 block w-full px-3 py-2.5 
                                                    shadow-xs placeholder:text-verde2 placeholder:font-medium placeholder:opacity-50"
                                                    placeholder="04"
                                                    disabled={isLoading}
                                                    min="1"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right column - Image */}
                                    <div>
                                        <label className="block mb-2.5 text-md font-medium text-black">
                                            Imagen
                                        </label>
                                        <div className="border-2 border-borde1 rounded-xl h-64 flex items-center justify-center bg-tabla-header overflow-hidden">
                                            <div className="relative w-full h-full">
                                                <img 
                                                    src={displayImage} 
                                                    alt="Cabaña" 
                                                    className="w-full h-full object-cover"
                                                />
                                                <label 
                                                    htmlFor="imagen-upload" 
                                                    className="absolute bottom-2 right-2 bg-verde3 hover:bg-verde2 text-white px-3 py-1.5 rounded-lg cursor-pointer text-sm flex items-center gap-2"
                                                >
                                                    <svg 
                                                        className="w-4 h-4"
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
                                                    Cambiar
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
                                        onClick={() => router.push('/admin/cabanas')}
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
                                            'Guardar'
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
