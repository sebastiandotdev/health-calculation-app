"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ResultsDisplay } from "@/components/results-display";
import { performCalculations } from "@/lib/calculations";
import { saveUserHealthData } from "@/lib/queries";
import type { UserData, CalculationResults } from "@/lib/types";

export default function ResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [saving, setSaving] = useState(false);
  const [sendingToAdmin, setSendingToAdmin] = useState(false);
  const [adminEmailSent, setAdminEmailSent] = useState(false);
    
  const hasSaved = useRef(false);

  useEffect(() => {
    const userDataStr = localStorage.getItem("userData");

    if (!userDataStr) {
      router.push("/");
      return;
    }

    const parsedUserData: UserData = JSON.parse(userDataStr);
    setUserData(parsedUserData);

    const calculationResults = performCalculations(parsedUserData);
    setResults(calculationResults);

    if (!hasSaved.current) {
      saveToDatabase(parsedUserData, calculationResults);
      hasSaved.current = true;
    }
  }, [router]);

  const saveToDatabase = async (
    userData: UserData,
    calculationResults: CalculationResults
  ) => {
    setSaving(true);
    const result = await saveUserHealthData(userData, calculationResults);

    if (result.success) {
      console.log("Datos guardados en Supabase correctamente");
    } else {
      console.error("Error al guardar en Supabase:", result.error);
    }
    setSaving(false);
  };

  const handleSendEmail = async () => {
    setSendingToAdmin(true);
        
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log("[Sistema] Enviando resultados al administrador");
    console.log("[Sistema] Usuario:", userData?.email);
    console.log("[Sistema] Results:", results);
    
    setSendingToAdmin(false);
    setAdminEmailSent(true);
    setTimeout(() => setAdminEmailSent(false), 4000);
  };

  const handleNewCalculation = () => {
    localStorage.removeItem("userData");
    router.push("/");
  };

  if (!results || !userData) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-muted via-background to-muted flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Calculando resultados...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-muted via-background to-muted py-8 px-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Tus Resultados, {userData.name}
          </h1>
          <p className="text-muted-foreground">
            Plan personalizado basado en tus datos y objetivos
          </p>
          {saving && (
            <p className="text-sm text-muted-foreground mt-2">
              <span className="inline-block w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></span>
              Guardando en base de datos...
            </p>
          )}
        </div>

        <ResultsDisplay results={results} userName={userData.name} />

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleSendEmail}
            variant="outline"
            className="min-w-[200px] bg-transparent"
            disabled={sendingToAdmin || adminEmailSent}
          >
            {adminEmailSent ? (
              <>
                <svg
                  className="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Enviado al Administrador
              </>
            ) : sendingToAdmin ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></span>
                Enviando...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Enviar al Administrador
              </>
            )}
          </Button>

          <Button
            onClick={handleNewCalculation}
            className="min-w-[200px] bg-primary hover:bg-primary-dark"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Nueva consulta
          </Button>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p className="mb-2">
            <strong>Nota importante:</strong> Estos resultados son estimaciones
            basadas en modelos matemáticos.
          </p>
          <p>
            Consulta con un profesional de la salud antes de realizar cambios
            significativos en tu dieta o rutina de ejercicio.
          </p>
        </div>
      </div>
    </main>
  );
}