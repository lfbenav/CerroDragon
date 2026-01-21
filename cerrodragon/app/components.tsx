import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from "react";
import { ReactNode } from "react";

/* ======================== Interfaces ==========================*/

interface CardTourProps {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    capacidad: number;
    duracion: string;
    etiqueta: string;
    imagen?: string;
}

interface CardPromoProps {
    id: number;
    nombre: string;
    descripcion: string;
    precioAntes: number;
    precioAhora: number;
    capacidad: number;
    descuento: number;
    duracion: string;
    etiqueta: string;
    imagen?: string;
}

interface CardCabanaProps {
    id: number;
    nombre: string;
    descripcion: string;
    capacidad: number;
    etiqueta: string;
    imagen?: string;
}

interface CuadroProps {
    texto: string;
    cantidad: number;
}

interface CardPuntoProps {
    nombre: string;
    ubicacion: string;
    direccion: string;
    imagen?: string;
}

interface SearchBarProps {
    texto: string;
    value?: string;
    onChange?: (value: string) => void;
}

interface CardTestimonioProps {
    nombre: string;
    comentario: string;
    fecha: string;
    likes: number;
}

interface CardPoliticaProps {
    titulo: string;
    descripcion: string;
}

interface CardIncidenciaProps {
    titulo: string;
    descripcion: string;
    fecha: string;
}

interface ReservaProps {
    id: string;
    clienteNombre: string;
    clienteEmail: string;
    tour: string;
    monto: number;
    fecha: string;
    personas: number;
    estado: 'confirmada' | 'pendiente' | 'cancelada' | 'reembolsada';
}

/* ========================= CALENDARIO PROPS ========================= */

interface CalendarDayProps {
    day: number;
    ocupacion: NivelOcupacion;
}

type NivelOcupacion = 'desocupado' | 'no-disponible' | 'poco-ocupado' | 'medio-ocupado' | 'muy-ocupado';

interface CalendarGridProps {
    ocupacionData?: { [key: number]: NivelOcupacion };
    mes?: string;
    año?: number;
    daysInMonth?: number;
    firstDayOfWeek?: number;
}

/* ========================= SIDE BARS ========================= */

export function SideBarClient() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div
      id="sidebar-client"
      className="fixed top-0 left-0 z-40 w-64 h-screen p-4 overflow-y-auto bg-verde1 border-e border-default flex flex-col"
      tabIndex={-1}
      aria-labelledby="drawer-navigation-label"
    >
        <div className="border-b-4 border-verde-apagado pb-4 px-5 flex items-center">

            <Image
                src="/cerro.png"
                className="h-8 w-8"
                alt="Logo"
                width={24}
                height={24}
            />
            <span className="self-center text-xl px-2 font-semibold whitespace-nowrap text-white">
                Cerro Dragón
            </span>
        </div>
        <div className="py-5 overflow-y-auto flex-1">
            <ul className="space-y-1 font-medium">
            <li>
                <a
                href="/cliente/reservas"
                className="flex items-center px-2 py-1.5 text-white rounded-base group"
                >
                <div className="w-5 h-5 mr-3"></div>
                <span>Mis Reservas</span>
                </a>
            </li>
            <li>
                <a
                href="/cliente/tours"
                className="flex items-center px-2 py-1.5 text-white rounded-base group"
                >
                <div className="w-5 h-5 mr-3"></div>
                <span className="flex-1 whitespace-nowrap">Tours</span>
                </a>
            </li>
            <li>
                <a
                href="/cliente/consultas"
                className="flex items-center px-2 py-1.5 text-white rounded-base group"
                >
                <div className="w-5 h-5 mr-3"></div>
                <span className="flex-1 whitespace-nowrap">Consultas</span>
                </a>
            </li>
            <li>
                <a
                href="/cliente/calendario"
                className="flex items-center px-2 py-1.5 text-white rounded-base group"
                >
                <div className="w-5 h-5 mr-3"></div>
                <span className="flex-1 whitespace-nowrap">Calendario</span>
                </a>
            </li>
            <li>
                <a
                href="/cliente/guias"
                className="flex items-center px-2 py-1.5 text-white rounded-base group"
                >
                <div className="w-5 h-5 mr-3"></div>
                <span className="flex-1 whitespace-nowrap">Nuestros Guías</span>
                </a>
            </li>
            <li>
                <a
                href="/cliente/promociones"
                className="flex items-center px-2 py-1.5 text-white rounded-base group"
                >
                <div className="w-5 h-5 mr-3"></div>
                <span className="flex-1 whitespace-nowrap">Promociones</span>
                </a>
            </li>
            <li>
                <a
                href="/cliente/reservas"
                className="flex items-center px-2 py-1.5 text-white rounded-base group"
                >
                <div className="w-5 h-5 mr-3"></div>
                <span className="flex-1 whitespace-nowrap">Reembolsos</span>
                </a>
            </li>
            <li>
                <a
                href="/cliente/puntos"
                className="flex items-center px-2 py-1.5 text-white rounded-base group"
                >
                <div className="w-5 h-5 mr-3"></div>
                <span className="flex-1 whitespace-nowrap">Puntos de encuentro</span>
                </a>
            </li>
            <li>
                <a
                href="/cliente/cabanas"
                className="flex items-center px-2 py-1.5 text-white rounded-base group"
                >
                <div className="w-5 h-5 mr-3"></div>
                <span className="flex-1 whitespace-nowrap">Alojamientos</span>
                </a>
            </li>
            <li>
                <a
                href="/cliente/testimonios"
                className="flex items-center px-2 py-1.5 text-white rounded-base group"
                >
                <div className="w-5 h-5 mr-3"></div>
                <span className="flex-1 whitespace-nowrap">Testimonios</span>
                </a>
            </li>
            <li>
                <a
                href="/cliente/clima"
                className="flex items-center px-2 py-1.5 text-white rounded-base group"
                >
                <div className="w-5 h-5 mr-3"></div>
                <span className="flex-1 whitespace-nowrap">Incidencias/Clima</span>
                </a>
            </li>
            <li>
                <a
                href="/cliente/politicas"
                className="flex items-center px-2 py-1.5 text-white rounded-base group"
                >
                <div className="w-5 h-5 mr-3"></div>
                <span className="flex-1 whitespace-nowrap">Políticas</span>
                </a>
            </li>
            <li>
                <a
                href="/cliente/checkin"
                className="flex items-center px-2 py-1.5 text-white rounded-base group"
                >
                <div className="w-5 h-5 mr-3"></div>
                <span className="flex-1 whitespace-nowrap">Check-In</span>
                </a>
            </li>
            </ul>
        </div>
        <div className="border-t-4 border-verde-apagado pt-4">
            <button
                onClick={handleBack}
                className="flex items-center w-full px-2 py-1.5 text-white rounded-base group"
            >
                <svg
                    className="w-5 h-5 text-white"
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
                        d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2"
                    />
                </svg>
                <span className="px-4 whitespace-nowrap">Volver</span>
            </button>
        </div>
    </div>
  );
}

export function SideBarAdmin() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div
      id="sidebar-admin"
      className="fixed top-0 left-0 z-40 w-64 h-screen p-4 overflow-y-auto bg-verde1 border-e border-default flex flex-col"
      tabIndex={-1}
      aria-labelledby="drawer-navigation-label"
    >
        <div className="border-b-4 border-verde-apagado pb-4 flex items-center">
            <a
            href="https://flowbite.com/"
            className="flex items-center space-x-2 rtl:space-x-reverse"
            >
            <Image
                src="/cerro.png"
                className="h-8 w-8"
                alt="Logo"
                width={24}
                height={24}
            />
            <span className="self-center text-xl font-semibold whitespace-nowrap text-white">
                Cerro Dragón
            </span>
            </a>
        </div>
        <div className="py-5 overflow-y-auto flex-1">
            <ul className="space-y-1 font-medium">
            <li>
                <a
                href="/admin/reservas"
                className="flex items-center px-2 py-1.5 text-white rounded-base hover:bg-red hover:text-fg-red group"
                >
                <div className="w-5 h-5 mr-3"></div>
                <span>Reservas</span>
                </a>
            </li>
            <li>
                <a
                href="/admin/tours"
                className="flex items-center px-2 py-1.5 text-white rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
                >
                <div className="w-5 h-5 mr-3"></div>
                <span className="flex-1 whitespace-nowrap">Tours</span>
                </a>
            </li>
            <li>
                <a
                href="/admin/clientes"
                className="flex items-center px-2 py-1.5 text-white rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
                >
                <div className="w-5 h-5 mr-3"></div>
                <span className="flex-1 whitespace-nowrap">Clientes</span>
                </a>
            </li>
            <li>
                <a
                href="/admin/calendario"
                className="flex items-center px-2 py-1.5 text-white rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
                >
                <div className="w-5 h-5 mr-3"></div>
                <span className="flex-1 whitespace-nowrap">Calendario</span>
                </a>
            </li>
            <li>
                <a
                href="/admin/guias"
                className="flex items-center px-2 py-1.5 text-white rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
                >
                <div className="w-5 h-5 mr-3"></div>
                <span className="flex-1 whitespace-nowrap">Guías</span>
                </a>
            </li>
            <li>
                <a
                href="/admin/checkin"
                className="flex items-center px-2 py-1.5 text-white rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
                >
                <div className="w-5 h-5 mr-3"></div>
                <span className="flex-1 whitespace-nowrap">Check-In</span>
                </a>
            </li>
            <li>
                <a
                href="/admin/consultas"
                className="flex items-center px-2 py-1.5 text-white rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
                >
                <div className="w-5 h-5 mr-3"></div>
                <span className="flex-1 whitespace-nowrap">Consultas</span>
                </a>
            </li>
            <li>
                <a
                href="/admin/promociones"
                className="flex items-center px-2 py-1.5 text-white rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
                >
                <div className="w-5 h-5 mr-3"></div>
                <span className="flex-1 whitespace-nowrap">Promociones</span>
                </a>
            </li>
            <li>
                <a
                href="/admin/cupones"
                className="flex items-center px-2 py-1.5 text-white rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
                >
                <div className="w-5 h-5 mr-3"></div>
                <span className="flex-1 whitespace-nowrap">Cupones</span>
                </a>
            </li>
            <li>
                <a
                href="#"
                className="flex items-center px-2 py-1.5 text-white rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
                >
                <div className="w-5 h-5 mr-3"></div>
                <span className="flex-1 whitespace-nowrap">Políticas</span>
                </a>
            </li>
            <li>
                <a
                href="#"
                className="flex items-center px-2 py-1.5 text-white rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
                >
                <div className="w-5 h-5 mr-3"></div>
                <span className="flex-1 whitespace-nowrap">Reembolsos</span>
                </a>
            </li>
            <li>
                <a
                href="#"
                className="flex items-center px-2 py-1.5 text-white rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
                >
                <div className="w-5 h-5 mr-3"></div>
                <span className="flex-1 whitespace-nowrap">Puntos de encuentro</span>
                </a>
            </li>
            <li>
                <a
                href="#"
                className="flex items-center px-2 py-1.5 text-white rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
                >
                <div className="w-5 h-5 mr-3"></div>
                <span className="flex-1 whitespace-nowrap">Cabañas</span>
                </a>
            </li>
            <li>
                <a
                href="#"
                className="flex items-center px-2 py-1.5 text-white rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
                >
                <div className="w-5 h-5 mr-3"></div>
                <span className="flex-1 whitespace-nowrap">Alojamientos</span>
                </a>
            </li>
            <li>
                <a
                href="#"
                className="flex items-center px-2 py-1.5 text-white rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
                >
                <div className="w-5 h-5 mr-3"></div>
                <span className="flex-1 whitespace-nowrap">Comidas</span>
                </a>
            </li>
            <li>
                <a
                href="#"
                className="flex items-center px-2 py-1.5 text-white rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
                >
                <div className="w-5 h-5 mr-3"></div>
                <span className="flex-1 whitespace-nowrap">Insumos</span>
                </a>
            </li>
            <li>
                <a
                href="#"
                className="flex items-center px-2 py-1.5 text-white rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
                >
                <div className="w-5 h-5 mr-3"></div>
                <span className="flex-1 whitespace-nowrap">Incidencias/Clima</span>
                </a>
            </li>
            <li>
                <a
                href="#"
                className="flex items-center px-2 py-1.5 text-white rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
                >
                <div className="w-5 h-5 mr-3"></div>
                <span className="flex-1 whitespace-nowrap">Testimonios</span>
                </a>
            </li>
            <li>
                <a
                href="#"
                className="flex items-center px-2 py-1.5 text-white rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
                >
                <div className="w-5 h-5 mr-3"></div>
                <span className="flex-1 whitespace-nowrap">Auditoria</span>
                </a>
            </li>
            </ul>
        </div>
        <div className="border-t-4 border-verde-apagado pt-4">
            <button
                onClick={handleBack}
                className="flex items-center w-full px-2 py-1.5 text-white rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
            >
                <svg
                    className="w-5 h-5 text-white"
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
                        d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2"
                    />
                </svg>
                <span className="px-4 whitespace-nowrap">Volver</span>
            </button>
        </div>
    </div>
  );
}

/* ========================= CARDS ========================= */

export function CardTour({id, nombre, descripcion, precio, capacidad, duracion, etiqueta, imagen}: CardTourProps) {
    return (
    <div className="bg-beige1 block w-[350px] h-92 border border-default border-borde1 rounded-xl cardTour relative flex flex-col">
        <a href={"/"+id} className="block overflow-hidden relative">
            <div className="absolute top-4 left-4 bg-amarillo text-black text-sm font-semibold px-3 py-1 rounded-md z-20">
                ${precio}
            </div>
            <div className="h-36 overflow-hidden">
                <Image
                className="rounded-t-xl w-full h-full object-cover"
                src={imagen || "/tour1.png"}
                alt=""
                width={325}
                height={100}
                />
            </div>
        </a>
        <div className="text-left py-2 px-6 flex-1 flex flex-col">
            <h5 className="mt-3 mb-2 text-xl font-light tracking-tight text-heading text-black min-h-[2.5rem]">
                {nombre}
            </h5>
            <p className="mb-2 text-sm text-body text-verde3 flex-1 min-h-[3rem]">
                {descripcion}
            </p>
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                    <svg 
                        className="w-4 h-4 mr-1 text-verde3" 
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
                            d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" 
                        />
                    </svg>
                    <span className="text-verde3 text-sm">{duracion}</span>
                </div>
                <div className="flex items-center">
                    <svg 
                        className="w-4 h-4 mr-1 text-verde3" 
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
                            d="M16 19h4a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-2m-2.236-4a3 3 0 1 0 0-4M3 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" 
                        />
                    </svg>
                    <span className="text-verde3 text-sm">{capacidad} personas </span>
                </div>
            </div>
            <hr className="mt-4 mb-1 border-borde1" />
            <div className="flex justify-between items-center">
                {etiqueta === 'Moderado' ? (
                    <span className="inline-flex items-center px-6 py-0.5 text-amarillo text-sm font-bold rounded bg-amarillotrans">
                        Moderado
                    </span>
                ) : etiqueta === 'Experto' ? (
                    <span className="inline-flex items-center px-6 py-0.5 text-rojovino text-sm font-bold rounded bg-rojotrans">
                        Experto
                    </span>
                ) : etiqueta === 'Fácil' ? (
                    <span className="inline-flex items-center px-6 py-0.5 text-verde3 text-sm font-bold rounded bg-verdetrans">
                        Fácil
                    </span>
                ) : (
                    <span className="inline-flex items-center px-6 py-0.5 text-azul1 text-sm font-bold rounded bg-azultrans">
                        Todos
                    </span>
                )}
                <a
                href="#"
                className="inline-flex items-end text-verde3 bg-brand font-medium text-sm py-2.5"
                >
                    Ver más
                <svg
                    className="w-4 h-4 ms-1.5 rtl:rotate-180 -me-0.5"
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
                    d="M19 12H5m14 0-4 4m4-4-4-4"
                    />
                </svg>
                </a>
            </div>
        </div>
    </div>
    );
}

export function CardGuide({nombre, activo, imagen}: {nombre: string, activo: string, imagen?: string}) {
    return (
        <div className="bg-beige1 block w-60 h-80 border border-default border-borde1 rounded-xl relative flex flex-col">
            <div className="h-48 overflow-hidden m-4 rounded-lg">
                <Image
                    className="rounded-lg w-full h-full object-cover"
                    src={imagen || "/guia1.png"}
                    alt="Guía turístico"
                    width={208}
                    height={160}
                />
            </div>
            <div className="flex-1 px-4 pb-4 flex flex-col justify-between items-center text-center">
                <h3 className="text-lg font-medium text-black">{nombre}</h3>
                {activo === 'Activo' ? (
                    <span className="inline-flex items-center px-4 py-1 text-verde3 text-sm font-bold rounded bg-verdetrans w-fit">
                        Activo
                    </span>                
                ) : (
                    <span className="inline-flex items-center px-4 py-1 text-rojovino text-sm font-bold rounded bg-rojotrans w-fit">
                        Inactivo
                    </span>
                )}
            </div>
        </div>
    );

}

export function CardCabana({id, nombre, descripcion, capacidad, etiqueta, imagen}: CardCabanaProps) {
    return (
        <div className="bg-beige1 block w-[350px] h-80 border border-default border-borde1 rounded-xl cardTour relative flex flex-col">
        <a href={"/"+id} className="block overflow-hidden relative">
            <div className="h-48 overflow-hidden">
                <Image
                className="rounded-t-xl w-full h-full object-cover"
                src={imagen || "/tour1.png"}
                alt=""
                width={350}
                height={192}
                />
            </div>
        </a>
        <div className="text-left py-3 px-6 flex-1 flex flex-col">
            <h5 className="mb-2 text-lg font-light tracking-tight text-heading text-black">
                {nombre}
            </h5>
            <p className="mb-3 text-sm text-body text-verde3 flex-1">
                {descripcion}
            </p>
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                    <svg 
                        className="w-4 h-4 mr-1 text-verde3" 
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
                            d="M16 19h4a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-2m-2.236-4a3 3 0 1 0 0-4M3 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" 
                        />
                    </svg>
                    <span className="text-verde3 text-sm">{capacidad} personas </span>
                </div>
            </div>
            <hr className="mb-2 border-borde1" />
            <div className="flex justify-between items-center">
                {etiqueta === 'Disponible' ? (
                    <span className="inline-flex items-center px-4 py-0.5 text-verde3 text-sm font-bold rounded bg-verdetrans">
                        Disponible
                    </span>
                ) : etiqueta === 'Ocupado' ? (
                    <span className="inline-flex items-center px-4 py-0.5 text-rojovino text-sm font-bold rounded bg-rojotrans">
                        Ocupado
                    </span>
                ) : (
                    <span className="inline-flex items-center px-4 py-0.5 text-azul1 text-sm font-bold rounded bg-azultrans">
                        Desactivada
                    </span>
                )}
                <a
                href="#"
                className="inline-flex items-end text-verde3 bg-brand font-medium text-sm py-2"
                >
                    Ver más
                <svg
                    className="w-4 h-4 ms-1.5 rtl:rotate-180 -me-0.5"
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
                    d="M19 12H5m14 0-4 4m4-4-4-4"
                    />
                </svg>
                </a>
            </div>
        </div>
    </div>
    );
}

export function CardPromocion({id, nombre, descripcion, precioAhora, precioAntes, descuento, capacidad, duracion, etiqueta, imagen}: CardPromoProps) {
    return (
    <div className="bg-beige1 block w-[350px] h-92 border border-default border-borde1 rounded-xl cardTour relative flex flex-col">
        <a href={"/"+id} className="block overflow-hidden relative">
            <div className="absolute top-6 left-4 bg-rojo2 text-black text-sm font-bold px-2 py-1 rounded-md z-20 transform -rotate-12">
                PROMOCIÓN -{descuento}%
            </div>
            <div className="absolute top-4 right-4 bg-amarillo text-black text-sm font-semibold px-3 py-1 rounded-md z-20">
                Ahora ${precioAhora} 
                <span className='text-xs font-normal'> <br />Antes: <span className="line-through">${precioAntes}</span> </span>
            </div>
            <div className="h-48 overflow-hidden">
                <Image
                className="rounded-t-xl w-full h-full object-cover"
                src={imagen || "/tour1.png"}
                alt=""
                width={325}
                height={192}
                />
            </div>
        </a>
        <div className="text-left py-2 px-6 flex-1 flex flex-col">
            <h5 className="mt-3 text-xl font-light tracking-tight text-heading text-black min-h-[2.5rem]">
                {nombre}
            </h5>
            <p className="mb-2 text-sm text-body text-verde3 flex-1">
                {descripcion}
            </p>
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                    <svg 
                        className="w-4 h-4 mr-1 text-verde3" 
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
                            d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" 
                        />
                    </svg>
                    <span className="text-verde3 text-sm">{duracion}</span>
                </div>
                <div className="flex items-center">
                    <svg 
                        className="w-4 h-4 mr-1 text-verde3" 
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
                            d="M16 19h4a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-2m-2.236-4a3 3 0 1 0 0-4M3 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" 
                        />
                    </svg>
                    <span className="text-verde3 text-sm">{capacidad} personas </span>
                </div>
            </div>
            <hr className="mt-4 mb-1 border-borde1" />
            <div className="flex justify-between items-center">
                {etiqueta === 'Moderado' ? (
                    <span className="inline-flex items-center px-6 py-0.5 text-amarillo text-sm font-bold rounded bg-amarillotrans">
                        Moderado
                    </span>
                ) : etiqueta === 'Experto' ? (
                    <span className="inline-flex items-center px-6 py-0.5 text-rojovino text-sm font-bold rounded bg-rojotrans">
                        Experto
                    </span>
                ) : etiqueta === 'Fácil' ? (
                    <span className="inline-flex items-center px-6 py-0.5 text-verde3 text-sm font-bold rounded bg-verdetrans">
                        Fácil
                    </span>
                ) : (
                    <span className="inline-flex items-center px-6 py-0.5 text-azul1 text-sm font-bold rounded bg-azultrans">
                        Todos
                    </span>
                )}
                <a
                href="#"
                className="inline-flex items-end text-verde3 bg-brand font-medium text-sm py-2.5"
                >
                    Ver más
                <svg
                    className="w-4 h-4 ms-1.5 rtl:rotate-180 -me-0.5"
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
                    d="M19 12H5m14 0-4 4m4-4-4-4"
                    />
                </svg>
                </a>
            </div>
        </div>
    </div>
    );
}

export function CardPunto({nombre, ubicacion, direccion, imagen}: CardPuntoProps) {
    return (
        <div className="bg-beige1 w-60 block border border-default border-borde1 rounded-xl relative flex flex-col">
            <div className="flex justify-center items-center m-4 h-32">
                <Image
                    className="rounded-lg w-32 h-32 object-cover"
                    src={imagen || "/punto1.png"}
                    alt="Punto de encuentro"
                    width={80}
                    height={64}
                />
            </div>
            <div className="flex-1 px-4 pb-4 flex flex-col justify-between items-center text-center">
                <h3 className="text-lg font-medium text-black">{nombre}</h3>
                <div className="mb-2 w-full">
                    <a href={`https://maps.google.com/?q=${encodeURIComponent(ubicacion)}`} target="_blank" rel="noopener noreferrer" className="text-sm text-verde3 hover:text-verde2 underline break-words">
                        {ubicacion}
                    </a>
                </div>
                <p className="text-sm text-verde3">{direccion}</p>
            </div>
        </div>
    );
}

export function CardTestimonio({nombre, comentario, fecha, likes}: CardTestimonioProps) {
    return (
        <div className="bg-beige1 w-full h-auto border border-borde1 rounded-xl p-4 flex flex-col shadow-sm inline-block mb-6" style={{breakInside: 'avoid', pageBreakInside: 'avoid'}}>
            <div className="flex flex-col items-start text-left mb-4">
                <h3 className="text-lg font-semibold text-black mb-2">{nombre}</h3>
                <p className="text-sm text-verde3 leading-relaxed italic">
                    &quot;{comentario}&quot;
                </p>
            </div>
            
            <hr className="border-borde1 mb-3" />
            
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <svg 
                        className="w-4 h-4 mr-2 text-verde3" 
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
                            d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" 
                        />
                    </svg>
                    <span className="text-sm text-verde3">{fecha}</span>
                </div>
                
                <div className="flex items-center">
                    <svg
                        className="w-5 h-5 text-verde3 mr-1"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            fillRule="evenodd"
                            d="M15.03 9.684h3.965c.322 0 .64.08.925.232.286.153.532.374.717.645a2.109 2.109 0 0 1 .242 1.883l-2.36 7.201c-.288.814-.48 1.355-1.884 1.355-2.072 0-4.276-.677-6.157-1.256-.472-.145-.924-.284-1.348-.404h-.115V9.478a25.485 25.485 0 0 0 4.238-5.514 1.8 1.8 0 0 1 .901-.83 1.74 1.74 0 0 1 1.21-.048c.396.13.736.397.96.757.225.36.32.788.269 1.211l-1.562 4.63ZM4.177 10H7v8a2 2 0 1 1-4 0v-6.823C3 10.527 3.527 10 4.176 10Z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span className="text-sm text-verde3 font-medium">{likes}</span>
                </div>
            </div>
        </div>
    );
}

export function CardIncidencia({titulo, descripcion, fecha, tipo}: CardIncidenciaProps & {tipo: 'leve' | 'moderado' | 'grave' | 'critico'}) {
    const getAlertStyles = () => {
        switch (tipo) {
            case 'leve':
                return 'border-verde3 bg-verdetrans';
            case 'moderado':
                return 'border-amarillo bg-amarillotrans';
            case 'grave':
                return 'border-rojosuave bg-red-100';
            case 'critico':
                return 'border-rojovino bg-rojotrans';
            default:
                return 'border-borde1 bg-beige1';
        }
    };

    const getAlertIcon = () => {
        switch (tipo) {
            case 'leve':
                return (
                    <svg className="w-5 h-5 text-verde3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                );
            case 'moderado':
                return (
                    <svg className="w-5 h-5 text-amarillo" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                );
            case 'grave':
                return (
                    <svg className="w-5 h-5 text-rojoalerta" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                );
            case 'critico':
                return (
                    <svg className="w-5 h-5 text-rojovino" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                );
        }
    };

    const getAlertText = () => {
        switch (tipo) {
            case 'leve':
                return 'Información';
            case 'moderado':
                return 'Precaución';
            case 'grave':
                return 'Alerta';
            case 'critico':
                return 'Crítico';
        }
    };

    return (
        <div className={`w-full h-auto border-2 rounded-xl p-4 flex flex-col shadow-sm inline-block mb-6 ${getAlertStyles()}`}>
            <div className="flex items-center mb-2 mx-4">
                {getAlertIcon()}
                <span className="ml-2 text-sm font-bold text-black">{getAlertText()}</span>
            </div>
            <h3 className="text-lg font-semibold text-black mb-2 mx-4">{titulo}</h3>
            <hr className="border-black mb-2 mx-4 border-1" />
            <p className="text-sm text-verde3 leading-relaxed mx-4 mb-2">
                {descripcion}
            </p>
            <div className="flex justify-end">
                <span className="text-sm text-verde3 italic mr-4">{fecha}</span>
            </div>
        </div>
    );
}

export function CardPolitica({titulo, descripcion}: CardPoliticaProps) {
    return (
        <div className="bg-beige1 w-full h-auto border border-borde1 rounded-xl p-4 flex flex-col shadow-sm inline-block mb-6">
            <h3 className="text-lg font-semibold text-black mb-2 mx-4">{titulo}</h3>
            <hr className="border-borde1 mb-2 mx-4 border-1" />
            <p className="text-sm text-verde3 leading-relaxed mx-4 mb-2">
                {descripcion}
            </p>
        </div>
    );

}

export function CardFAQ({
  pregunta,
  respuesta,
}: {
  pregunta: string;
  respuesta: string;
}) {
  return (
    <div className="bg-beige1 w-full border border-default border-borde1 rounded-xl p-4">
      <h3 className="text-md font-semibold text-black mb-2">{pregunta}</h3>

      <div className="border-b border-borde1 mb-3" />

      <p className="text-sm text-verde3 leading-relaxed">{respuesta}</p>
    </div>
  );
}

export function CardFAQAdmin({
  id,
  pregunta,
  respuesta,
  isEditing,
  onStartEdit,
  onCancelEdit,
  onSave,
  onDelete,
}: {
  id: string;
  pregunta: string;
  respuesta: string;
  isEditing: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSave: (next: { pregunta: string; respuesta: string }) => void;
  onDelete: () => void;
}) {
  const [q, setQ] = useState(pregunta);
  const [a, setA] = useState(respuesta);

  // Keep local state synced when not editing
  useEffect(() => {
    if (!isEditing) {
      setQ(pregunta);
      setA(respuesta);
    }
  }, [pregunta, respuesta, isEditing]);

  const isNew = useMemo(() => id.startsWith("new-"), [id]);

  const handleToggleEditOrSave = () => {
    if (!isEditing) {
      onStartEdit();
      return;
    }
    onSave({ pregunta: q.trim(), respuesta: a.trim() });
  };

  const handleCancel = () => {
    setQ(pregunta);
    setA(respuesta);
    onCancelEdit();
  };

  return (
    <div
      className={[
        "bg-beige1 w-full border border-default border-borde1 rounded-xl p-4 shadow-sm",
        isEditing ? "ring-2 ring-blue-500" : "",
      ].join(" ")}
    >
      {/* Pregunta */}
      <div className="mb-2">
        {isEditing ? (
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full bg-transparent text-black font-medium text-sm outline-none border-b border-borde1 pb-1"
            placeholder="Ingrese la nueva pregunta"
          />
        ) : (
          <h3 className="text-md font-semibold text-black">{pregunta}</h3>
        )}
      </div>

      <div className="border-b border-borde1 mb-3" />

      {/* Respuesta */}
<div className="min-h-[44px]">
  {isEditing ? (
    <>
      <textarea
        value={a}
        onChange={(e) => setA(e.target.value)}
        rows={2}
        maxLength={150}
        className="w-full bg-transparent text-verde3 text-sm outline-none resize-none"
        placeholder="Ingrese la respuesta a la pregunta"
      />
      <div className="mt-1 text-xs text-verde3 text-right">
        {a.length}/150
      </div>
    </>
  ) : (
    <p className="text-sm text-verde3 leading-relaxed">{respuesta}</p>
  )}
</div>


      {/* Actions */}
      <div className="mt-3 flex justify-end items-center gap-2">
        {/* Edit / Save */}
        <button
          type="button"
          onClick={handleToggleEditOrSave}
          className="w-8 h-8 inline-flex items-center justify-center rounded-full hover:bg-black/5 text-black"
        >
          {isEditing ? <CheckIcon /> : <PencilIcon />}
        </button>

        {/* Cancel only while editing */}
        {isEditing && (
          <button
            type="button"
            onClick={handleCancel}
            className="w-8 h-8 inline-flex items-center justify-center rounded-full hover:bg-black/5 text-black"            title="Cancelar"
          >
            <XIcon />
          </button>
        )}

        {/* Delete */}
        {!isEditing && (
          <button
            type="button"
            onClick={onDelete}
            className="w-8 h-8 inline-flex items-center justify-center rounded-full hover:bg-black/5 text-black"          >
            <CircleXIcon />
          </button>
        )}

        {/* If it's new, allow delete even while editing */}
        {isEditing && isNew && (
          <button
            type="button"
            onClick={onDelete}
            className="w-8 h-8 inline-flex items-center justify-center rounded-full hover:bg-black/5 text-black"            title="Eliminar"
          >
            <CircleXIcon />
          </button>
        )}
      </div>
    </div>
  );
}

function PencilIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 20h9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
      <path
        d="M20 6 9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
      <path
        d="M18 6 6 18M6 6l12 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CircleXIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M15 9 9 15M9 9l6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ========================= ADMIN - INCIDENCIAS/CLIMA ========================= */

type IncTipo = "leve" | "moderado" | "grave" | "critico";

export function CardIncidenciaAdmin({
  id,
  titulo,
  descripcion,
  fecha,
  tipo,
  isEditing,
  onStartEdit,
  onCancelEdit,
  onSave,
  onDelete,
}: {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  tipo: IncTipo;
  isEditing: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSave: (next: { titulo: string; descripcion: string; fecha: string; tipo: IncTipo }) => void;
  onDelete: () => void;
}) {
  const [t, setT] = useState(titulo);
  const [d, setD] = useState(descripcion);
  const [f, setF] = useState(fecha);
  const [tp, setTp] = useState<IncTipo>(tipo);

  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      setT(titulo);
      setD(descripcion);
      setF(fecha);
      setTp(tipo);
    }
  }, [titulo, descripcion, fecha, tipo, isEditing]);

  const getAlertStyles = () => {
    switch (tp) {
      case "leve":
        return "border-verde3 bg-verdetrans";
      case "moderado":
        return "border-amarillo bg-amarillotrans";
      case "grave":
        return "border-rojosuave bg-red-100";
      case "critico":
        return "border-rojovino bg-rojotrans";
      default:
        return "border-borde1 bg-beige1";
    }
  };

  const getAlertIcon = () => {
    switch (tp) {
      case "leve":
        return (
          <svg className="w-5 h-5 text-verde3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "moderado":
        return (
          <svg className="w-5 h-5 text-amarillo" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "grave":
        return (
          <svg className="w-5 h-5 text-rojoalerta" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "critico":
        return (
          <svg className="w-5 h-5 text-rojovino" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  const getAlertText = () => {
    switch (tp) {
      case "leve":
        return "Información";
      case "moderado":
        return "Precaución";
      case "grave":
        return "Alerta";
      case "critico":
        return "Crítico";
    }
  };

  const handleEditOrSave = () => {
    if (!isEditing) return onStartEdit();
    onSave({ titulo: t.trim(), descripcion: d.trim(), fecha: f.trim(), tipo: tp });
  };

  const handleCancel = () => {
    setT(titulo);
    setD(descripcion);
    setF(fecha);
    setTp(tipo);
    onCancelEdit();
  };

  const requestDelete = () => setConfirmOpen(true);
  const cancelDelete = () => setConfirmOpen(false);
  const confirmDelete = () => {
    setConfirmOpen(false);
    onDelete();
  };

  return (
    <div className={`w-full h-auto border-2 rounded-xl p-4 flex flex-col shadow-sm ${getAlertStyles()}`}>
      {/* Badge row + actions */}
      <div className="flex items-center mb-2 mx-4">
        {getAlertIcon()}
        <span className="ml-2 text-sm font-bold text-black">{getAlertText()}</span>

        {/* acciones admin (derecha) */}
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={handleEditOrSave}
            className="w-8 h-8 inline-flex items-center justify-center rounded-full hover:bg-black/5 text-black"
            aria-label={isEditing ? "Guardar" : "Editar"}
            title={isEditing ? "Guardar" : "Editar"}
          >
            {isEditing ? <CheckIcon /> : <PencilIcon />}
          </button>

          {isEditing ? (
            <button
              type="button"
              onClick={handleCancel}
              className="w-8 h-8 inline-flex items-center justify-center rounded-full hover:bg-black/5 text-black"
              aria-label="Cancelar"
              title="Cancelar"
            >
              <XIcon />
            </button>
          ) : (
            <button
              type="button"
              onClick={requestDelete}
              className="w-8 h-8 inline-flex items-center justify-center rounded-full hover:bg-black/5 text-black"
              aria-label="Eliminar"
              title="Eliminar"
            >
              <CircleXIcon />
            </button>
          )}
        </div>
      </div>

      {/* Tipo selector solo cuando edita */}
      {isEditing && (
        <div className="mx-4 mb-2">
          <label className="text-xs font-medium text-black">Tipo</label>
            <select
            value={tp}
            onChange={(e) => setTp(e.target.value as IncTipo)}
            className="ml-3 text-sm bg-beige2 text-black border border-borde2 rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-verde2"
            style={{ color: "black" }}
            >
            <option value="leve">Información</option>
            <option value="moderado">Precaución</option>
            <option value="grave">Alerta</option>
            <option value="critico">Crítico</option>
          </select>
        </div>
      )}

        {/* Title */}
        {isEditing ? (
        <>
            <input
            value={t}
            onChange={(e) => setT(e.target.value)}
            className="text-lg font-semibold text-black mb-1 mx-4 bg-transparent outline-none border-b border-black/30 pb-1"
            placeholder="Título"
            maxLength={60}
            />
            <div className="mx-4 mb-2 text-right text-xs text-verde3">
            {t.length}/60
            </div>
        </>
        ) : (
        <h3 className="text-lg font-semibold text-black mb-2 mx-4">{titulo}</h3>
        )}
        <hr className="border-black mb-2 mx-4 border-1" />

        {/* Description */}
        {isEditing ? (
        <>
            <textarea
            value={d}
            onChange={(e) => setD(e.target.value)}
            rows={3}
            className="text-sm text-verde3 leading-relaxed mx-4 mb-1 bg-transparent outline-none resize-none"
            placeholder="Descripción"
            maxLength={250}
            />
            <div className="mx-4 mb-2 text-right text-xs text-verde3">
            {d.length}/250
            </div>
        </>
        ) : (
        <p className="text-sm text-verde3 leading-relaxed mx-4 mb-2">
            {descripcion}
        </p>
        )}

        {/* Fecha */}
        <div className="flex justify-end items-center gap-2">
        {isEditing ? (
            <>
            <input
                value={f}
                onChange={(e) => setF(e.target.value)}
                className="text-sm text-verde3 italic bg-transparent outline-none border-b border-black/20 pb-1"
                placeholder="Fecha (ej: 25 de noviembre de 2025)"
                maxLength={30}
            />
            <span className="text-xs text-verde3 italic mr-4">
                {f.length}/30
            </span>
            </>
        ) : (
            <span className="text-sm text-verde3 italic mr-4">{fecha}</span>
        )}
        </div>

      {/* Confirm delete */}
      <ConfirmModal
        open={confirmOpen}
        title="Eliminar alerta"
        message={`¿Está seguro de que desea eliminar la alerta "${titulo}"?\n\nEsta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        confirmVariant="danger"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}


/* ========================= CALENDARIO ========================= */

function CalendarDay({ day, ocupacion }: CalendarDayProps) {
  const getColorClasses = () => {
    switch (ocupacion) {
      case 'no-disponible':
        return 'bg-celeste text-black';
      case 'poco-ocupado':
        return 'bg-verde4 text-black';
      case 'medio-ocupado':
        return 'bg-amarillo text-black';
      case 'muy-ocupado':
        return 'bg-rojosuave text-black';
      default:
        return 'bg-transparent text-black';
    }
  };

  return (
    <div className="flex justify-center items-center h-16">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-medium ${getColorClasses()}`}>
        {day}
      </div>
    </div>
  );
}

export function CalendarGrid({ ocupacionData = {}, mes = "ENERO", año = 2025, daysInMonth = 31, firstDayOfWeek = 3}: CalendarGridProps) {
  const weekDays = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
  
  // Crear array con días vacíos al inicio + días del mes
  const calendarDays = [];
  
  // Días vacíos al inicio
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Días del mes
  for (let day = 1; day <= daysInMonth; day++) {
    const ocupacion = (ocupacionData[day] as NivelOcupacion) || 'desocupado';
    calendarDays.push({ day, ocupacion });
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-borde1 p-6 max-w-4xl mx-auto">
      {/* Título del mes */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-black mb-2">{mes}</h2>
        <p className="text-verde3">{año}</p>
      </div>

      {/* Encabezados de días de la semana */}
      <div className="grid grid-cols-7 gap-4 mb-4">
        {weekDays.map((day, index) => (
          <div key={index} className="text-center font-bold text-xl text-black">
            {index === 0 ? <span className="text-rojosuave">{day}</span> : day}
          </div>
        ))}
      </div>

      {/* Calendario */}
      <div className="grid grid-cols-7 gap-4">
        {calendarDays.map((dayData, index) => (
          <div key={index} className="text-center">
            {dayData ? (
              <CalendarDay day={dayData.day} ocupacion={dayData.ocupacion} />
            ) : (
              <div className="h-16"></div>
            )}
          </div>
        ))}
      </div>

      {/* Clave de colores */}
      <div className="mt-8 pt-6 border-t border-borde1">
        <h3 className="text-lg font-semibold text-black mb-4 text-center">Disponibilidad</h3>
        <div className="flex flex-wrap justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full border-2 border-gray-300 bg-transparent"></div>
            <span className="text-sm text-verde3">Desocupado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-celeste"></div>
            <span className="text-sm text-verde3">No disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-verde4"></div>
            <span className="text-sm text-verde3">Poco ocupado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-amarillo"></div>
            <span className="text-sm text-verde3">Medio ocupado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-rojosuave"></div>
            <span className="text-sm text-verde3">Muy ocupado</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========================= TOP BAR ========================= */

export function TopBar() {
  return (
    <nav className="bg-beige1 fixed top-0 left-64 right-0 z-20 border-b border-gray-200">
        <div className="flex items-center justify-end px-4 py-4">
            <button
                type="button"
                className="flex text-sm rounded-full focus:ring-4 focus:ring-gray-300 pr-25"
                id="user-menu-button"
                aria-expanded="false"
            >
                <span className="sr-only">User</span>
                <Image
                className="w-8 h-8 rounded-full"
                src="/cerro.png"
                alt="user photo"
                width={32}
                height={32}
                />
            </button>
        </div>
    </nav>
  );
}

export function HomeBar() {
   return (
    <nav className="bg-menta fg-menta fixed w-full z-20 top-0 start-0 border-b border-default">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 bg-menta">
            <a
            href="https://flowbite.com/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
            >
            <Image
                src="/cerro2.png"
                className="h-6"
                alt="Flowbite Logo"
                width={28}
                height={28}
            />
            <span className="self-center text-verde2 text-xl text-heading font-semibold whitespace-nowrap">
                Cerro Dragón
            </span>
            </a>
            <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <button
                type="button"
                className="text-white bg-verde2 rounded-xl x-12 box-border border border-transparent shadow-xs font-medium leading-5 rounded-base text-sm px-3 py-2 flex items-center gap-2"
            >
                <svg
                    className="w-4 h-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2"
                    />
                </svg>
                Login
            </button>
            </div>
            <div
            className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-sticky"
            >
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-default rounded-base bg-neutral-secondary-soft md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-neutral-primary">
                <li>
                <Link
                    href="/"
                    className="block py-2 px-3 text-verde2 bg-brand rounded-sm text-bold md:p-0"
                    aria-current="page"
                >
                    Inicio
                </Link>
                </li>
                <li>
                <Link
                    href="#"
                    className="block py-2 px-3 text-heading text-verde2 rounded md:border-0 md:p-0 "
                >
                    Tours
                </Link>
                </li>
                <li>
                <a
                    href="#"
                    className="block py-2 px-3 text-heading text-verde2 rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent"
                >
                    Hospedaje
                </a>
                </li>
                <li>
                <a
                    href="#"
                    className="block py-2 px-3 text-heading text-verde2 rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent"
                >
                    Políticas
                </a>
                </li>
                <li>
                <a
                    href="#"
                    className="block py-2 px-3 text-heading text-verde2 rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent"
                >
                    Guías
                </a>
                </li>
                <li>
                <a
                    href="#"
                    className="block py-2 px-3 text-heading text-verde2 rounded hover:bg-neutral-tertiary md:hover:bg-transparent md:border-0 md:hover:text-fg-brand md:p-0 md:dark:hover:bg-transparent"
                >
                    Contacto
                </a>
                </li>
            </ul>
            </div>
        </div>
    </nav>
   );
}

/* ========================= SEARCH ========================== */

export function SearchBar({ texto, value, onChange }: SearchBarProps) {
  return (
    <div className="bg-beige1 p-4 rounded-lg shadow-sm border border-borde1 mb-6 w-full">
      <form className="w-full" onSubmit={(e) => e.preventDefault()}>
        <label
          htmlFor="search"
          className="block mb-2.5 text-sm font-medium sr-only text-verde3"
        >
          Buscar
        </label>

        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-verde3"
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
                strokeWidth={2}
                d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>

          <input
            type="search"
            id="search"
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className="block w-full py-2 px-3 ps-9 bg-beige2 border border-borde2 text-verde3 placeholder-verde3 text-sm rounded-md focus:ring-verde2 focus:border-verde2"
            placeholder={texto}
          />
        </div>
      </form>
    </div>
  );
}


/* ========================= BASE PAGINA ADMIN Y SUS COMPONENTES ========================= */

export function AdminPageShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <SideBarAdmin />
      <div className="flex-1 flex flex-col">
        <TopBar />

        <main className="flex-1 flex flex-col pt-20 px-8 min-h-0">
          <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
            <div className="flex-shrink-0">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <h1 className="text-3xl font-bold mb-1 text-black mt-4">
                    {title}
                  </h1>
                  {subtitle ? <p className="text-verde3 mb-4">{subtitle}</p> : null}
                </div>
                {actions ? <div className="mt-6">{actions}</div> : null}
              </div>

              <div className="border-b border-black/20" />
            </div>

            <div className="flex-1 min-h-0">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}

export function ToggleSwitch({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={[
        "relative inline-flex h-5 w-10 items-center rounded-full transition-colors",
        checked ? "bg-verde2" : "bg-gray-300",
        disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
      ].join(" ")}
      aria-pressed={checked}
      aria-label="toggle"
    >
      <span
        className={[
          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
          checked ? "translate-x-5" : "translate-x-1",
        ].join(" ")}
      />
    </button>
  );
}

export type PermKey =
  | "crear_tours"
  | "editar_tours"
  | "gestionar_administradores"
  | "gestionar_testimonios"
  | "gestionar_guias"
  | "gestionar_insumos"
  | "gestionar_reembolsos"
  | "bitacora_auditoria";

export const PERMISSIONS: { key: PermKey; label: string }[] = [
  { key: "crear_tours", label: "Crear Tours" },
  { key: "editar_tours", label: "Editar Tours" },
  { key: "gestionar_administradores", label: "Gestionar Administradores" },
  { key: "gestionar_testimonios", label: "Gestionar Testimonios" },
  { key: "gestionar_guias", label: "Gestionar Guías" },
  { key: "gestionar_insumos", label: "Gestionar Insumos" },
  { key: "gestionar_reembolsos", label: "Gestionar Reembolsos" },
  { key: "bitacora_auditoria", label: "Insertar en la Bitácora de Auditoría" },
];

export function PermissionsTable({
  value,
  onChange,
  disabled,
}: {
  value: Record<PermKey, boolean>;
  onChange: (next: Record<PermKey, boolean>) => void;
  disabled?: boolean;
}) {
  const PAGE_SIZE = 6; // change to 4/5/6 as you prefer
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(PERMISSIONS.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const start = (safePage - 1) * PAGE_SIZE;
  const pageItems = PERMISSIONS.slice(start, start + PAGE_SIZE);

  return (
    <div className="bg-beige1 border border-default border-borde1 rounded-xl overflow-hidden w-full">
      <div className="grid grid-cols-2 px-4 py-2 bg-black/5 text-xs font-semibold text-black">
        <div>Permiso</div>
        <div className="text-right">Estado</div>
      </div>

      <div className="divide-y divide-black/10">
        {pageItems.map((p) => (
          <div key={p.key} className="grid grid-cols-2 px-4 py-2 items-center">
            <div className="text-sm text-black">{p.label}</div>
            <div className="flex justify-end">
              <ToggleSwitch
                checked={!!value[p.key]}
                disabled={disabled}
                onChange={(nextVal) => onChange({ ...value, [p.key]: nextVal })}
              />
            </div>
          </div>
        ))}
      </div>

      <PaginationControls
        page={safePage}
        totalPages={totalPages}
        onPageChange={setPage}
        showCounter={false}
      />
    </div>
  );
}


/* ========================= PAGINACIÓN ========================= */

export function PaginationControls({
  page,
  totalPages,
  onPageChange,
  showCounter = true,
}: {
  page: number;
  totalPages: number;
  onPageChange: (nextPage: number) => void;
  showCounter?: boolean;
}) {
  const safeTotal = Math.max(1, totalPages);
  const safePage = Math.min(Math.max(1, page), safeTotal);

  const canPrev = safePage > 1;
  const canNext = safePage < safeTotal;

  return (
    <div className="flex items-center justify-center gap-4 py-2 text-black/60">
      <button
        type="button"
        onClick={() => canPrev && onPageChange(safePage - 1)}
        disabled={!canPrev}
        className={`px-2 py-1 rounded ${
          canPrev ? "hover:bg-black/5" : "opacity-40 cursor-not-allowed"
        }`}
        aria-label="Anterior"
      >
        ◀
      </button>

      {showCounter && (
        <span className="text-xs">
          {safePage} / {safeTotal}
        </span>
      )}

      <button
        type="button"
        onClick={() => canNext && onPageChange(safePage + 1)}
        disabled={!canNext}
        className={`px-2 py-1 rounded ${
          canNext ? "hover:bg-black/5" : "opacity-40 cursor-not-allowed"
        }`}
        aria-label="Siguiente"
      >
        ▶
      </button>
    </div>
  );
}

/* ========================= VARIOS ========================= */

export function Cuadro({texto, cantidad}: CuadroProps) {
    return (
        <div className='bg-beige1 w-[400px] border-borde1 border rounded-xl p-4 flex flex-col 1justify-start shadow-sm'>
            <h3 className="mb-2 text-sm font-medium text-verde3">{texto}</h3>
            <p className="text-2xl font-semibold text-black pl-4">{cantidad}</p>
        </div>
    );
}

export function ConfirmModal({
  open,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  confirmVariant = "danger",
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "danger" | "primary";
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  const confirmClasses =
    confirmVariant === "danger"
      ? "bg-red-500 text-white hover:opacity-95"
      : "bg-verde2 text-white hover:opacity-95";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* modal */}
      <div className="relative w-full max-w-md rounded-xl bg-beige1 border border-borde1 shadow-lg p-5">
        <h3 className="text-lg font-semibold text-black">{title}</h3>
        <p className="mt-2 text-sm text-verde3 whitespace-pre-line">{message}</p>

        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-md bg-black/10 text-black text-sm font-medium hover:bg-black/15"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 rounded-md text-sm font-medium ${confirmClasses}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}


export function WhatsAppButton() {
    return (
        <Link href="http://wa.me/50684603211" target="_blank" rel="noopener noreferrer">
            <div className='bg-beige1 w-[280px] border-borde1 border rounded-xl p-4 flex flex-row 1justify-start shadow-sm'>
                <Image
                    className="w-15 h-15 mb-2"
                    src="/whatsapp.png"
                    alt="WhatsApp Logo"
                    width={60}
                    height={60}
                />
                <div className='flex flex-col ms-4 items-center justify-start'>
                    <h3 className="mb-2 text-1xl font-semibold text-verde3">Cerro Dragón Tours</h3>
                    <p className="text-1xl font-semibold text-black">+506 8460-3211</p>
                </div>
            </div>
        </Link>
    );
}

/* ========================= TABLA ========================= */

export function TablaReservas({ reservas }: { reservas: ReservaProps[] }) {
    const getEstadoBadge = (estado: ReservaProps['estado']) => {
        switch (estado) {
            case 'confirmada':
                return (
                    <span className="inline-flex items-center px-3 py-1 text-verde3 text-sm font-bold rounded bg-verdetrans">
                        Confirmada
                    </span>
                );
            case 'pendiente':
                return (
                    <span className="inline-flex items-center px-3 py-1 text-amarillo text-sm font-bold rounded bg-amarillotrans">
                        Pendiente
                    </span>
                );
            case 'cancelada':
                return (
                    <span className="inline-flex items-center px-3 py-1 text-rojovino text-sm font-bold rounded bg-rojotrans">
                        Cancelada
                    </span>
                );
            case 'reembolsada':
                return (
                    <span className="inline-flex items-center px-3 py-1 text-azul1 text-sm font-bold rounded bg-azultrans">
                        Reembolsada
                    </span>
                );
        }
    };

    return (
        <div className="flex-1 overflow-y-auto min-h-0">
            <div className="bg-beige1 rounded-lg shadow-sm border border-borde1 mt-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-tabla-header text-center text-black text-sm font-bold tracking-wider">
                            <tr>
                                <th className='px-2 py-3'>ID</th>
                                <th className='px-2 py-3'>Cliente</th>
                                <th className='px-4 py-3'>Tour</th>
                                <th className='px-2 py-3'>Fecha</th>
                                <th className='px-1 py-3'>Personas</th>
                                <th className='px-1 py-3'>Monto</th>
                                <th className='px-2 py-3'>Estado</th>
                                <th className='px-2 py-3'>Solicitar reembolso</th>
                                <th className='px-2 py-3'>Comprobante</th>

                            </tr>
                        </thead>
                        <tbody className="bg-beige1 divide-y divide-borde1">
                            {reservas.map((reserva) => (
                                <tr key={reserva.id} className='bg-tabla-row text-center hover:bg-tabla-header'>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-black">{reserva.id}</td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <div className="text-sm font-bold text-verde1">{reserva.clienteNombre}</div>
                                        <div className="text-sm text-verde3">{reserva.clienteEmail}</div>
                                    </td>
                                    <td className="px-4 py-4 text-sm text-black">{reserva.tour}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{reserva.fecha}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-lg text-rojosuave font-bold">{reserva.personas}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-verde3">₡{reserva.monto.toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{getEstadoBadge(reserva.estado)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm flex  justify-center items-center">
                                        {reserva.estado != 'reembolsada' ? (
                                            <button className="text-rojovino bg-rojotrans font-bold hover:text-rojo1 flex items-center rounded-md justify-center px-3 py-1 gap-2 hover:[&>svg]:text-rojo1 hover:cursor-pointer">
                                                <svg
                                                    className="w-6 h-6 text-rojovino dark:text-rojovino"
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
                                                        d="m16 10 3-3m0 0-3-3m3 3H5v3m3 4-3 3m0 0 3 3m-3-3h14v-3"
                                                    />
                                                </svg>
                                                Solicitar
                                            </button>
                                        ) : (
                                            <button disabled className="text-gray-400 bg-gray-200 font-bold flex items-center rounded-md justify-center px-3 py-1 gap-2 cursor-not-allowed">
                                                <svg
                                                    className="w-6 h-6 text-gray-400"
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
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                                Reembolsado
                                            </button>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-black hover:underline hover:cursor-pointer">
                                        Descargar
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

