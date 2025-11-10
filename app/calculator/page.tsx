import { CalculatorForm } from "@/components/calculator-form";

export default function CalculatorPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-muted via-background to-muted py-8 px-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Datos Personales
          </h1>
          <p className="text-muted-foreground">
            Completa tu información para generar tu plan personalizado
          </p>          
        </div>

        <CalculatorForm />
      </div>
    </main>
  );
}
