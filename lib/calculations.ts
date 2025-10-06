import type { UserData, CalculationResults, ActivityLevel } from "./types"

// Constants from the document
const CALORIES_PER_KG = 7700 // kcal needed to gain/lose 1 kg
const METABOLIC_RATE_COEFFICIENT = 38.56 // kcal/kg/day
const B_CONSTANT = METABOLIC_RATE_COEFFICIENT / CALORIES_PER_KG // ≈ 0.00500779

// Activity level multipliers
const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  "very-active": 1.9,
}

/**
 * Calculate Basal Metabolic Rate (BMR) using Mifflin-St Jeor equation
 */
export function calculateBMR(weight: number, height: number, age: number, sex: "male" | "female"): number {
  const baseBMR = 10 * weight + 6.25 * height - 5 * age
  return sex === "male" ? baseBMR + 5 : baseBMR - 161
}

/**
 * Calculate Total Daily Energy Expenditure (TDEE)
 */
export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  return bmr * ACTIVITY_MULTIPLIERS[activityLevel]
}

/**
 * Calculate recommended daily caloric intake based on goal
 */
export function calculateRecommendedCalories(tdee: number, goal: "lose" | "maintain" | "gain"): number {
  switch (goal) {
    case "lose":
      return tdee - 500
    case "gain":
      return tdee + 500
    case "maintain":
    default:
      return tdee
  }
}

/**
 * Calculate equilibrium weight (w∞) where weight stabilizes
 */
export function calculateEquilibriumWeight(calories: number): number {
  return calories / METABOLIC_RATE_COEFFICIENT
}

/**
 * Calculate days to reach target weight using analytical solution
 * Formula: t = -ln((w_target - w∞) / (w0 - w∞)) / b
 */
export function calculateDaysToGoal(currentWeight: number, targetWeight: number, equilibriumWeight: number): number {
  const numerator = targetWeight - equilibriumWeight
  const denominator = currentWeight - equilibriumWeight

  // Check if goal is achievable
  if (Math.abs(denominator) < 0.001) {
    return Number.POSITIVE_INFINITY // Already at equilibrium
  }

  if (numerator / denominator <= 0) {
    return Number.POSITIVE_INFINITY // Goal not achievable with current caloric intake
  }

  const days = -Math.log(numerator / denominator) / B_CONSTANT
  return Math.max(0, days)
}

/**
 * Calculate weight at time t using analytical solution
 * Formula: w(t) = w∞ + (w0 - w∞) * e^(-b*t)
 */
export function calculateWeightAtTime(initialWeight: number, equilibriumWeight: number, days: number): number {
  return equilibriumWeight + (initialWeight - equilibriumWeight) * Math.exp(-B_CONSTANT * days)
}

/**
 * Generate weight progression over time
 */
export function generateWeightProgression(
  initialWeight: number,
  equilibriumWeight: number,
  totalDays: number,
  points = 50,
): { day: number; weight: number }[] {
  const progression: { day: number; weight: number }[] = []
  const interval = Math.max(1, Math.floor(totalDays / points))

  for (let day = 0; day <= totalDays; day += interval) {
    progression.push({
      day,
      weight: calculateWeightAtTime(initialWeight, equilibriumWeight, day),
    })
  }

  // Ensure we include the final day
  if (progression[progression.length - 1].day !== totalDays) {
    progression.push({
      day: totalDays,
      weight: calculateWeightAtTime(initialWeight, equilibriumWeight, totalDays),
    })
  }

  return progression
}

/**
 * Generate nutrition recommendations based on goal and calories
 */
export function generateNutritionRecommendations(
  goal: "lose" | "maintain" | "gain",
  calories: number,
  tdee: number,
): string[] {
  const recommendations: string[] = []

  // General recommendations
  recommendations.push("Mantén una hidratación adecuada: 2-3 litros de agua al día.")
  recommendations.push("Consume proteínas de calidad: carnes magras, pescado, huevos, legumbres.")

  // Goal-specific recommendations
  if (goal === "lose") {
    recommendations.push(`Déficit calórico de ${Math.round(tdee - calories)} kcal/día para pérdida gradual de peso.`)
    recommendations.push("Prioriza alimentos ricos en fibra y proteína para mayor saciedad.")
    recommendations.push("Evita alimentos ultraprocesados y bebidas azucaradas.")
    recommendations.push("Realiza 4-5 comidas pequeñas al día para mantener el metabolismo activo.")
  } else if (goal === "gain") {
    recommendations.push(
      `Superávit calórico de ${Math.round(calories - tdee)} kcal/día para ganancia de peso saludable.`,
    )
    recommendations.push("Aumenta la ingesta de carbohidratos complejos: avena, arroz integral, pasta.")
    recommendations.push("Incluye grasas saludables: aguacate, frutos secos, aceite de oliva.")
    recommendations.push("Considera batidos calóricos entre comidas principales.")
  } else {
    recommendations.push("Mantén un balance calórico equilibrado para preservar tu peso actual.")
    recommendations.push("Distribuye tus macronutrientes: 50% carbohidratos, 30% proteínas, 20% grasas.")
    recommendations.push("Varía tu alimentación para obtener todos los micronutrientes necesarios.")
  }

  // Macronutrient distribution
  const proteinGrams = Math.round((calories * 0.3) / 4)
  const carbGrams = Math.round((calories * 0.5) / 4)
  const fatGrams = Math.round((calories * 0.2) / 9)

  recommendations.push(
    `Distribución sugerida: ${proteinGrams}g proteína, ${carbGrams}g carbohidratos, ${fatGrams}g grasas.`,
  )

  return recommendations
}

/**
 * Main calculation function
 */
export function performCalculations(userData: UserData): CalculationResults {
  const { weight, height, age, sex, activityLevel, goal, targetWeightChange = 5 } = userData

  // Step 1: Calculate BMR
  const bmr = calculateBMR(weight, height, age, sex)

  // Step 2: Calculate TDEE
  const tdee = calculateTDEE(bmr, activityLevel)

  // Step 3: Calculate recommended calories
  const recommendedCalories = calculateRecommendedCalories(tdee, goal)

  // Step 4: Calculate equilibrium weight
  const equilibriumWeight = calculateEquilibriumWeight(recommendedCalories)

  // Step 5: Determine target weight
  let targetWeight: number
  if (goal === "lose") {
    targetWeight = weight - Math.abs(targetWeightChange)
  } else if (goal === "gain") {
    targetWeight = weight + Math.abs(targetWeightChange)
  } else {
    targetWeight = weight
  }

  // Step 6: Calculate days to reach goal
  const daysToGoal = calculateDaysToGoal(weight, targetWeight, equilibriumWeight)

  // Step 7: Generate weight progression
  const maxDays = isFinite(daysToGoal) ? Math.ceil(daysToGoal) : 365
  const weightOverTime = generateWeightProgression(weight, equilibriumWeight, maxDays)

  // Step 8: Generate nutrition recommendations
  const nutritionRecommendations = generateNutritionRecommendations(goal, recommendedCalories, tdee)

  return {
    bmr,
    tdee,
    recommendedCalories,
    equilibriumWeight,
    currentWeight: weight,
    targetWeight,
    daysToGoal,
    weightOverTime,
    nutritionRecommendations,
  }
}
