import { Inter } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

/* ======================== Interfaces ==========================*/

interface CardTourProps {
    nombre: string;
    descripcion: string;
    precio: number;
    capacidad: number;
    duracion: string;
    etiqueta: string;
    imagen?: string;
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
                href="/client/reservas"
                className="flex items-center px-2 py-1.5 text-white rounded-base group"
                >
                <div className="w-5 h-5 mr-3"></div>
                <span>Mis Reservas</span>
                </a>
            </li>
            <li>
                <a
                href="/client/tours"
                className="flex items-center px-2 py-1.5 text-white rounded-base group"
                >
                <div className="w-5 h-5 mr-3"></div>
                <span className="flex-1 whitespace-nowrap">Tours</span>
                </a>
            </li>
            <li>
                <a
                href="/client/consultas"
                className="flex items-center px-2 py-1.5 text-white rounded-base group"
                >
                <div className="w-5 h-5 mr-3"></div>
                <span className="flex-1 whitespace-nowrap">Consultas</span>
                </a>
            </li>
            <li>
                <a
                href="/client/calendario"
                className="flex items-center px-2 py-1.5 text-white rounded-base group"
                >
                <div className="w-5 h-5 mr-3"></div>
                <span className="flex-1 whitespace-nowrap">Calendario</span>
                </a>
            </li>
            <li>
                <a
                href="/client/guias"
                className="flex items-center px-2 py-1.5 text-white rounded-base group"
                >
                <div className="w-5 h-5 mr-3"></div>
                <span className="flex-1 whitespace-nowrap">Nuestros Guías</span>
                </a>
            </li>
            <li>
                <a
                href="/client/promociones"
                className="flex items-center px-2 py-1.5 text-white rounded-base group"
                >
                <div className="w-5 h-5 mr-3"></div>
                <span className="flex-1 whitespace-nowrap">Promociones</span>
                </a>
            </li>
            <li>
                <a
                href="#"
                className="flex items-center px-2 py-1.5 text-white rounded-base group"
                >
                <div className="w-5 h-5 mr-3"></div>
                <span className="flex-1 whitespace-nowrap">Reembolsos</span>
                </a>
            </li>
            <li>
                <a
                href="#"
                className="flex items-center px-2 py-1.5 text-white rounded-base group"
                >
                <div className="w-5 h-5 mr-3"></div>
                <span className="flex-1 whitespace-nowrap">Puntos de encuentro</span>
                </a>
            </li>
            <li>
                <a
                href="#"
                className="flex items-center px-2 py-1.5 text-white rounded-base group"
                >
                <div className="w-5 h-5 mr-3"></div>
                <span className="flex-1 whitespace-nowrap">Alojamientos</span>
                </a>
            </li>
            <li>
                <a
                href="#"
                className="flex items-center px-2 py-1.5 text-white rounded-base group"
                >
                <div className="w-5 h-5 mr-3"></div>
                <span className="flex-1 whitespace-nowrap">Testimonios</span>
                </a>
            </li>
            <li>
                <a
                href="#"
                className="flex items-center px-2 py-1.5 text-white rounded-base group"
                >
                <div className="w-5 h-5 mr-3"></div>
                <span className="flex-1 whitespace-nowrap">Incidencias/Clima</span>
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

export function CardTour({nombre, descripcion, precio, capacidad, duracion, etiqueta, imagen}: CardTourProps) {
    return (
    <div className="bg-beige1 block w-[350px] h-92 border border-default border-borde1 rounded-xl cardTour relative flex flex-col">
        <a href="#" className="block overflow-hidden relative">
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

