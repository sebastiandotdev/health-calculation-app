"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ResultsDisplay } from "@/components/results-display"
import { performCalculations } from "@/lib/calculations"
import type { UserData, CalculationResults } from "@/lib/types"

export default function ResultsPage() {
  const router = useRouter()
  const [results, setResults] = useState<CalculationResults | null>(null)
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [emailSent, setEmailSent] = useState(false)

  useEffect(() => {
    const userDataStr = localStorage.getItem("userData")
    const name = localStorage.getItem("userName")
    const email = localStorage.getItem("userEmail")

    if (!userDataStr || !name || !email) {
      router.push("/")
      return
    }

    const userData: UserData = JSON.parse(userDataStr)
    setUserName(name)
    setUserEmail(email)

    // Perform calculations
    const calculationResults = performCalculations(userData)
    setResults(calculationResults)

    // Store results for email
    localStorage.setItem("calculationResults", JSON.stringify(calculationResults))
  }, [router])

  const handleSendEmail = () => {
    // Simulate email sending
    // In a real app, this would call an API endpoint
    console.log("[v0] Sending results to:", userEmail)
    console.log("[v0] Results:", results)

    // Show success message
    setEmailSent(true)
    setTimeout(() => setEmailSent(false), 3000)
  }

  const handleNewCalculation = () => {
    // Clear stored data
    localStorage.removeItem("userData")
    localStorage.removeItem("calculationResults")

    // Navigate back to home
    router.push("/")
  }

  if (!results) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-muted via-background to-muted flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Calculando resultados...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-muted via-background to-muted py-8 px-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Tus Resultados, {userName}</h1>
          <p className="text-muted-foreground">Plan personalizado basado en tus datos y objetivos</p>
        </div>

        <ResultsDisplay results={results} userName={userName} />

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleSendEmail}
            variant="outline"
            className="min-w-[200px] bg-transparent"
            disabled={emailSent}
          >
            {emailSent ? (
              <>
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Enviado a {userEmail}
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Enviar resultados por correo
              </>
            )}
          </Button>

          <Button onClick={handleNewCalculation} className="min-w-[200px] bg-primary hover:bg-primary-dark">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <strong>Nota importante:</strong> Estos resultados son estimaciones basadas en modelos matemáticos.
          </p>
          <p>
            Consulta con un profesional de la salud antes de realizar cambios significativos en tu dieta o rutina de
            ejercicio.
          </p>
        </div>
      </div>
    </main>
  )
}
