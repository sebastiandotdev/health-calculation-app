export type Sex = "male" | "female"
export type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "very-active"
export type Goal = "lose" | "maintain" | "gain"

export interface UserData {
  name: string
  email: string
  age: number
  sex: Sex
  weight: number // kg
  height: number // cm
  activityLevel: ActivityLevel
  goal: Goal
  targetWeightChange?: number // kg (positive for gain, negative for loss)
}

export interface CalculationResults {
  bmr: number
  tdee: number
  recommendedCalories: number
  equilibriumWeight: number
  currentWeight: number
  targetWeight: number
  daysToGoal: number
  weightOverTime: { day: number; weight: number }[]
  nutritionRecommendations: string[]
}
