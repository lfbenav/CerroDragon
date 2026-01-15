"use client";
import Image from "next/image";
import { SideBarAdmin, SideBarClient, TopBar, HomeBar, CardTour } from "./components";
import { useState } from "react";
import Link from "next/link";


export default function Home() {
  return (
    <div className="">
      <HomeBar />
      <div className="relative h-screen w-full">
        <Image
          src="/imagen.png"
          alt="Cerro Dragon"
          fill
          className="object-cover"
          priority
        />

        {/*Encima de la imagen */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white z-10">
          <h1 className="text-6xl font-bold font-serif text-center mb-8 max-w-5xl">
            Descubre la Magia de <span className="text-amarillo">Cerro Dragón</span>
          </h1>
          <p className="text-xl text-white font-thin font-serif mb-8 text-center max-w-2xl ">
            Vive la experiencia. Tours guiados, cabañas acogedoras y paisajes imponentes
          </p>
          <div className="flex gap-4">
            <button className="inline-flex items-center bg-amarillo text-black hover:bg-yellow-700 px-8 py-3 rounded-lg font-semibold transition-colors">
              Ver Tours
              <svg
                className="w-4 h-4 ml-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                    >
                <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </button>
            <button className="border-2 border-white hover:bg-white hover:text-black px-8 py-3 rounded-lg font-semibold transition-colors">
              Ver Cabañas
            </button>
          </div>
        </div>
        
        {/*Scroll icono */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <svg
            className="w-6 h-6 text-white animate-bounce cursor-pointer"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
        
        <div className="absolute inset-0 bg-black opacity-30"></div>
      </div>

      {/* Lo blanco */}
      <div className="min-h-screen bg-white p-8 mt-32">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <span className=" bg-verdeinvisible text-verde2 text-sm font-bold font-sans px-4 py-1 rounded-full">
            Nuevos Tours
          </span>
          <h2 className="text-3xl font-semibold text-gray-800 mb-6 mt-4 text-center font-serif">
            Experiencias inolvidables
          </h2>
          <p className="text-verde3 text-center font-normal font-sans text-md">
            Descubre la belleza local en Cerro Dragón con nuestros guías expertos. ¡Reserva con nosotros!  
          </p>
          <div className="mt-6 flex justify-center gap-8 overflow-x-auto pb-4 pt-4">
            <CardTour 
            nombre="Tour al Amanecer" 
            descripcion="Disfruta de un espectacular amanecer en Cerro Dragón con nuestro tour guiado." 
            precio={85} 
            imagen="/tour1.png" 
            capacidad={10} 
            duracion="3 horas" 
            etiqueta="Todos" 
            />
            <CardTour 
            nombre="Aventura Nocturna" 
            descripcion="Explora los senderos misteriosos del Cerro bajo la luz de las estrellas." 
            precio={120} 
            imagen="/tour2.png" 
            capacidad={8} 
            duracion="5 horas" 
            etiqueta="Moderado" 
            />
            <CardTour 
            nombre="Expedición Extrema" 
            descripcion="Desafía tus límites con esta expedición completa a las cumbres más altas." 
            precio={250} 
            imagen="/tour3.png" 
            capacidad={6} 
            duracion="1 día" 
            etiqueta="Experto" 
            />
          </div>
          <button className="inline-flex items-center mt-6 bg-verde3 text-white px-6 py-3 rounded-lg font-normal hover:bg-verde1 transition-colors">
            Ver Todos los Tours
            <svg
              className="w-4 h-4 ml-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
                  >
              <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </button>
        </div>
      </div>

      {/**Pie de pagina */}
      <footer className="bg-verde2 text-white py-6">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-6 justify-between px-4">
          <div className="w-full md:w-1/4 mb-4 mr-8">
            <h3 className="text-lg font-semibold w-full mb-4">Cerro Dragón</h3>
            <p className="text-sm">
              Conecta con la naturaleza y la cultura de La Legua de los Naranjos a través de experiencias de turismo rural y senderismo auténticas. ¡Descubre y vive la belleza de Cerro Dragón con nosotros!
            </p>
          </div>
          <div className="w-full md:w-1/4 mb-4">
            <h3 className="text-lg font-semibold w-full mb-4">Legal</h3>
            <Link href="#" className="block mb-2 text-sm hover:underline">Políticas</Link>
            <Link href="#" className="block mb-2 text-sm hover:underline">Términos y Condiciones</Link>
          </div>
          <div className="w-full md:w-1/4 mb-4">
            <h3 className="text-lg font-semibold w-full mb-4">Contactenos</h3>
            <Link href="#" className="flex items-center mb-2 text-sm hover:underline">
              <svg 
                className="w-4 h-4 mr-2" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
              </svg>
              WhatsApp
            </Link>
            <Link href="#" className="flex items-center mb-2 text-sm hover:underline">
              <svg 
                className="w-4 h-4 mr-2" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </Link>
            <Link href="#" className="flex items-center mb-2 text-sm hover:underline">
              <svg 
                className="w-4 h-4 mr-2" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Instagram
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
