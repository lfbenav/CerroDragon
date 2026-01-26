/* eslint-disable @typescript-eslint/no-unused-vars */
import { on } from 'events';
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
    rawId?: string; // ID real de la reserva (sin el prefijo RV-)
    clienteNombre: string;
    clienteEmail: string;
    tour: string;
    monto: number;
    fecha: string;
    personas: number;
    estado: 'confirmada' | 'pendiente' | 'cancelada' | 'reembolsada' | 'solicitado';
}

interface GestionReservaProps {
    id: string;
    clienteNombre: string;
    clienteEmail: string;
    tour: string;
    monto: number;
    fecha: string;
    personas: number;
    guiaAsignado: string;
    estado: 'confirmada' | 'pendiente' | 'cancelada' | 'reembolsada';
}

interface Comidas1Props {
    id: string;
    clienteNombre: string;
    clienteEmail: string;
    tour: string;
    registros: number;
    reservaAsociada: string;
    fecha: string;
}

interface Comidas2Props {
    id: string;
    nombreComida: string;
    mostrar: boolean;
}

interface CardPaqueteProps {
    nombre: string;
    descripcion: string;
    precio: number;
}

interface CardPaquetePromoProps {
    nombre: string;
    descripcion: string;
    precioAntes: number;
    precioAhora: number;
}

interface GuiaProps {
    id: string;
    nombre: string;
}

interface ConsultaProps {
    id: string;
    clienteNombre: string;
    telefono: string;
    consulta: string;
    fecha: string;
    estado: 'pendiente' | 'resuelta';
}

interface CuponProps {
    id: string;
    codigoAsociado: string;
    descuento: number;
    canjeados: number;
    limite: number;
    fechaCreacion: string;
}

interface CardTestimonioAdminProps {
    id: number;
    nombre: string;
    comentario: string;
    fecha: string;
    estado: 'pendiente' | 'aprobado' | 'rechazado';
    onApprove?: (id: number) => void; 
    onReject?: (id: number) => void;
}

interface ImageUploadProps {
    imagen: File | null;
    onImageChange: (file: File | null) => void;
    disabled?: boolean;
    label?: string;
    height?: string;
    placeholder?: string;
    accept?: string;
}

interface AlojamientoProps {
    id: string;
    clienteNombre: string;
    clienteEmail: string;
    cabana: string;
    fechaReserva: string;
    fechaLlegada: string;
    fechaFinal: string;
    personas: number;
    estado:
        | "confirmada"
        | "pendiente"
        | "cancelada"
        | "reembolsada"
        | "solicitado";

}

interface Props {
  reservas: AlojamientoProps[];
  onDescargarComprobante: (reserva: AlojamientoProps) => void;
  onReembolso: (reserva: AlojamientoProps) => void;
}



/* ========================= CALENDARIO PROPS ========================= */

interface CalendarDayProps {
    day: number;
    ocupacion: NivelOcupacion;
}

interface AdminCalendarDayProps {
    day: number;
    ocupacion: NivelOcupacion;
    onClick: (day: number) => void;
    isSelected?: boolean;
}

interface CalendarGridProps {
    ocupacionData?: { [key: number]: NivelOcupacion };
    mes?: string;
    año?: number;
    daysInMonth?: number;
    firstDayOfWeek?: number;
}

interface AdminCalendarGridProps {
    ocupacionData?: { [key: number]: NivelOcupacion };
    mes?: string;
    año?: number;
    daysInMonth?: number;
    firstDayOfWeek?: number;
    onDayUpdate?: (day: number, newOcupacion: NivelOcupacion) => void;
}

interface CalendarUpdateData {
    día: number;
    ocupacion: NivelOcupacion;
    mes: number;
    año: number;
}

type NivelOcupacion = 'desocupado' | 'no-disponible' | 'poco-ocupado' | 'medio-ocupado' | 'muy-ocupado';

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
            <li>
                <a
                href="/cliente/comida"
                className="flex items-center px-2 py-1.5 text-white rounded-base group"
                >
                <div className="w-5 h-5 mr-3"></div>
                <span className="flex-1 whitespace-nowrap">Comidas</span>
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
                        d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3  3 0 0 0-3 3v10a3 3 0 0 0 3 3h2"
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
            href="#"
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
                <Link
                href="/admin/clientes"
                className="flex items-center px-2 py-1.5 text-white rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
                >
                <div className="w-5 h-5 mr-3"></div>
                <span className="flex-1 whitespace-nowrap">Clientes</span>
                </Link>
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
                href="/admin/politicas"
                className="flex items-center px-2 py-1.5 text-white rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
                >
                <div className="w-5 h-5 mr-3"></div>
                <span className="flex-1 whitespace-nowrap">Políticas</span>
                </a>
            </li>
            <li>
                <a
                href="/admin/reembolsos"
                className="flex items-center px-2 py-1.5 text-white rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
                >
                <div className="w-5 h-5 mr-3"></div>
                <span className="flex-1 whitespace-nowrap">Reembolsos</span>
                </a>
            </li>
            <li>
                <a
                href="/admin/puntos"
                className="flex items-center px-2 py-1.5 text-white rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
                >
                <div className="w-5 h-5 mr-3"></div>
                <span className="flex-1 whitespace-nowrap">Puntos de encuentro</span>
                </a>
            </li>
            <li>
                <Link
                    href="/admin/cabanas"
                    className="flex items-center px-2 py-1.5 text-white rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
                >
                <div className="w-5 h-5 mr-3"></div>
                <span className="flex-1 whitespace-nowrap">Cabañas</span>
                </Link>
            </li>
            <li>
                <a
                href="/admin/alojamientos"
                className="flex items-center px-2 py-1.5 text-white rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
                >
                <div className="w-5 h-5 mr-3"></div>
                <span className="flex-1 whitespace-nowrap">Alojamientos</span>
                </a>
            </li>
            <li>
                <a
                href="/admin/comidas"
                className="flex items-center px-2 py-1.5 text-white rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
                >
                <div className="w-5 h-5 mr-3"></div>
                <span className="flex-1 whitespace-nowrap">Comidas</span>
                </a>
            </li>
            <li>
                <a
                href="/admin/inventario"
                className="flex items-center px-2 py-1.5 text-white rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
                >
                <div className="w-5 h-5 mr-3"></div>
                <span className="flex-1 whitespace-nowrap">Inventario</span>
                </a>
            </li>
            <li>
                <a
                href="/admin/clima"
                className="flex items-center px-2 py-1.5 text-white rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
                >
                <div className="w-5 h-5 mr-3"></div>
                <span className="flex-1 whitespace-nowrap">Incidencias/Clima</span>
                </a>
            </li>
            <li>
                <a
                href="/admin/testimonios"
                className="flex items-center px-2 py-1.5 text-white rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
                >
                <div className="w-5 h-5 mr-3"></div>
                <span className="flex-1 whitespace-nowrap">Testimonios</span>
                </a>
            </li>
            <li>
                <a
                href="/admin/auditoria"
                className="flex items-center px-2 py-1.5 text-white rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
                >
                <div className="w-5 h-5 mr-3"></div>
                <span className="flex-1 whitespace-nowrap">Auditoria</span>
                </a>
            </li>
            <li>
                <Link
                href="/admin/administradores"
                className="flex items-center px-2 py-1.5 text-white rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group"
                >
                <div className="w-5 h-5 mr-3"></div>
                <span className="flex-1 whitespace-nowrap">Administradores</span>
                </Link>
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
                        d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3  3 0 0 0-3 3v10a3 3 0 0 0 3 3h2"
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
        <a href={`/cliente/tours/info?id=${id}`} className="block overflow-hidden relative">
            <div className="absolute top-4 left-4 bg-amarillo text-black text-sm font-semibold px-3 py-1 rounded-md z-20">
                ${precio}
            </div>
            <div className="h-36 overflow-hidden">
                <img
                    src={imagen || "/tour1.png"}
                    alt={nombre}
                    className="rounded-t-xl w-full h-full object-cover"
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
                href={`/cliente/tours/info?id=${id}`}
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

export function CardTourAdmin({id, nombre, descripcion, precio, capacidad, duracion, etiqueta, imagen}: CardTourProps) {
    return (
    <div className="bg-beige1 block w-[350px] h-92 border border-default border-borde1 rounded-xl cardTour relative flex flex-col">
        <a href={`/admin/tours/info?id=${id}`} className="block overflow-hidden relative">
            {precio && precio > 0 && (
                <div className="absolute top-4 left-4 bg-amarillo text-black text-sm font-semibold px-3 py-1 rounded-md z-20">
                    ${precio}
                </div>
            )}
            <div className="h-36 overflow-hidden">
                <img
                className="rounded-t-xl w-full h-full object-cover"
                src={imagen || "/tour1.png"}
                alt=""
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
                href={`/admin/tours/info?id=${id}`}
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

export function CardGuide({
    nombre,
    activo,
    imagen,
}: {
    nombre: string;
    activo: string;
    imagen?: string;
}) {
    return (
        <div className="bg-beige1 block w-60 h-80 border border-default border-borde1 rounded-xl relative flex flex-col shadow-md">
            <div className="h-48 overflow-hidden m-4 rounded-lg">
                <img
                    className="rounded-lg w-full h-full object-cover"
                    src={imagen || "/guia1.png"}
                    alt="Guía turístico"
                />
            </div>

            <div className="flex-1 px-4 pb-4 flex flex-col justify-between items-center text-center">
                <h3 className="text-lg font-medium text-black">
                    {nombre}
                </h3>

                {activo === "Activo" ? (
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


export function CardGuideAdmin({
    id,
    nombre,
    activo,
    imagen,
}: {
    id: string | number;
    nombre: string;
    activo: "Activo" | "Inactivo";
    imagen?: string;
}) {
    return (
        <Link href={`/admin/guias/info?id=${id}`}>
            <div className="bg-beige1 block w-60 h-80 border border-default border-borde1 rounded-xl relative flex flex-col shadow-md hover:scale-105 hover:shadow-lg transition-all">
                <div className="h-48 overflow-hidden m-4 rounded-lg">
                    <img
                        className="rounded-lg w-full h-full object-cover"
                        src={imagen || "/guia1.png"}
                        alt="Guía turístico"
                    />
                </div>

                <div className="flex-1 px-4 pb-4 flex flex-col justify-between items-center text-center">
                    <h3 className="text-lg font-medium text-black">
                        {nombre}
                    </h3>

                    {activo === "Activo" ? (
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
        </Link>
    );
}

export function CardCabana({id, nombre, descripcion, capacidad, etiqueta, imagen}: CardCabanaProps) {
    return (
        <div className="bg-beige1 block w-[350px] h-80 border border-default border-borde1 rounded-xl cardTour relative flex flex-col">
        <a href={`/cliente/cabanas/info?id=${id}`} className="block overflow-hidden relative">
            <div className="h-48 overflow-hidden">
                <img
                className="rounded-t-xl w-full h-full object-cover"
                src={imagen || "/tour1.png"}
                alt=""
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
                href={`/cliente/cabanas/info?id=${id}`}
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
 
export function CardCabanaAdmin({id, nombre, descripcion, capacidad, etiqueta, imagen}: CardCabanaProps) {
    return (
        <div className="bg-beige1 block w-[350px] h-80 border border-default border-borde1 rounded-xl cardTour relative flex flex-col">
        <a href={"/admin/cabanas/"+id} className="block overflow-hidden relative">
            <div className="h-48 overflow-hidden">
                <img
                className="rounded-t-xl w-full h-full object-cover"
                src={imagen || "/tour1.png"}
                alt=""
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
                <Link
                href={`/admin/cabanas/${id}`}
                className="inline-flex items-end text-verde3 bg-brand font-medium text-sm py-2"
                >
                    Editar
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
                </Link>
            </div>
        </div>
    </div>
    );
}

export function CardPromocion({id, nombre, descripcion, precioAhora, precioAntes, descuento, capacidad, duracion, etiqueta, imagen}: CardPromoProps) {
    return (
    <div className="bg-beige1 block w-[350px] h-92 border border-default border-borde1 rounded-xl cardTour relative flex flex-col">
        <a href={`/cliente/promociones/info?id=${id}`} className="block overflow-hidden relative">
            <div className="absolute top-6 left-4 bg-rojo2 text-black text-sm font-bold px-2 py-1 rounded-md z-20 transform -rotate-12">
                PROMOCIÓN -{descuento}%
            </div>
            <div className="absolute top-4 right-4 bg-amarillo text-black text-sm font-semibold px-3 py-1 rounded-md z-20">
                Ahora ${precioAhora} 
                <span className='text-xs font-normal'> <br />Antes: <span className="line-through">${precioAntes}</span> </span>
            </div>
            <div className="h-48 overflow-hidden">
                <img
                className="rounded-t-xl w-full h-full object-cover"
                src={imagen || "/tour1.png"}
                alt=""
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
                href={`/cliente/promociones/info?id=${id}`}
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

export function CardPromocionAdmin({id, nombre, descripcion, precioAhora, precioAntes, descuento, capacidad, duracion, etiqueta, imagen, onDelete}: CardPromoProps & {onDelete: () => void}) {
    return (
    <div className="bg-beige1 block w-[350px] h-92 border border-default border-borde1 rounded-xl cardTour relative flex flex-col">
        <a href={`/admin/promociones/info?id=${id}`} className="block overflow-hidden relative">
            <div className="absolute top-6 left-4 bg-rojo2 text-black text-sm font-bold px-2 py-1 rounded-md z-20 transform -rotate-12">
                PROMOCIÓN -{descuento}%
            </div>
            <div className="absolute top-4 right-4 bg-amarillo text-black text-sm font-semibold px-3 py-1 rounded-md z-20">
                Ahora ${precioAhora} 
                <span className='text-xs font-normal'> <br />Antes: <span className="line-through">${precioAntes}</span> </span>
            </div>
            <div className="h-48 overflow-hidden">
                <img
                className="rounded-t-xl w-full h-full object-cover"
                src={imagen || "/tour1.png"}
                alt=""
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
                <button className='my-2 hover:cursor-pointer' onClick={onDelete}>
                    <svg
                        className="w-6 h-6 text-verde1 dark:text-verde1"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            fillRule="evenodd"
                            d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div>
        </div>
    </div>
    );
}

interface CardPuntoProps {
  nombre: string;
  ubicacion: string;
  direccion: string;
  imagen?: string;
}

export function CardPunto({
  nombre,
  ubicacion,
  direccion,
  imagen,
}: CardPuntoProps) {
  return (
    <div className="bg-beige1 w-60 block border border-default border-borde1 rounded-xl relative flex flex-col">
      <div className="flex justify-center items-center m-4 h-32">
        <img
          className="rounded-lg w-32 h-32 object-cover"
          src={imagen || "/punto1.png"}
          alt="Punto de encuentro"
        />
      </div>

      <div className="flex-1 px-4 pb-4 flex flex-col justify-between items-center text-center">
        <h3 className="text-lg font-medium text-black">{nombre}</h3>

        <div className="mb-2 w-full">
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(ubicacion)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-verde3 hover:text-verde2 underline break-words"
          >
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
                
                {/* <div className="flex items-center">
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
                </div> */}
            </div>
        </div>
    );
}

export function CardTestimonioAdmin({id, nombre, comentario, fecha, estado, onApprove, onReject}: CardTestimonioAdminProps) {
    return (
        <div className="bg-beige1 w-full h-auto border border-borde1 rounded-xl p-4 flex flex-col shadow-sm inline-block mb-6" style={{breakInside: 'avoid', pageBreakInside: 'avoid'}}>
            <div className="flex flex-col items-start text-left mb-4">
                <h3 className="text-lg font-semibold text-black mb-2">{nombre}</h3>
                <p className="text-sm text-verde3 leading-relaxed italic">
                    &quot;{comentario}&quot;
                </p>
            </div>
            <div className="flex items-center mb-6">
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
            <hr className="border-borde1 mb-3" />
            
            <div className="flex justify-center items-center">
                {estado === 'aprobado' ? (
                    <span className="inline-flex items-center justify-center px-4 py-1 text-verde3 text-base font-bold rounded w-fit">
                        Aprobado
                    </span>
                ) : estado === 'rechazado' ? (
                    <span className="inline-flex items-center justify-center px-4 py-1 text-verde3 text-base font-bold rounded w-fit">
                        Rechazado
                    </span>
                ) : (
                    <div className="flex justify-between gap-15">
                        <button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-verde2 text-white text-base font-normal rounded w-fit"
                            onClick={() => onApprove?.(id)}
                        >
                            <svg
                                className="w-6 h-6 text-white dark:text-white"
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
                                    d="M5 11.917 9.724 16.5 19 7.5"
                                />
                            </svg>
                            Aprobar
                        </button>
                        <button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-rojosuave text-black text-base font-normal rounded w-fit"
                            onClick={() => onReject?.(id)}
                        >
                            <svg
                                className="w-6 h-6 text-black dark:text-black"
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
                                    d="m6 6 12 12m3-6a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                />
                            </svg>

                            Rechazar
                        </button>
                    </div>
                )}
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
        <div className={`w-full h-auto border-2 rounded-xl p-4 flex flex-col shadow-sm ${getAlertStyles()}`}>
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

export function CardPaquete({nombre, descripcion, precio}: CardPaqueteProps) {
    return (
        <div className="bg-beige1 w-50 h-auto border border-borde1 rounded-xl p-3 flex flex-col shadow-md justify-center items-center text-center relative min-h-[180px]">
            <div className="absolute top-3 left-3 bg-amarillo text-black text-sm font-semibold px-2 py-1 rounded-md z-20">
                ${precio}
            </div>
            <div className="flex justify-center mb-3 mt-2">
            <Image 
                src="/paquete.png"
                alt="Ícono de paquete"
                width={70}
                height={70}
            />
            </div>
            <h3 className="text-md font-semibold text-black mb-2 mx-2">{nombre}</h3>
            <p className="text-xs text-verde3 leading-relaxed mx-2 mb-2 text-center">
                {descripcion}
            </p>
        </div>
    );
}

export function CardPaquetePromo({nombre, descripcion, precioAntes, precioAhora}: CardPaquetePromoProps) {
    return (
        <div className="bg-beige1 w-50 h-auto border border-borde1 rounded-xl p-3 flex flex-col shadow-md justify-center items-center text-center relative min-h-[180px]">
            <div className="absolute top-3 left-3 bg-amarillo text-black text-sm font-semibold px-2 py-1 rounded-md z-20">
                ${precioAhora} <span className='text-xs font-normal'> <br />Antes: <span className="line-through">${precioAntes}</span> </span>
            </div>
            <div className="flex justify-center mb-3 mt-2">
                <Image 
                    src="/paquete.png"
                    alt="Ícono de paquete"
                    width={70}
                    height={70}
                />
            </div>
            <h3 className="text-md font-semibold text-black mb-2 mx-2">{nombre}</h3>
            <p className="text-xs text-verde3 leading-relaxed mx-2 mb-2 text-center">
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
      // eslint-disable-next-line react-hooks/set-state-in-effect
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

interface CardPuntoProps {
  id: number;
  nombre: string;
  ubicacion: string;
  direccion: string;
  imagen?: string;
  onDelete: (id: number) => void;
}

export function CardPuntoAdmin({
  id,
  nombre,
  ubicacion,
  direccion,
  imagen,
  onDelete,
}: CardPuntoProps) {
  return (
    <div className="bg-beige1 w-70 block border border-default border-borde1 rounded-xl relative flex flex-col">
      <div className="flex justify-center items-center m-4 h-32">
        <img
          className="rounded-lg w-32 h-32 object-cover"
          src={imagen || "/punto1.png"}
          alt="Punto de encuentro"
        />
      </div>

      <div className="flex-1 px-4 pb-4 flex flex-col justify-between items-center text-center">
        <h3 className="text-lg font-medium text-black">{nombre}</h3>

        <div className="mb-2 w-full">
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(ubicacion)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-verde3 hover:text-verde2 underline break-words"
          >
            {ubicacion}
          </a>
        </div>

        <p className="text-sm text-verde3">{direccion}</p>
      </div>

      <hr className="border-1 border-borde1 mt-2 mx-4 mb-4" />

      <div className="flex justify-end items-center">
        <button
          onClick={() => onDelete(id)}
          className="px-4 pb-4 rounded-b-xl hover:scale-105 transition-transform"
          title="Eliminar punto"
        >
          <svg
            className="w-6 h-6 text-verde1"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

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
  onSave: (next: { titulo: string; descripcion: string; tipo: IncTipo }) => void;
  onDelete: () => void;
}) {
  /* =========================
     LOCAL STATE (SAFE)
  ========================== */

  const [t, setT] = useState<string>(titulo || "");
  const [d, setD] = useState<string>(descripcion || "");
  const [tp, setTp] = useState<IncTipo>(tipo || "leve");

  const [confirmOpen, setConfirmOpen] = useState(false);

  /* =========================
     SYNC WHEN EXIT EDIT MODE
  ========================== */

  useEffect(() => {
    if (!isEditing) {
      setT(titulo || "");
      setD(descripcion || "");
      setTp(tipo || "leve");
    }
  }, [titulo, descripcion, tipo, isEditing]);

  /* =========================
     STYLES
  ========================== */

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

  /* =========================
     ACTIONS
  ========================== */

  const handleSave = () => {
    onSave({
      titulo: t.trim(),
      descripcion: d.trim(),
      tipo: tp,
    });
  };

  /* =========================
     RENDER
  ========================== */

  return (
    <div
      className={`border rounded-xl p-5 transition ${getAlertStyles()}`}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          {isEditing ? (
            <>
              <input
                value={t}
                onChange={(e) => setT(e.target.value)}
                className="w-full mb-2 bg-white border border-borde1 rounded-lg px-3 py-2 text-black"
                placeholder="Título de la alerta"
              />

              <textarea
                value={d}
                onChange={(e) => setD(e.target.value)}
                className="w-full bg-white border border-borde1 rounded-lg px-3 py-2 text-black"
                rows={3}
                placeholder="Descripción de la alerta"
              />

              <div className="mt-3 flex gap-2">
                <select
                  value={tp}
                  onChange={(e) => setTp(e.target.value as IncTipo)}
                  className="bg-white border border-borde1 rounded-lg px-3 py-2 text-black"
                >
                  <option value="leve">Leve</option>
                  <option value="moderado">Moderado</option>
                  <option value="grave">Grave</option>
                  <option value="critico">Crítico</option>
                </select>
              </div>
            </>
          ) : (
            <>
              <h4 className="text-lg font-bold text-black mb-1">
                {titulo}
              </h4>
              <p className="text-sm text-black mb-2">
                {descripcion}
              </p>
              <p className="text-xs text-black/60">
                {fecha}
              </p>
            </>
          )}
        </div>

        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="text-sm px-3 py-1 rounded-lg bg-verde2 text-white"
              >
                Guardar
              </button>
              <button
                onClick={onCancelEdit}
                className="text-sm px-3 py-1 rounded-lg border border-borde1 text-black"
              >
                Cancelar
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onStartEdit}
                className="text-sm px-3 py-1 rounded-lg border border-borde1 text-black"
              >
                Editar
              </button>
              <button
                onClick={() => setConfirmOpen(true)}
                className="text-sm px-3 py-1 rounded-lg text-rojovino"
              >
                Eliminar
              </button>
            </>
          )}
        </div>
      </div>

      {/* Confirm delete */}
      {confirmOpen && (
        <div className="mt-4 flex gap-2">
          <button
            onClick={onDelete}
            className="px-3 py-1 text-sm rounded-lg bg-rojovino text-white"
          >
            Confirmar
          </button>
          <button
            onClick={() => setConfirmOpen(false)}
            className="px-3 py-1 text-sm rounded-lg border border-borde1"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
}

/* ========================= ADMIN - POLITICAS ========================= */

export function CardPoliticaAdmin({
  id,
  titulo,
  descripcion,
  isEditing,
  onStartEdit,
  onCancelEdit,
  onSave,
  onDelete,
}: {
  id: string;
  titulo: string;
  descripcion: string;
  isEditing: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSave: (next: { titulo: string; descripcion: string }) => void;
  onDelete: () => void;
}) {
  const TITLE_MAX = 60;
  const DESC_MAX = 475;

  const [t, setT] = useState(titulo);
  const [d, setD] = useState(descripcion);

  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setT(titulo);
      setD(descripcion);
    }
  }, [titulo, descripcion, isEditing]);

  const handleEditOrSave = () => {
    if (!isEditing) return onStartEdit();
    onSave({ titulo: t.trim(), descripcion: d.trim() });
  };

  const handleCancel = () => {
    setT(titulo);
    setD(descripcion);
    onCancelEdit();
  };

  const requestDelete = () => setConfirmOpen(true);
  const cancelDelete = () => setConfirmOpen(false);
  const confirmDelete = () => {
    setConfirmOpen(false);
    onDelete();
  };

  return (
    <div className="bg-beige1 w-full h-auto border border-borde1 rounded-xl p-4 flex flex-col shadow-sm inline-block">
      {/* header row + actions */}
      <div className="flex items-start mx-4 gap-3">
        <div className="flex-1">
          {isEditing ? (
            <>
              <input
                value={t}
                onChange={(e) => setT(e.target.value)}
                maxLength={TITLE_MAX}
                className="w-full text-lg font-semibold text-black bg-transparent outline-none border-b border-borde1 pb-1"
                placeholder="Título"
              />
              <div className="mt-1 text-right text-xs text-verde3">
                {t.length}/{TITLE_MAX}
              </div>
            </>
          ) : (
            <h3 className="text-lg font-semibold text-black">{titulo}</h3>
          )}
        </div>

        {/* actions on the right */}
        <div className="flex items-center gap-2 mt-1">
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

      <hr className="border-borde1 mb-2 mx-4 border-1" />

{/* description */}
{isEditing ? (
  <div className="px-4">
    <textarea
      value={d}
      onChange={(e) => setD(e.target.value.slice(0, DESC_MAX))}
      maxLength={DESC_MAX}
      rows={4}
      className="
        w-full
        pr-16
        text-sm text-verde3 leading-relaxed
        mb-1
        bg-beige2
        border border-borde2
        rounded-md
        px-3 py-2
        outline-none
        resize-none
        focus:ring-2 focus:ring-verde2
      "
      placeholder="Descripción"
    />
    <div className="mb-2 text-right text-xs text-verde3">
      {d.length}/{DESC_MAX}
    </div>
  </div>
) : (
  <p className="text-sm text-verde3 leading-relaxed px-4 mb-2">
    {descripcion}
  </p>
)}

      <ConfirmModal
        open={confirmOpen}
        title="Eliminar entrada"
        message={`¿Está seguro de que desea eliminar "${titulo}"?\n\nEsta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        confirmVariant="danger"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}


/* ========================= ICONS ========================= */


export function PlusIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function FilterIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-black/70" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function PencilIcon() {
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

export function CheckIcon() {
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

export function XIcon() {
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

export function CircleXIcon() {
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

export function AdminCalendarDay({ day, ocupacion, onClick, isSelected }: AdminCalendarDayProps) {
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
        return 'bg-transparent text-black border-2 border-gray-300';
    }
  };

  const selectedClass = isSelected ? 'ring-4 ring-verde2' : '';

  return (
    <div className="flex justify-center items-center h-16">
      <button
        onClick={() => onClick(day)}
        className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-medium hover:scale-110 transition-all cursor-pointer ${getColorClasses()} ${selectedClass}`}
      >
        {day}
      </button>
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

export function AdminCalendarGrid({ 
  ocupacionData = {}, 
  mes = "ENERO", 
  año = 2025, 
  daysInMonth = 31, 
  firstDayOfWeek = 3,
  onDayUpdate
}: AdminCalendarGridProps) {

  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [currentOcupacionData, setCurrentOcupacionData] = useState<
    Record<number, NivelOcupacion>
  >({});

  /* ==========================
     🔑 CLAVE: sincronizar props
  ========================== */
  useEffect(() => {
    setCurrentOcupacionData(ocupacionData);
  }, [ocupacionData]);

  const weekDays = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

  const calendarDays: Array<{ day: number; ocupacion: NivelOcupacion } | null> = [];

  // Días vacíos iniciales
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null);
  }

  // Días del mes
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({
      day,
      ocupacion: currentOcupacionData[day] ?? "desocupado",
    });
  }

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
  };

  const handleOcupacionChange = (newOcupacion: NivelOcupacion) => {
    if (!selectedDay) return;

    const updatedData = {
      ...currentOcupacionData,
      [selectedDay]: newOcupacion,
    };

    setCurrentOcupacionData(updatedData);

    if (onDayUpdate) {
      onDayUpdate(selectedDay, newOcupacion);
    }

    setSelectedDay(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-borde1 p-6 max-w-5xl mx-auto">
      
      {/* Título */}
      <div className="text-center mb-6">
        <h2 className="text-4xl font-bold text-black mb-2">{mes}</h2>
        <p className="text-verde3">{año}</p>
      </div>

      {/* Días semana */}
      <div className="grid grid-cols-7 gap-4 mb-4">
        {weekDays.map((day, index) => (
          <div key={index} className="text-center font-bold text-xl text-black">
            {index === 0 ? <span className="text-rojosuave">{day}</span> : day}
          </div>
        ))}
      </div>

      {/* Calendario */}
      <div className="grid grid-cols-7 gap-4 mb-6">
        {calendarDays.map((dayData, index) => (
          <div key={index} className="text-center">
            {dayData ? (
              <AdminCalendarDay 
                day={dayData.day} 
                ocupacion={dayData.ocupacion}
                onClick={handleDayClick}
                isSelected={selectedDay === dayData.day}
              />
            ) : (
              <div className="h-16"></div>
            )}
          </div>
        ))}
      </div>

      {/* Selector */}
      {selectedDay && (
        <div className="bg-beige1 border border-borde1 rounded-xl p-4 mb-6">
          <h3 className="text-lg font-semibold text-black mb-3 text-center">
            Configurar día {selectedDay}
          </h3>

          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={() => handleOcupacionChange('desocupado')} className="px-4 py-2 border-2 border-gray-300 rounded-lg">
              Desocupado
            </button>
            <button onClick={() => handleOcupacionChange('no-disponible')} className="px-4 py-2 bg-celeste rounded-lg">
              No disponible
            </button>
            <button onClick={() => handleOcupacionChange('poco-ocupado')} className="px-4 py-2 bg-verde4 rounded-lg">
              Poco ocupado
            </button>
            <button onClick={() => handleOcupacionChange('medio-ocupado')} className="px-4 py-2 bg-amarillo rounded-lg">
              Medio ocupado
            </button>
            <button onClick={() => handleOcupacionChange('muy-ocupado')} className="px-4 py-2 bg-rojosuave rounded-lg">
              Muy ocupado
            </button>
          </div>

          <div className="text-center mt-3">
            <button
              onClick={() => setSelectedDay(null)}
              className="px-4 py-2 bg-gray-300 rounded-lg"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Leyenda */}
      <div className="pt-6 border-t border-borde1">
        <h3 className="text-lg font-semibold text-black mb-4 text-center">
          Disponibilidad
        </h3>
        <div className="flex flex-wrap justify-center gap-6">
          {/* igual que antes, no tocado */}
        </div>
      </div>
    </div>
  );
}

/* ========================= TOP BAR ========================= */

export function TopBar() {
  const [profileHref, setProfileHref] = useState("/login");

  useEffect(() => {
    try {
      const userRaw = localStorage.getItem("user");
      if (!userRaw) return;

      const user = JSON.parse(userRaw);

      if (user.type === "admin") {
        setProfileHref("/admin/perfil");        //! No sé qué es ese warning la verdad, solo así funciona
      } else if (user.type === "client") {
        setProfileHref("/cliente/perfil");
      }
    } catch {
      // noop
    }
  }, []);

  return (
    <nav className="bg-beige1 fixed top-0 left-64 right-0 z-20 border-b border-gray-200">
      <div className="flex items-center justify-end px-6 py-4 gap-3">
        <Link href={profileHref}>
          <button
            type="button"
            className="flex text-sm rounded-full focus:ring-4 focus:ring-gray-300"
          >
            <span className="sr-only">User menu</span>
            <Image
              className="w-8 h-8 rounded-full"
              src="/cerro.png"
              alt="user photo"
              width={32}
              height={32}
            />
          </button>
        </Link>
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
            <Link
                href="/login"
                className="text-white bg-verde2 rounded-xl x-12 box-border border border-transparent shadow-xs font-medium leading-5 rounded-base text-sm px-3 py-2 flex items-center gap-2"
            >
                <svg
                    className="w-4 h-4"
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
                        d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3  3 0 0 0-3 3v10a3 3 0 0 0 3 3h2"
                    />
                </svg>
                Login
            </Link>
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

export function SearchBarwFilters({texto, filters, selectedFilter, onFilterChange}: {
    texto: string, 
    filters: string[], 
    selectedFilter?: string,
    onFilterChange?: (filter: string) => void
}) {
    const [currentFilter, setCurrentFilter] = useState(selectedFilter || filters[0] || 'todos');

    const handleFilterSelect = (filter: string) => {
        setCurrentFilter(filter);
        if (onFilterChange) {
            onFilterChange(filter);
        }
    };

    const getFilterDisplayName = (filter: string) => {
        switch (filter) {
            case 'todos':
                return 'Todos';
            case 'completos':
                return 'Completos';
            case 'incompletos':
                return 'Incompletos';
            default:
                return filter;
        }
    };

    return (
        <div className="bg-beige1 p-4 rounded-lg shadow-sm border border-borde1 mb-6">
            <div className="flex items-center gap-4">
                {/* Search Bar */}
                <div className="relative flex-1">
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
                        className="block w-full py-2 px-3 ps-9 bg-beige2 border border-borde2 text-verde3 placeholder-verde3 text-sm rounded-base focus:ring-verde2 focus:border-verde2"
                        placeholder={texto}
                    />
                </div>
                
                {/* Filter Buttons */}
                <div className="flex gap-2">
                    {filters.map((filter) => (
                        <button
                            key={filter}
                            type="button"
                            onClick={() => handleFilterSelect(filter)}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                currentFilter === filter
                                    ? 'bg-verde3 text-white'
                                    : 'bg-beige2 text-verde1 border border-borde1 hover:bg-tabla-header'
                            }`}
                        >
                            {getFilterDisplayName(filter)}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function SearchBarAdmin({ texto, value, onChange }: SearchBarProps) {
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

        <main className="flex-1 flex flex-col ml-72  pt-20 px-8 min-h-0">
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

export function CuadroTexto({titulo, texto}: {titulo: string, texto: string}) {
    return (
        <div className='bg-beige1 w-[400px] border-borde1 border rounded-xl p-4 flex flex-col 1justify-start shadow-sm'>
            <h3 className="mb-2 text-sm font-medium text-verde3">{titulo}</h3>
            <p className="text-2xl font-normal text-black pl-4">{texto}</p>
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

export function TablaReservas({ reservas, onRefundRequested }: { reservas: ReservaProps[], onRefundRequested?: (id: string) => void }) {
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const handleDescargarComprobante = async (reserva: ReservaProps) => {
        // Importar jsPDF dinámicamente para evitar problemas de SSR
        const { jsPDF } = await import('jspdf');
        
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        
        // Colores
        const verdeOscuro = [34, 87, 57]; // #225739
        const grisOscuro = [51, 51, 51];
        
        // Header con fondo verde
        doc.setFillColor(verdeOscuro[0], verdeOscuro[1], verdeOscuro[2]);
        doc.rect(0, 0, pageWidth, 45, 'F');
        
        // Título
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('CERRO DRAGÓN', pageWidth / 2, 20, { align: 'center' });
        
        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        doc.text('Comprobante de Reserva', pageWidth / 2, 32, { align: 'center' });
        
        // Línea decorativa
        doc.setDrawColor(255, 255, 255);
        doc.setLineWidth(0.5);
        doc.line(40, 38, pageWidth - 40, 38);
        
        // Contenido
        doc.setTextColor(grisOscuro[0], grisOscuro[1], grisOscuro[2]);
        let y = 60;
        
        // ID de reserva destacado
        doc.setFillColor(245, 245, 245);
        doc.rect(15, y - 5, pageWidth - 30, 15, 'F');
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Número de Reserva:', 20, y + 5);
        doc.setTextColor(verdeOscuro[0], verdeOscuro[1], verdeOscuro[2]);
        doc.text(reserva.id, pageWidth - 20, y + 5, { align: 'right' });
        
        y += 25;
        doc.setTextColor(grisOscuro[0], grisOscuro[1], grisOscuro[2]);
        
        // Información del cliente
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Información del Cliente', 20, y);
        y += 10;
        
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text(`Nombre: ${reserva.clienteNombre}`, 25, y);
        y += 8;
        doc.text(`Correo: ${reserva.clienteEmail}`, 25, y);
        y += 15;
        
        // Detalles del tour
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Detalles del Tour', 20, y);
        y += 10;
        
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text(`Tour: ${reserva.tour}`, 25, y);
        y += 8;
        doc.text(`Fecha: ${reserva.fecha}`, 25, y);
        y += 8;
        doc.text(`Personas: ${reserva.personas}`, 25, y);
        y += 15;
        
        // Información de pago
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Información de Pago', 20, y);
        y += 10;
        
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text(`Monto Total: ₡${reserva.monto.toLocaleString()}`, 25, y);
        y += 15;
        
        // Estado con color
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Estado de la Reserva', 20, y);
        y += 10;
        
        const estadoTexto = {
            'confirmada': 'CONFIRMADA',
            'pendiente': 'PENDIENTE',
            'cancelada': 'CANCELADA',
            'reembolsada': 'REEMBOLSADA',
            'solicitado': 'REEMBOLSO SOLICITADO'
        };
        
        const estadoColor: { [key: string]: number[] } = {
            'confirmada': [34, 139, 34],
            'pendiente': [218, 165, 32],
            'cancelada': [178, 34, 34],
            'reembolsada': [70, 130, 180],
            'solicitado': [255, 140, 0]
        };
        
        doc.setFillColor(estadoColor[reserva.estado][0], estadoColor[reserva.estado][1], estadoColor[reserva.estado][2]);
        doc.roundedRect(25, y - 5, 60, 12, 3, 3, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(estadoTexto[reserva.estado], 55, y + 3, { align: 'center' });
        
        y += 25;
        
        // Línea separadora
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        doc.line(20, y, pageWidth - 20, y);
        
        y += 15;
        
        // Fecha de generación
        doc.setTextColor(128, 128, 128);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        const fechaGeneracion = new Date().toLocaleDateString('es-CR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        doc.text(`Documento generado el ${fechaGeneracion}`, pageWidth / 2, y, { align: 'center' });
        
        // Footer
        const footerY = doc.internal.pageSize.getHeight() - 20;
        doc.setFillColor(verdeOscuro[0], verdeOscuro[1], verdeOscuro[2]);
        doc.rect(0, footerY - 5, pageWidth, 30, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.text('Cerro Dragón Tours | Costa Rica', pageWidth / 2, footerY + 5, { align: 'center' });
        doc.setFontSize(8);
        doc.text('WhatsApp: +506 8460-3211 | www.cerrodragon.com', pageWidth / 2, footerY + 12, { align: 'center' });
        
        // Descargar
        doc.save(`Reserva_${reserva.id}.pdf`);
    };

    const handleSolicitarReembolso = async (reserva: ReservaProps) => {
        const rawId = reserva.rawId || reserva.id.replace('RV-', '');
        
        if (!confirm('¿Está seguro que desea solicitar un reembolso para esta reserva?')) {
            return;
        }

        setLoadingId(reserva.id);
        try {
            const token = localStorage.getItem('access_token');
            const res = await fetch(`http://localhost:3000/reservations/${rawId}/request-refund`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (res.ok) {
                alert('Solicitud de reembolso enviada correctamente');
                if (onRefundRequested) {
                    onRefundRequested(reserva.id);
                }
            } else {
                const data = await res.json();
                alert(data.message || 'Error al solicitar reembolso');
            }
        } catch (error) {
            console.error('Error solicitando reembolso:', error);
            alert('Error al conectar con el servidor');
        } finally {
            setLoadingId(null);
        }
    };

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
            case 'solicitado':
                return (
                    <span className="inline-flex items-center px-3 py-1 text-orange-700 text-sm font-bold rounded bg-orange-100">
                        Reembolso Solicitado
                    </span>
                );
        }
    };

    const getRefundButton = (reserva: ReservaProps) => {
        const isLoading = loadingId === reserva.id;

        if (reserva.estado === 'reembolsada') {
            return (
                <button disabled className="text-gray-400 bg-gray-200 font-bold flex items-center rounded-md justify-center px-3 py-1 gap-2 cursor-not-allowed">
                    <svg className="w-6 h-6 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Reembolsado
                </button>
            );
        }

        if (reserva.estado === 'solicitado') {
            return (
                <button disabled className="text-orange-700 bg-orange-100 font-bold flex items-center rounded-md justify-center px-3 py-1 gap-2 cursor-not-allowed">
                    <svg className="w-6 h-6 text-orange-700 animate-pulse" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Solicitado
                </button>
            );
        }

        if (reserva.estado === 'cancelada') {
            return (
                <button disabled className="text-gray-400 bg-gray-200 font-bold flex items-center rounded-md justify-center px-3 py-1 gap-2 cursor-not-allowed">
                    No disponible
                </button>
            );
        }

        return (
            <button 
                onClick={() => handleSolicitarReembolso(reserva)}
                disabled={isLoading}
                className="text-rojovino bg-rojotrans font-bold hover:text-rojo1 flex items-center rounded-md justify-center px-3 py-1 gap-2 hover:[&>svg]:text-rojo1 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <>
                        <svg className="w-6 h-6 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Enviando...
                    </>
                ) : (
                    <>
                        <svg className="w-6 h-6 text-rojovino dark:text-rojovino" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 10 19 7l3 3-3 3-3-3ZM5 13l4 4L19 7" />
                        </svg>
                        Solicitar
                    </>
                )}
            </button>
        );
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
                                    <td className="px-6 py-4 whitespace-nowrap text-sm flex justify-center items-center">
                                        {getRefundButton(reserva)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button 
                                            onClick={() => handleDescargarComprobante(reserva)}
                                            className="text-verde3 hover:text-verde1 hover:underline hover:cursor-pointer flex items-center gap-1"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            Descargar
                                        </button>
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

export function TablaFormsComidas({ comidas, checkin }: { comidas: Comidas1Props[], checkin?: boolean }) {
    return (
        <div className="flex-1 overflow-y-auto min-h-0 mb-6">
            <div className="bg-beige1 rounded-lg shadow-sm border border-borde1 mt-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-tabla-header text-center text-black text-sm font-bold tracking-wider">
                            <tr>
                                <th className='px-2 py-3'>Código</th>
                                <th className='px-2 py-3'>Cliente</th>
                                <th className='px-4 py-3'>Tour</th>
                                <th className='px-2 py-3'>Registros</th>
                                <th className='px-1 py-3'>Reserva Asociada</th>
                                <th className='px-1 py-3'>Fecha</th>
                                <th className='px-2 py-3'>Respuestas</th>
                            </tr>
                        </thead>
                        <tbody className="bg-beige1 divide-y divide-borde1">
                            {comidas.map((comida) => (
                                <tr key={comida.id} className='bg-tabla-row text-center hover:bg-tabla-header'>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-black">{comida.id}</td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <div className="text-sm font-bold text-verde1">{comida.clienteNombre}</div>
                                        <div className="text-sm text-verde3">{comida.clienteEmail}</div>
                                    </td>
                                    <td className="px-4 py-4 text-sm text-black">{comida.tour}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-lg text-rojosuave font-bold">{comida.registros}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{comida.reservaAsociada}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{comida.fecha}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm flex justify-center items-center">
                                        <Link href={checkin? `/admin/checkin/respuestas?id=${comida.id}` : `/admin/comidas/respuestas?id=${comida.id}`}>
                                            <button className="flex bg-amarillotrans font-bold items-center rounded-lg justify-center px-3 py-1 gap-2 text-amarillo hover:text-amarillo2 hover:[&>svg]:text-amarillo2 hover:cursor-pointer">
                                                <svg
                                                    className="w-6 h-6 text-amarillo dark:text-amarillo"
                                                    aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width={24}
                                                    height={24}
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        stroke="currentColor"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M4.07141 14v6h5.99999v-6H4.07141Zm4.5-4h6.99999l-3.5-6-3.49999 6Zm7.99999 10c1.933 0 3.5-1.567 3.5-3.5s-1.567-3.5-3.5-3.5-3.5 1.567-3.5 3.5 1.567 3.5 3.5 3.5Z"
                                                    />
                                                </svg>
                                                Respuestas
                                            </button>
                                        </Link>
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

export function TablaComidas({ comidas, onToggleMostrar, onEliminar }: { 
    comidas: Comidas2Props[]; 
    onToggleMostrar?: (id: string, nuevoEstado: boolean) => void;
    onEliminar?: (id: string) => void;
}) {
    const [localComidas, setLocalComidas] = useState(comidas);

    // Sincronizar el estado local cuando cambie el prop
    useEffect(() => {
        setLocalComidas(comidas);
    }, [comidas]);
    
    const handleToggleMostrar = async (id: string, estadoActual: boolean) => {
        const nuevoEstado = !estadoActual;
        
        // Actualizar el estado local inmediatamente para reflejar el cambio en la UI
        setLocalComidas(prev => 
            prev.map(comida => 
                comida.id === id 
                    ? { ...comida, mostrar: nuevoEstado }
                    : comida
            )
        );

        // Llamar callback para actualizar el estado padre
        if (onToggleMostrar) {
            onToggleMostrar(id, nuevoEstado);
        }
        
        // TODO: Implementar llamada al backend cuando esté disponible
        // try {
        //   const response = await fetch(`/api/comidas/${id}/toggle`, {
        //     method: 'PATCH',
        //     headers: {
        //       'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //       mostrar: nuevoEstado
        //     })
        //   });
        //   
        //   if (!response.ok) {
        //     throw new Error('Error al actualizar la visibilidad');
        //   }
        //   
        //   console.log('Visibilidad actualizada exitosamente');
        // } catch (error) {
        //   console.error('Error:', error);
        //   // Revertir el cambio local en caso de error
        //   setLocalComidas(prev => 
        //     prev.map(comida => 
        //       comida.id === id 
        //         ? { ...comida, mostrar: estadoActual }
        //         : comida
        //     )
        //   );
        //   if (onToggleMostrar) {
        //     onToggleMostrar(id, estadoActual);
        //   }
        // }
    };

    const handleEliminar = async (id: string) => {
        // Actualizar el estado local inmediatamente removiendo el elemento
        setLocalComidas(prev => prev.filter(comida => comida.id !== id));

        if (onEliminar) {
            onEliminar(id);
        }
        
        // TODO: Implementar llamada al backend cuando esté disponible
        // try {
        //   const response = await fetch(`/api/comidas/${id}`, {
        //     method: 'DELETE',
        //   });
        //   
        //   if (!response.ok) {
        //     throw new Error('Error al eliminar la comida');
        //   }
        //   
        //   console.log('Comida eliminada exitosamente');
        // } catch (error) {
        //   console.error('Error:', error);
        //   // Revertir el cambio local en caso de error
        //   setLocalComidas(comidas);
        // }
    };

    return (
        <div className="flex-1 overflow-y-auto min-h-0 mb-6">
            <div className="bg-beige1 rounded-lg shadow-sm border border-borde1 mt-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-tabla-header text-center text-black text-sm font-bold tracking-wider">
                            <tr>
                                <th className='px-12 py-3 text-start'>Comida</th>
                                <th className='px-4 py-3'>Visibilidad</th>
                                <th className='px-4 py-3'>Eliminar</th>
                            </tr>
                        </thead>
                        <tbody className="bg-beige1 divide-y divide-borde1">
                            {localComidas.map((comida) => (
                                <tr key={comida.id} className='bg-tabla-row text-center hover:bg-tabla-header'>
                                    <td className="px-12 py-4 text-sm font-medium text-start text-black">{comida.nombreComida}</td>
                                    
                                    <td className="px-6 py-4 whitespace-nowrap text-sm flex justify-center items-center">
                                        {comida.mostrar ? (
                                            <button 
                                                onClick={() => handleToggleMostrar(comida.id, comida.mostrar)}
                                                className="flex bg-verdetrans font-bold items-center rounded-lg justify-center px-3 py-1 gap-2 text-verde3 hover:text-verde2 hover:[&>svg]:text-verde2 hover:cursor-pointer"
                                            >
                                                <svg
                                                    className="w-5 h-5 text-verde3"
                                                    aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width={24}
                                                    height={24}
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        stroke="currentColor"
                                                        strokeWidth={2}
                                                        d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"
                                                    />
                                                    <path
                                                        stroke="currentColor"
                                                        strokeWidth={2}
                                                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                                    />
                                                </svg>
                                                Visible
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => handleToggleMostrar(comida.id, comida.mostrar)}
                                                className="flex bg-gristrans font-bold items-center rounded-lg justify-center px-3 py-1 gap-2 text-gris1 hover:text-rojo1 hover:[&>svg]:text-rojo1 hover:cursor-pointer"
                                            >
                                                <svg
                                                    className="w-5 h-5 text-rojovino"
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
                                                        d="M3.933 13.909A4.357 4.357 0 0 1 3 12c0-1 4-6 9-6m7.6 3.8A5.068 5.068 0 0 1 21 12c0 1-3 6-9 6-.314 0-.62-.014-.918-.04M5 19 19 5m-4 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                                    />
                                                </svg>
                                                Oculto
                                            </button>
                                        )}
                                    </td>
                                    
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <div className="flex justify-center">
                                            <button 
                                                onClick={() => handleEliminar(comida.id)}
                                                className="flex bg-rojotrans font-bold items-center rounded-lg justify-center px-3 py-1 gap-2 text-rojovino hover:text-rojo1 hover:[&>svg]:text-rojo1 hover:cursor-pointer"
                                                title="Eliminar comida"
                                            >
                                                <svg
                                                    className="w-5 h-5 text-rojovino"
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
                                                        d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2V7Z"
                                                    />
                                                </svg>
                                                Eliminar
                                            </button>
                                        </div>
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

export function TablaConsultas({ consultas, onMarcarResuelta }: { 
    consultas: ConsultaProps[]; 
    onMarcarResuelta?: (id: string) => void;
}) {
    const [localConsultas, setLocalConsultas] = useState(consultas);

    // Sincronizar el estado local cuando cambie el prop
    useEffect(() => {
        setLocalConsultas(consultas);
    }, [consultas]);
    
    const handleMarcarResuelta = async (id: string) => {
        // Actualizar el estado local inmediatamente removiendo el elemento
        setLocalConsultas(prev => prev.filter(consulta => consulta.id !== id));

        if (onMarcarResuelta) {
            onMarcarResuelta(id);
        }
        
        // TODO: Implementar llamada al backend cuando esté disponible
        // try {
        //   const response = await fetch(`/api/consultas/${id}/resolver`, {
        //     method: 'PATCH',
        //     headers: {
        //       'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //       estado: 'resuelta'
        //     })
        //   });
        //   
        //   if (!response.ok) {
        //     throw new Error('Error al marcar consulta como resuelta');
        //   }
        //   
        //   console.log('Consulta marcada como resuelta exitosamente');
        // } catch (error) {
        //   console.error('Error:', error);
        //   // Revertir el cambio local en caso de error
        //   setLocalConsultas(consultas);
        // }
    };

    const abrirWhatsApp = (telefono: string, consulta: string) => {
        const mensaje = `Hola, nos contactamos desde Cerro Dragón Tours para atender su consulta: "${consulta}"`;
        const url = `https://wa.me/506${telefono.replace(/\D/g, '')}?text=${encodeURIComponent(mensaje)}`;
        window.open(url, '_blank');
    };

    // Filtrar solo consultas pendientes
    const consultasPendientes = localConsultas.filter(consulta => consulta.estado === 'pendiente');

    if (consultasPendientes.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                    <svg 
                        className="w-16 h-16 text-verde3 mx-auto mb-4" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" 
                        />
                    </svg>
                    <h3 className="text-lg font-medium text-black mb-2">¡Todas las consultas están atendidas!</h3>
                    <p className="text-verde3">No hay consultas pendientes por revisar.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto min-h-0 mb-6">
            <div className="bg-beige1 rounded-lg shadow-sm border border-borde1 mt-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-tabla-header text-center text-black text-sm font-bold tracking-wider">
                            <tr>
                                <th className='px-4 py-3'>Cliente</th>
                                <th className='px-4 py-3'>Teléfono</th>
                                <th className='px-6 py-3'>Consulta</th>
                                <th className='px-3 py-3'>Fecha</th>
                                <th className='px-4 py-3'>Contactar WhatsApp</th>
                                <th className='px-4 py-3'>Marcar como Resuelta</th>
                            </tr>
                        </thead>
                        <tbody className="bg-beige1 divide-y divide-borde1">
                            {consultasPendientes.map((consulta) => (
                                <tr key={consulta.id} className='bg-tabla-row text-center hover:bg-tabla-header'>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-verde1">{consulta.clienteNombre}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-black font-medium">{consulta.telefono}</td>
                                    <td className="px-6 py-4 text-sm text-black max-w-xs">
                                        <div className="truncate" title={consulta.consulta}>
                                            {consulta.consulta}
                                        </div>
                                    </td>
                                    <td className="px-3 py-4 whitespace-nowrap text-sm text-black">{consulta.fecha}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                                        <div className="flex justify-center">
                                            <button 
                                                onClick={() => abrirWhatsApp(consulta.telefono, consulta.consulta)}
                                                className="flex bg-verdetrans font-bold items-center rounded-lg justify-center px-3 py-1 gap-2 text-verde3 hover:text-verde2 hover:[&>svg]:text-verde2 hover:cursor-pointer"
                                            >
                                                <svg
                                                    className="w-5 h-5 text-verde3"
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
                                                        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884h-.004Z"/>
                                                </svg>
                                                WhatsApp
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                                        <div className="flex justify-center">
                                            <button 
                                                onClick={() => handleMarcarResuelta(consulta.id)}
                                                className="flex bg-azultrans font-bold items-center rounded-lg justify-center px-3 py-1 gap-2 text-azul1 hover:text-azul2 hover:[&>svg]:text-azul2 hover:cursor-pointer"
                                            >
                                                <svg
                                                    className="w-5 h-5 text-azul1"
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
                                                        d="M5 11.917 9.724 16.5 19 7.5"
                                                    />
                                                </svg>
                                                Resuelta
                                            </button>
                                        </div>
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

export function TablaGestionReservas({ reservas, guias }: { reservas: GestionReservaProps[] ; guias: GuiaProps[] }) {
    const [localReservas, setLocalReservas] = useState(reservas);

    // Sincronizar el estado local cuando cambie el prop
    useEffect(() => {
        setLocalReservas(reservas);
    }, [reservas]);

    const handleGuiaChange = async (reservaId: string, nuevoGuia: string) => {
        // Guardar estado anterior por si hay que revertir
        const prevReservas = [...localReservas];
        
        // Actualizar el estado local inmediatamente para reflejar el cambio en la UI
        setLocalReservas(prev => 
            prev.map(reserva => 
                reserva.id === reservaId 
                    ? { ...reserva, guiaAsignado: nuevoGuia }
                    : reserva
            )
        );

        try {
            const token = localStorage.getItem('access_token');
            // Extraer el ID numérico de la reserva (RV-123 -> 123)
            const numericReservationId = reservaId.replace('RV-', '');
            
            // Encontrar el guía seleccionado para obtener su ID
            const guiaSeleccionado = guias.find(g => g.nombre === nuevoGuia);
            
            if (!guiaSeleccionado && nuevoGuia) {
                console.error('Guía no encontrado');
                return;
            }
            
            if (guiaSeleccionado) {
                // Extraer el ID numérico del guía (G-xxx -> xxx)
                const guideId = guiaSeleccionado.id.replace('G-', '');
                
                const response = await fetch(`http://localhost:3000/assign-guide/${numericReservationId}/${guideId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Error al asignar guía');
                }
                
                console.log('Guía asignado exitosamente');
            }
        } catch (error) {
            console.error('Error:', error);
            // Revertir el cambio local en caso de error
            setLocalReservas(prevReservas);
        }
    };

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
                                <th className='px-8 py-3'>Guia Asignado</th>
                                <th className='px-2 py-3'>Estado</th>
                                <th className='px-2 py-3'></th>
                            </tr>
                        </thead>
                        <tbody className="bg-beige1 divide-y divide-borde1">
                            {localReservas.map((reserva) => (
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
                                    <td className="px-8 py-4 whitespace-nowrap text-sm flex justify-center items-center">
                                        <select
                                            id={`guiaAsignado-${reserva.id}`}
                                            value={reserva.guiaAsignado || ""}
                                            onChange={(e) => handleGuiaChange(reserva.id, e.target.value)}
                                            className="block w-60 px-3 py-2.5 bg-beigeclaro placeholder:opacity-50 border border-verde3 text-verde1 text-sm rounded-lg focus:ring-verde3 focus:border-verde3 shadow-sm placeholder:text-verde3"
                                        >
                                            <option value="">
                                                Seleccione guía...
                                            </option>
                                            {guias.map((guia) => (
                                                <option key={guia.id} value={guia.nombre}>
                                                    {guia.nombre}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{getEstadoBadge(reserva.estado)}</td>
                                    <td className="px-2 py-4 whitespace-nowrap text-sm">
                                        <Link href={`/admin/reservas/editar?id=${reserva.id}`}>
                                            <svg
                                                className="w-6 h-6 text-verde1 dark:text-verde1"
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                width={24}
                                                height={24}
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M14 4.182A4.136 4.136 0 0 1 16.9 3c1.087 0 2.13.425 2.899 1.182A4.01 4.01 0 0 1 21 7.037c0 1.068-.43 2.092-1.194 2.849L18.5 11.214l-5.8-5.71 1.287-1.31.012-.012Zm-2.717 2.763L6.186 12.13l2.175 2.141 5.063-5.218-2.141-2.108Zm-6.25 6.886-1.98 5.849a.992.992 0 0 0 .245 1.026 1.03 1.03 0 0 0 1.043.242L10.282 19l-5.25-5.168Zm6.954 4.01 5.096-5.186-2.218-2.183-5.063 5.218 2.185 2.15Z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </Link>
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

export function TablaCupones({ cupones, onEliminar }: {
    cupones: CuponProps[];
    onEliminar?: (id: string) => void;
}) {
    const [localCupones, setLocalCupones] = useState(cupones);

    // Sincronizar el estado local cuando cambie el prop
    useEffect(() => {
        setLocalCupones(cupones);
    }, [cupones]);

    const handleEliminar = async (id: string) => {
        // Actualizar el estado local inmediatamente removiendo el elemento
        setLocalCupones(prev => prev.filter(cupon => cupon.id !== id));

        if (onEliminar) {
            onEliminar(id);
        }
        
        // TODO: Implementar llamada al backend cuando esté disponible
        // try {
        //   const response = await fetch(`/api/cupones/${id}`, {
        //     method: 'DELETE',
        //   });
        //   
        //   if (!response.ok) {
        //     throw new Error('Error al eliminar el cupón');
        //   }
        //   
        //   console.log('Cupón eliminado exitosamente');
        // } catch (error) {
        //   console.error('Error:', error);
        //   // Revertir el cambio local en caso de error
        //   setLocalCupones(cupones);
        // }
        console.log(`Eliminando cupón ${id}`);
    };

    return (
        <div className="flex-1 overflow-y-auto min-h-0">
            <div className="bg-beige1 rounded-lg shadow-sm border border-borde1 mt-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-tabla-header text-center text-black text-sm font-bold tracking-wider">
                            <tr>
                                <th className='px-2 py-3'>ID</th>
                                <th className='px-2 py-3'>Código Asociado</th>
                                <th className='px-4 py-3'>Descuento</th>
                                <th className='px-2 py-3'>Canjeados</th>
                                <th className='px-1 py-3'>Límite de canje</th>
                                <th className='px-1 py-3'>Fecha de creación</th>
                                <th className='px-2 py-3'>Eliminar</th>
                            </tr>
                        </thead>
                        <tbody className="bg-beige1 divide-y divide-borde1">
                            {localCupones.map((cupon) => (
                                <tr key={cupon.id} className='bg-tabla-row text-center hover:bg-tabla-header'>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-black">{cupon.id}</td>
                                    <td className="px-4 py-4 text-sm text-black">{cupon.codigoAsociado}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black font-bold">{cupon.descuento}%</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-lg text-rojosuave font-bold">{cupon.canjeados}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-verde4">{cupon.limite}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-black">{cupon.fechaCreacion}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <div className="flex justify-center">
                                            <button 
                                                onClick={() => handleEliminar(cupon.id)}
                                                className="flex bg-rojotrans font-bold items-center rounded-lg justify-center px-3 py-1 gap-2 text-rojovino hover:text-rojo1 hover:[&>svg]:text-rojo1 hover:cursor-pointer"
                                                title="Eliminar cupón"
                                            >
                                                <svg
                                                    className="w-5 h-5 text-rojovino"
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
                                                        d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2V7Z"
                                                    />
                                                </svg>
                                                Eliminar
                                            </button>
                                        </div>
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

export function TablaMisAlojamientos({
  reservas,
  onDescargarComprobante,
  onReembolso,
}: Props) {
  const getEstadoBadge = (estado: AlojamientoProps["estado"]) => {
    switch (estado) {
      case "confirmada":
        return (
          <span className="inline-flex items-center px-3 py-1 text-verde3 text-sm font-bold rounded bg-verdetrans">
            Confirmada
          </span>
        );
      case "pendiente":
        return (
          <span className="inline-flex items-center px-3 py-1 text-amarillo text-sm font-bold rounded bg-amarillotrans">
            Pendiente
          </span>
        );
      case "cancelada":
        return (
          <span className="inline-flex items-center px-3 py-1 text-rojovino text-sm font-bold rounded bg-rojotrans">
            Cancelada
          </span>
        );
      case "reembolsada":
        return (
          <span className="inline-flex items-center px-3 py-1 text-azul1 text-sm font-bold rounded bg-azultrans">
            Reembolsada
          </span>
        );
      case "solicitado":
        return (
            <span className="inline-flex items-center px-3 py-1 text-orange-700 text-sm font-bold rounded bg-orange-100">
            Reembolso solicitado
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
                <th className="px-1 py-3">ID</th>
                {/* <th className="px-2 py-3">Cliente</th> */}
                <th className="px-1 py-3">Personas</th>
                <th className="px-1 py-3">Fecha de Reserva</th>
                <th className="px-1 py-3">Fecha de Llegada</th>
                <th className="px-1 py-3">Fecha Final</th>
                <th className="px-2 py-3">Cabaña</th>
                <th className="px-1 py-3">Estado</th>
                <th className="px-1 py-3">Solicitar reembolso</th>
                <th className="px-2 py-3">Comprobante</th>
              </tr>
            </thead>

            <tbody className="bg-beige1 divide-y divide-borde1">
              {reservas.map((reserva) => (
                <tr
                  key={reserva.id}
                  className="bg-tabla-row text-center hover:bg-tabla-header"
                >
                  <td className="px-4 py-4 font-medium text-black">
                    {reserva.id}
                  </td>

                  {/* <td className="px-4 py-4">
                    <div className="text-sm font-bold text-verde1">
                      {reserva.clienteNombre}
                    </div>
                    <div className="text-sm text-verde3">
                      {reserva.clienteEmail}
                    </div>
                  </td> */}

                  <td className="px-6 py-4 text-lg text-rojosuave font-bold">
                    {reserva.personas}
                  </td>

                  <td className="px-6 py-4 text-black">{reserva.fechaReserva}</td>
                  <td className="px-6 py-4 text-black">{reserva.fechaLlegada}</td>
                  <td className="px-6 py-4 text-black">{reserva.fechaFinal}</td>
                  <td className="px-6 py-4 text-black">{reserva.cabana}</td>

                  <td className="px-6 py-4">
                    {getEstadoBadge(reserva.estado)}
                  </td>

                  <td className="px-6 py-4">
                    {reserva.estado === "confirmada" ? (
                        <button
                        onClick={() => onReembolso(reserva)}
                        className="text-rojovino bg-rojotrans font-bold rounded-md px-3 py-1 hover:text-rojo1 hover:cursor-pointer"
                        >
                        Solicitar
                        </button>
                    ) : reserva.estado === "solicitado" ? (
                        <span className="inline-block text-orange-700 bg-orange-100 font-bold rounded-md px-3 py-1">
                        Solicitado
                        </span>
                    ) : (
                        <span className="inline-block text-gray-400 bg-gray-200 font-bold rounded-md px-3 py-1 cursor-not-allowed">
                        No disponible
                        </span>
                    )}
                    </td>

                  {/* 🔥 AQUÍ ESTABA EL PROBLEMA */}
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => onDescargarComprobante(reserva)}
                      className="text-verde3 font-bold hover:underline"
                    >
                      Descargar
                    </button>
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

export function TablaAlojamientosAdmin({ reservas }: { reservas: AlojamientoProps[] }) {
    const getEstadoBadge = (estado: AlojamientoProps["estado"]) => {
        switch (estado) {
            case "confirmada":
            return (
                <span className="inline-flex items-center px-3 py-1 text-verde3 text-sm font-bold rounded bg-verdetrans">
                Confirmada
                </span>
            );

            case "pendiente":
            return (
                <span className="inline-flex items-center px-3 py-1 text-amarillo text-sm font-bold rounded bg-amarillotrans">
                Pendiente
                </span>
            );

            case "cancelada":
            return (
                <span className="inline-flex items-center px-3 py-1 text-rojovino text-sm font-bold rounded bg-rojotrans">
                Cancelada
                </span>
            );

            case "reembolsada":
            return (
                <span className="inline-flex items-center px-3 py-1 text-azul1 text-sm font-bold rounded bg-azultrans">
                Reembolsada
                </span>
            );

            case "solicitado":
            return (
                <span className="inline-flex items-center px-3 py-1 text-orange-700 text-sm font-bold rounded bg-orange-100">
                Reembolso solicitado
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
                                <th className='px-1 py-3'>ID</th>
                                <th className='px-2 py-3'>Cliente</th>
                                <th className='px-1 py-3'>Personas</th>
                                <th className='px-1 py-3'>Fecha de Reserva</th>
                                <th className='px-1 py-3'>Fecha de Llegada</th>
                                <th className='px-1 py-3'>Fecha Final</th>
                                <th className='px-2 py-3'>Cabaña</th>
                                <th className='px-1 py-3'>Estado</th>
                                <th className='px-1 py-3'></th>

                            </tr>
                        </thead>
                        <tbody className="bg-beige1 divide-y divide-borde1">
                            {reservas.map((reserva) => (
                                <tr key={reserva.id} className='bg-tabla-row text-center hover:bg-tabla-header'>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-black">{reserva.id}</td>
                                    <td className="px-2 py-4 whitespace-nowrap">
                                        <div className="text-sm font-bold text-verde1">{reserva.clienteNombre}</div>
                                        <div className="text-sm text-verde3">{reserva.clienteEmail}</div>
                                    </td>
                                    <td className="px-2 py-4 whitespace-nowrap text-lg text-rojosuave font-bold">{reserva.personas}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-black">{reserva.fechaReserva}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-black">{reserva.fechaLlegada}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-black">{reserva.fechaFinal}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-black">{reserva.cabana}</td>
                                    <td className="px-2 py-4 whitespace-nowrap">{getEstadoBadge(reserva.estado)}</td>
                                    <td className="px-1 py-4 whitespace-nowrap text-sm flex  justify-center items-center">
                                        <Link href={`/admin/alojamientos/editar?id=${reserva.id}`}>
                                            <button className="text-verde1 font-bold hover:text-rojo1 flex items-center justify-center px-1 py-1 hover:[&>svg]:text-rojo1 hover:cursor-pointer">
                                                <svg
                                                    className="w-6 h-6 text-verde1 dark:text-verde1"
                                                    aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width={24}
                                                    height={24}
                                                    fill="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M14 4.182A4.136 4.136 0 0 1 16.9 3c1.087 0 2.13.425 2.899 1.182A4.01 4.01 0 0 1 21 7.037c0 1.068-.43 2.092-1.194 2.849L18.5 11.214l-5.8-5.71 1.287-1.31.012-.012Zm-2.717 2.763L6.186 12.13l2.175 2.141 5.063-5.218-2.141-2.108Zm-6.25 6.886-1.98 5.849a.992.992 0 0 0 .245 1.026 1.03 1.03 0 0 0 1.043.242L10.282 19l-5.25-5.168Zm6.954 4.01 5.096-5.186-2.218-2.183-5.063 5.218 2.185 2.15Z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </Link>
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

/*============================== Image Upload Component ==============================*/

export function ImageUpload({
    imagen,
    onImageChange,
    disabled = false,
    label = "Imagen",
    height = "h-64",
    placeholder = "Haga clic para subir imagen",
    accept = "image/*"
}: ImageUploadProps) {
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onImageChange(e.target.files[0]);
        }
    };

    const handleRemoveImage = () => {
        onImageChange(null);
    };

    return (
        <div>
            <label className="block mb-2.5 text-md font-medium text-black">
                {label}
            </label>
            <div className={`border-2 border-dashed border-borde1 rounded-xl ${height} flex items-center justify-center bg-tabla-header`}>
                {imagen ? (
                    <div className="text-center">
                        <Image 
                            src={URL.createObjectURL(imagen)} 
                            alt="Preview" 
                            className="max-h-56 mx-auto rounded-lg"
                            width={224}
                            height={224}
                            unoptimized
                        />
                        <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="mt-2 text-sm text-red-500 hover:text-red-700"
                            disabled={disabled}
                        >
                            Eliminar imagen
                        </button>
                    </div>
                ) : (
                    <label htmlFor="imagen-upload" className={disabled ? "cursor-not-allowed" : "cursor-pointer"}>
                        <div className="text-center text-verde2">
                            <svg 
                                className="w-16 h-16 mx-auto mb-2 text-verde2"
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
                            <p className="text-sm">{placeholder}</p>
                        </div>
                        <input
                            id="imagen-upload"
                            type="file"
                            accept={accept}
                            onChange={handleImageChange}
                            className="hidden"
                            disabled={disabled}
                        />
                    </label>
                )}
            </div>
        </div>
    );
}
