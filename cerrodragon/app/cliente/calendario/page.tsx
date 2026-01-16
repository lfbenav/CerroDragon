"use client";
import { CalendarGrid, SideBarClient, TopBar } from "@/app/components";

// Datos de ejemplo para la ocupación del calendario esto con la Api hay que importarlo
const ocupacionData = {
  1: 'no-disponible',
  4: 'muy-ocupado',
  10: 'muy-ocupado',
  13: 'medio-ocupado',
  14: 'medio-ocupado',
  15: 'poco-ocupado',
  22: 'poco-ocupado',
  31: 'muy-ocupado'
} as const;

// Configuración del calendario esto hay que importarlo con la Api
const calendarConfig = {
  mes: "ENERO",
  año: 2026,
  daysInMonth: 31,
  firstDayOfWeek: 4 // 0=Domingo, 1=Lunes ...
};

export default function Calendario() {
  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <SideBarClient />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 flex flex-col pt-20 px-8 min-h-0">
          <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
            <div className="flex-shrink-0 mb-8">
              <h1 className="text-3xl font-bold mb-1 text-black mt-4">Calendario</h1>
              <p className="mb-4 text-verde3">
                Consulte qué tan saturadas se encuentran nuestras fechas este mes
              </p>
            </div>
            
            <div className="flex-1 flex justify-center items-start overflow-y-auto">
              <CalendarGrid 
                ocupacionData={ocupacionData}
                mes={calendarConfig.mes}
                año={calendarConfig.año}
                daysInMonth={calendarConfig.daysInMonth}
                firstDayOfWeek={calendarConfig.firstDayOfWeek}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
