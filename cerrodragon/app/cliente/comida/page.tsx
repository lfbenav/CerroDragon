'use client';
import { SideBarClient, TopBar } from "@/app/components";


export default function CheckInPage() {
    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            <SideBarClient />
            <div className="flex-1 flex flex-col">
                <TopBar />
                <main className="flex-1 flex flex-col pt-20 px-8 min-h-0">
                    <div className="max-w-7xl mx-auto w-full flex flex-col">
                        {/* Fixed header section */}
                        <div className="flex-shrink-0">
                            <h1 className="text-3xl font-bold mb-1 text-black mt-4">Registro de preferencias de comida</h1>
                            <p className="mb-8 text-verde3">
                                Introduzca el código proporcionado por el administrador
                            </p>
                        </div>
                        
                        {/* Form */}
                        <div className="flex-1 flex justify-start">
                            <form className="min-w-full space-y-4">
                                <label
                                htmlFor="visitors"
                                className="block mb-2.5 text-md font-medium text-black"
                                >
                                    Coloque el código de formulario proporcionado por el administrador:
                                </label>
                                <input
                                    type="text"
                                    id="visitors"
                                    className="bg-tabla-header border border-borde1 text-heading text-sm 
                                    rounded-xl focus:ring-borde2 focus:border-borde2 block w-full px-3 py-2.5 
                                    shadow-xs placeholder:text-verde2 placeholder:font-medium placeholder:opacity-50"
                                    placeholder="XC-000"
                                />
                                <label
                                    htmlFor="visitors"
                                    className="block mb-2.5 text-md font-medium text-black"
                                >
                                    Código de recervación:
                                </label>
                                <input
                                    type="text"
                                    id="visitors"
                                    className="bg-tabla-header border border-borde1 text-heading text-sm 
                                    rounded-xl focus:ring-borde2 focus:border-borde2 block w-full px-3 py-2.5 
                                    shadow-xs placeholder:text-verde2 placeholder:font-medium placeholder:opacity-50"
                                    placeholder="RV-000"
                                />
                                <label
                                    htmlFor="visitors"
                                    className="block mb-2.5 text-md font-medium text-black"
                                >
                                    Nombre del participante:
                                </label>
                                <input
                                    type="text"
                                    id="visitors"
                                    className="bg-tabla-header border border-borde1 text-heading text-sm 
                                    rounded-xl focus:ring-borde2 focus:border-borde2 block w-full px-3 py-2.5 
                                    shadow-xs placeholder:text-verde2 placeholder:font-medium placeholder:opacity-50"
                                    placeholder="Joe Doe"
                                />
                                <label
                                    htmlFor="countries"
                                    className="block mb-2.5 text-md font-medium text-black"
                                >
                                    Opciones de comida:
                                </label>
                                <select
                                    id="comidas"
                                    className="block w-70 px-3 py-2.5 bg-tabla-header placeholder:opacity-50 border border-verde1 text-verde3 text-sm rounded-base focus:ring-verde1 focus:border-verde1 shadow-xs placeholder:text-verde3"
                                >
                                    <option selected={true}>Seleccione la comida...</option>
                                    <option value="01">Casado Tradicional</option>
                                    <option value="02">Casado Vegano</option>
                                    <option value="03">Arroz con pollo</option>
                                </select>
                                <label
                                    htmlFor="visitors"
                                    className="block mb-2.5 text-md font-medium text-black"
                                >
                                    Especifique alergias o restricciones alimenticias:
                                </label>
                                <input
                                    type="text"
                                    id="visitors"
                                    className="bg-tabla-header border border-borde1 text-heading text-sm 
                                    rounded-xl focus:ring-borde2 focus:border-borde2 block w-full px-3 py-2.5 
                                    shadow-xs placeholder:text-verde2 placeholder:font-medium placeholder:opacity-50"
                                    placeholder="Alergias, restricciones, etc..."
                                />
                                
                                
                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="submit"
                                        className="mt-1 text-white bg-verde3 hover:bg-verde2 font-medium rounded-xl 
                                        text-md px-5 py-2.5 text-center flex items-center justify-center gap-2"
                                    >
                                        <svg
                                            className="w-6 h-6 text-gray-800 dark:text-white"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={24}
                                            height={24}
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M12 3a1 1 0 0 1 .78.375l4 5a1 1 0 1 1-1.56 1.25L13 6.85V14a1 1 0 1 1-2 0V6.85L8.78 9.626a1 1 0 1 1-1.56-1.25l4-5A1 1 0 0 1 12 3ZM9 14v-1H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-4v1a3 3 0 1 1-6 0Zm8 2a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2H17Z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        Enviar
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