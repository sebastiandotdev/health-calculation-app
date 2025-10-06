"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { CalculationResults } from "@/lib/types"
import { WeightChart } from "./weight-chart"

interface ResultsDisplayProps {
  results: CalculationResults
  userName: string
}

export function ResultsDisplay({ results, userName }: ResultsDisplayProps) {
  const {
    bmr,
    tdee,
    recommendedCalories,
    currentWeight,
    targetWeight,
    daysToGoal,
    weightOverTime,
    nutritionRecommendations,
  } = results

  const isGoalAchievable = isFinite(daysToGoal) && daysToGoal > 0
  const weeksToGoal = Math.ceil(daysToGoal / 7)
  const monthsToGoal = Math.ceil(daysToGoal / 30)

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-primary/20">
          <CardHeader className="pb-3">
            <CardDescription>Metabolismo Basal (BMR)</CardDescription>
            <CardTitle className="text-3xl text-primary">{Math.round(bmr)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">kcal/día</p>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader className="pb-3">
            <CardDescription>Gasto Energético Total (TDEE)</CardDescription>
            <CardTitle className="text-3xl text-primary">{Math.round(tdee)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">kcal/día</p>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader className="pb-3">
            <CardDescription>Calorías Recomendadas</CardDescription>
            <CardTitle className="text-3xl text-primary">{Math.round(recommendedCalories)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">kcal/día</p>
          </CardContent>
        </Card>
      </div>

      {/* Time to Goal */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl">Tiempo Estimado para Alcanzar tu Objetivo</CardTitle>
        </CardHeader>
        <CardContent>
          {isGoalAchievable ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Peso actual</p>
                  <p className="text-2xl font-semibold">{currentWeight.toFixed(1)} kg</p>
                </div>
                <div className="text-primary">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Peso objetivo</p>
                  <p className="text-2xl font-semibold text-primary">{targetWeight.toFixed(1)} kg</p>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <p className="text-lg font-semibold text-center">
                  {daysToGoal < 30 ? (
                    <>
                      Aproximadamente <span className="text-primary">{Math.ceil(daysToGoal)} días</span> ({weeksToGoal}{" "}
                      semanas)
                    </>
                  ) : (
                    <>
                      Aproximadamente <span className="text-primary">{monthsToGoal} meses</span> (
                      {Math.ceil(daysToGoal)} días)
                    </>
                  )}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-warning/10 border border-warning/20 p-4 rounded-lg">
              <p className="text-warning font-semibold mb-2">Objetivo no alcanzable con el consumo calórico actual</p>
              <p className="text-sm text-muted-foreground">
                Con tu consumo calórico recomendado de {Math.round(recommendedCalories)} kcal/día, tu peso se
                estabilizará en {results.equilibriumWeight.toFixed(1)} kg. Ajusta tu objetivo o consulta con un
                profesional de la salud.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weight Chart */}
      {isGoalAchievable && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl">Proyección de Peso en el Tiempo</CardTitle>
            <CardDescription>
              Evolución estimada de tu peso siguiendo el plan de {Math.round(recommendedCalories)} kcal/día
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WeightChart data={weightOverTime} targetWeight={targetWeight} />
          </CardContent>
        </Card>
      )}

      {/* Nutrition Recommendations */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl">Recomendaciones Nutricionales</CardTitle>
          <CardDescription>Consejos personalizados para {userName}</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {nutritionRecommendations.map((recommendation, index) => (
              <li key={index} className="flex gap-3">
                <div className="mt-1 flex-shrink-0">
                  <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center">
                    <svg className="w-3 h-3 text-accent" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-sm leading-relaxed">{recommendation}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
