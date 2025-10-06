import { WelcomeForm } from "@/components/welcome-form"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-muted via-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3 text-balance">
            Calculadora de Salud y Nutrición
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Obtén un plan personalizado basado en cálculos científicos para alcanzar tus objetivos de peso
          </p>
        </div>

        <WelcomeForm />

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Basado en ecuaciones de Mifflin-St Jeor y modelo diferencial de balance energético</p>
        </div>
      </div>
    </main>
  )
}
