'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SideBarAdmin, TopBar } from "@/app/components";

export default function NuevoTour() {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [horas, setHoras] = useState('');
    const [dias, setDias] = useState('');
    const [personas, setPersonas] = useState('');
    const [precio, setPrecio] = useState('');
    const [etiquetas, setEtiquetas] = useState<string[]>([]);
    const [imagen, setImagen] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const etiquetasDisponibles = ['Experto', 'Moderado', 'Fácil', 'Todos'];

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!nombre.trim()) {
            setError('El nombre del tour es requerido');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            let imageUrl: string | null = null;

            /* =========================
            1. SUBIR IMAGEN (si existe)
            ========================== */
            if (imagen) {
                const formData = new FormData();
                formData.append('image', imagen);

                const imgRes = await fetch(
                    'http://localhost:3000/images/upload/tours',
                    {
                        method: 'POST',
                        body: formData,
                    }
                );

                const imgJson = await imgRes.json();

                if (!imgRes.ok) {
                    throw new Error(imgJson.message || 'Error al subir la imagen');
                }

                imageUrl = `http://localhost:3000${imgJson.file.path}`;
            }

            /* =========================
            2. CREAR TOUR
            ========================== */
            const tourRes = await fetch('http://localhost:3000/tours', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: nombre.trim(),
                    description: descripcion.trim() || null,
                    duration_hours: Number(horas) || 0,
                    duration_days: Number(dias) || 0,
                    max_persons: Number(personas),
                    person_price: Number(precio),
                    image_url: imageUrl,
                    base_location: null,
                }),
            });

            const tourJson = await tourRes.json();

            if (!tourRes.ok) {
                throw new Error(tourJson.message || 'Error al crear el tour');
            }

            /* =========================
            3. REDIRECCIONAR AL TOUR
            ========================== */
            router.push(`/admin/tours/info?id=${tourJson.data.id}`);

        } catch (error) {
            console.error(error);
            setError('Error al guardar el tour. Por favor, intente nuevamente.');
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

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            <SideBarAdmin />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 flex flex-col ml-72 pt-20 px-8 min-h-0">
                    <div className="max-w-7xl mx-auto w-full flex flex-col">
                        {/* Fixed header section */}
                        <div className="flex-shrink-0">
                            <h1 className="text-3xl font-bold mb-1 text-black mt-4">Nuevo Tour</h1>
                            <p className="mb-8 text-verde3">
                                Complete la información
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
                                                placeholder="ej. Aventúrese en el gran sendero del dragón para vivir una experiencia de otro mundo"
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
                                                        placeholder="00"
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
                                                placeholder="00"
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

                                    {/* Right column - Image upload */}
                                    <div>
                                        <label className="block mb-2.5 text-md font-medium text-black">
                                            Imagen
                                        </label>
                                        <div className="border-2 border-dashed border-borde1 rounded-xl h-80 flex items-center justify-center bg-tabla-header">
                                            {imagen ? (
                                                <div className="text-center w-full h-full p-4">
                                                    <img 
                                                        src={URL.createObjectURL(imagen)} 
                                                        alt="Preview" 
                                                        className="max-h-64 mx-auto rounded-lg"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setImagen(null)}
                                                        className="mt-2 text-sm text-red-500 hover:text-red-700"
                                                    >
                                                        Eliminar imagen
                                                    </button>
                                                </div>
                                            ) : (
                                                <label htmlFor="imagen-upload" className="cursor-pointer">
                                                    <div className="text-center text-verde2">
                                                        <svg 
                                                            className="w-20 h-20 mx-auto mb-2 text-verde2"
                                                            xmlns="http://www.w3.org/2000/svg" 
                                                            fill="none" 
                                                            viewBox="0 0 24 24" 
                                                            stroke="currentColor"
                                                        >
                                                            <path 
                                                                strokeLinecap="round" 
                                                                strokeLinejoin="round" 
                                                                strokeWidth={1.5} 
                                                                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" 
                                                            />
                                                            <path 
                                                                strokeLinecap="round" 
                                                                strokeLinejoin="round" 
                                                                strokeWidth={1.5} 
                                                                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" 
                                                            />
                                                        </svg>
                                                        <p className="text-sm">Haga clic para subir imagen</p>
                                                    </div>
                                                    <input
                                                        id="imagen-upload"
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                        className="hidden"
                                                        disabled={isLoading}
                                                    />
                                                </label>
                                            )}
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
                                        onClick={() => router.push('/admin/tours')}
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
                                                Añadir
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
