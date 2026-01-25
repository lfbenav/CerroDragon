'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SideBarAdmin, TopBar } from "@/app/components";

const API_URL = "http://localhost:3000";

interface Tag {
    id: string;
    name: string;
}

export default function EditarTour() {
    const searchParams = useSearchParams();
    const tourId = searchParams.get('tourId');
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [horas, setHoras] = useState('0');
    const [dias, setDias] = useState('0');
    const [personas, setPersonas] = useState('');
    const [precio, setPrecio] = useState('');
    const [etiquetasSeleccionadas, setEtiquetasSeleccionadas] = useState<string[]>([]); // IDs de tags seleccionados
    const [tagsDisponibles, setTagsDisponibles] = useState<Tag[]>([]); // Tags desde la API
    const [imagen, setImagen] = useState<File | null>(null);
    const [imagenActual, setImagenActual] = useState('/tour1.png');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchTour = async () => {
            if (!tourId) return;
            
            try {
                setLoadingData(true);
                
                // Fetch tour data, tour tags, and all available tags in parallel
                const [tourResponse, tourTagsResponse, allTagsResponse] = await Promise.all([
                    fetch(`${API_URL}/tours/${tourId}`),
                    fetch(`${API_URL}/tours/${tourId}/tags`),
                    fetch(`${API_URL}/tags`)
                ]);
                
                if (!tourResponse.ok) throw new Error('Error al cargar el tour');
                const tourJson = await tourResponse.json();
                const tour = tourJson.data;
                
                setNombre(tour.title || '');
                setDescripcion(tour.description || '');
                setHoras(String(tour.duration_hours || 0));
                setDias(String(tour.duration_days || 0));
                setPersonas(String(tour.max_persons || ''));
                setPrecio(String(tour.person_price || ''));
                
                // Cargar todos los tags disponibles
                if (allTagsResponse.ok) {
                    const allTagsJson = await allTagsResponse.json();
                    setTagsDisponibles(allTagsJson.data);
                }
                
                // Cargar etiquetas existentes del tour (por ID)
                if (tourTagsResponse.ok) {
                    const tourTagsJson = await tourTagsResponse.json();
                    const tagIds = tourTagsJson.data.map((tag: Tag) => tag.id);
                    setEtiquetasSeleccionadas(tagIds);
                }
                
                // Handle image URL
                let imgUrl = '/tour1.png';
                if (tour.image_url) {
                    if (tour.image_url.startsWith('http')) {
                        imgUrl = tour.image_url;
                    } else if (tour.image_url.startsWith('/')) {
                        imgUrl = `${API_URL}${tour.image_url}`;
                    } else {
                        imgUrl = tour.image_url;
                    }
                }
                setImagenActual(imgUrl);
            } catch (error) {
                console.error('Error:', error);
                setError('Error al cargar los datos del tour');
            } finally {
                setLoadingData(false);
            }
        };
        
        fetchTour();
    }, [tourId]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImagen(e.target.files[0]);
        }
    };

    const handleEtiquetaToggle = (tagId: string) => {
        if (etiquetasSeleccionadas.includes(tagId)) {
            setEtiquetasSeleccionadas(etiquetasSeleccionadas.filter(id => id !== tagId));
        } else {
            setEtiquetasSeleccionadas([...etiquetasSeleccionadas, tagId]);
        }
    };

    const handleEliminar = async () => {
        if (confirm('¿Está seguro de que desea eliminar este tour?')) {
            try {
                const token = localStorage.getItem('access_token');
                const response = await fetch(`${API_URL}/tours/${tourId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (!response.ok) throw new Error('Error al eliminar');
                router.push('/admin/tours');
            } catch (error) {
                console.error('Error:', error);
                setError('Error al eliminar el tour');
            }
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
            let imageUrl = imagenActual;

            // Upload new image if selected
            if (imagen) {
                const formData = new FormData();
                formData.append('image', imagen);

                const imgRes = await fetch(`${API_URL}/images/upload/tours`, {
                    method: 'POST',
                    body: formData,
                });

                const imgJson = await imgRes.json();
                if (imgRes.ok) {
                    imageUrl = `${API_URL}${imgJson.file.path}`;
                }
            }

            // Update tour
            const token = localStorage.getItem('access_token');
            const response = await fetch(`${API_URL}/tours/${tourId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: nombre.trim(),
                    description: descripcion.trim() || null,
                    duration_hours: Number(horas) || 0,
                    duration_days: Number(dias) || 0,
                    max_persons: Number(personas),
                    person_price: Number(precio),
                    image_url: imageUrl,
                }),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el tour');
            }

            // Actualizar etiquetas del tour
            // Primero obtener las etiquetas actuales
            const currentTagsRes = await fetch(`${API_URL}/tours/${tourId}/tags`);
            const currentTagsJson = await currentTagsRes.json();
            const currentTagIds: string[] = currentTagsJson.data?.map((t: Tag) => t.id) || [];
            
            // Eliminar tags que ya no están seleccionados
            for (const tagId of currentTagIds) {
                if (!etiquetasSeleccionadas.includes(tagId)) {
                    await fetch(`${API_URL}/tours/${tourId}/tags/${tagId}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                }
            }
            
            // Agregar nuevos tags
            for (const tagId of etiquetasSeleccionadas) {
                if (!currentTagIds.includes(tagId)) {
                    await fetch(`${API_URL}/tours/${tourId}/tags`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ tag_id: tagId })
                    });
                }
            }

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
                                            <div className="flex gap-3 flex-wrap">
                                                {tagsDisponibles.map((tag) => (
                                                    <button
                                                        key={tag.id}
                                                        type="button"
                                                        onClick={() => handleEtiquetaToggle(tag.id)}
                                                        className={`px-4 py-2 rounded-lg border-2 font-semibold transition-all ${
                                                            etiquetasSeleccionadas.includes(tag.id)
                                                                ? getEtiquetaColor(tag.name)
                                                                : 'bg-white text-gray-400 border-gray-300 hover:border-gray-400'
                                                        }`}
                                                        disabled={isLoading}
                                                    >
                                                        {etiquetasSeleccionadas.includes(tag.id) && (
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
                                                        {tag.name}
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
