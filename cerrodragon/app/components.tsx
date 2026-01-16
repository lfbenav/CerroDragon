import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

export function SearchBar({texto}: SearchBarProps) {
    return (
        <div className="bg-beige1 p-4 rounded-lg shadow-sm border border-borde1 mb-6">
            <form className="w-full">
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
                        className="block w-full py-2 px-3 ps-9 bg-beige2 border border-borde2 text-verde3 placeholder-verde3 text-sm rounded-md focus:ring-verde2 focus:border-verde2"
                        placeholder={texto}
                    />
                </div>
            </form>
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