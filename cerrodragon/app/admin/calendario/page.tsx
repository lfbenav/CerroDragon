"use client";
import { AdminCalendarGrid, SideBarAdmin, TopBar } from "@/app/components";

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

// Definir tipo para los valores de ocupación
type OcupacionType = 'no-disponible' | 'muy-ocupado' | 'medio-ocupado' | 'poco-ocupado' | 'desocupado';

// Configuración del calendario esto hay que importarlo con la Api
const calendarConfig = {
  mes: "ENERO",
  año: 2026,
  daysInMonth: 31,
  firstDayOfWeek: 4 // 0=Domingo, 1=Lunes ...
};

export default function AdminCalendario() {
  
  // Función preparada para enviar actualizaciones al backend
  const handleDayUpdate = async (day: number, newOcupacion: OcupacionType) => {
    console.log(`Día ${day} actualizado a: ${newOcupacion}`);
    
    // TODO: Implementar llamada al backend cuando esté disponible
    // try {
    //   const response = await fetch('/api/calendario/actualizar', {
    //     method: 'PUT',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       día: day,
    //       ocupacion: newOcupacion,
    //       mes: getMesNumber(calendarConfig.mes),
    //       año: calendarConfig.año
    //     })
    //   });
    //   
    //   if (!response.ok) {
    //     throw new Error('Error al actualizar el calendario');
    //   }
    //   
    //   console.log('Calendario actualizado exitosamente');
    // } catch (error) {
    //   console.error('Error:', error);
    // }
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <SideBarAdmin />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 flex flex-col pt-20 px-8 min-h-0">
          <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
            <div className="flex-shrink-0 mb-8">
              <h1 className="text-3xl font-bold mb-1 text-black mt-4">Calendario de Disponibilidad</h1>
              <p className="mb-4 text-verde3">
                Haga clic en cada día para configurar su disponibilidad
              </p>
            </div>
            
            <div className="flex-1 flex justify-center items-start overflow-y-auto">
              <AdminCalendarGrid 
                ocupacionData={ocupacionData}
                mes={calendarConfig.mes}
                año={calendarConfig.año}
                daysInMonth={calendarConfig.daysInMonth}
                firstDayOfWeek={calendarConfig.firstDayOfWeek}
                onDayUpdate={handleDayUpdate}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
