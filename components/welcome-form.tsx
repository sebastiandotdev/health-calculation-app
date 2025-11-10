"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const ADMIN_EMAIL = "mgomez407@estudiantes.areandina.edu.co"

export function WelcomeForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [errors, setErrors] = useState({ name: "", email: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isAdminEmail = email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase()

  const validateForm = () => {
    const newErrors = { name: "", email: "" }
    let isValid = true

    if (!name.trim()) {
      newErrors.name = "El nombre es requerido"
      isValid = false
    } else if (name.trim().length < 2) {
      newErrors.name = "El nombre debe tener al menos 2 caracteres"
      isValid = false
    }

    if (!email.trim()) {
      newErrors.email = "El email es requerido"
      isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email inválido"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    // Store name and email
    localStorage.setItem("userName", name.trim())
    localStorage.setItem("userEmail", email.trim())

    // Navigate to calculator
    setTimeout(() => {
      router.push("/calculator")
    }, 300)
  }

  const handleViewResults = () => {
    router.push("/admin")
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-primary/20">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-bold text-center">Bienvenido 👋</CardTitle>
        <CardDescription className="text-center text-base">
          Ingresa tus datos para comenzar con tu evaluación de salud
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre completo</Label>
            <Input
              id="name"
              type="text"
              placeholder="Ej: Juan Pérez"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (errors.name) setErrors({ ...errors, name: "" })
              }}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (errors.email) setErrors({ ...errors, email: "" })
              }}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
            {isAdminEmail && !errors.email && (
              <div className="flex items-center gap-2 text-sm text-primary font-medium bg-primary/10 p-2 rounded-md">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Correo de administrador detectado</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  Procesando...
                </>
              ) : (
                "Continuar con el formulario"
              )}
            </Button>

            {isAdminEmail && !errors.email && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleViewResults}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Ver Registros del Sistema
              </Button>
            )}
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>
            Tus datos serán utilizados únicamente para generar tu plan personalizado de salud.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}