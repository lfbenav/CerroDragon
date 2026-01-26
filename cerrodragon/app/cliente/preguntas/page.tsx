"use client";

import { useEffect, useState } from "react";
import { SideBarClient, TopBar, CardFAQ } from "../../components";

const API_URL = "http://localhost:3000";

/* =====================
   TYPES
===================== */

interface FAQAPI {
  id: string;
  question: string;
  answer: string;
}

interface FAQ {
  id: string;
  pregunta: string;
  respuesta: string;
}

/* =====================
   PAGE
===================== */

export default function PreguntasFrecuentes() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =====================
     FETCH FAQS
  ===================== */
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${API_URL}/others/faqs`);

        if (!res.ok) {
          throw new Error("Error al cargar FAQs");
        }

        const json = await res.json();

        const mapped: FAQ[] = json.data.map(
          (f: FAQAPI): FAQ => ({
            id: f.id,
            pregunta: f.question,
            respuesta: f.answer,
          })
        );

        setFaqs(mapped);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar las preguntas frecuentes");
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  /* =====================
     RENDER
  ===================== */

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <SideBarClient />

      <div className="flex-1 flex flex-col">
        <TopBar />

        <main className="flex-1 flex flex-col ml-72 pt-20 px-8 min-h-0">
          <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
            {/* Header */}
            <div className="flex-shrink-0">
              <h1 className="text-3xl font-bold mb-1 text-black mt-4">
                Preguntas Frecuentes
              </h1>
              <p className="text-verde3 mb-4 text-lg">
                Preguntas interesantes que nos han hecho nuestros clientes
              </p>
              <div className="border-b border-black/20" />
            </div>

            {/* Cards */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {loading ? (
                <p className="text-verde3 mt-6">
                  Cargando preguntas frecuentes...
                </p>
              ) : error ? (
                <p className="text-red-500 mt-6">{error}</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
                  {faqs.map((f) => (
                    <CardFAQ
                      key={f.id}
                      pregunta={f.pregunta}
                      respuesta={f.respuesta}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
