import { supabase } from '@/lib/supabase'
import type { UserData, CalculationResults } from '@/lib/types'

export interface UserHealthRecord {
  id: string
  created_at: string
  name: string
  email: string
  age: number
  sex: 'male' | 'female'
  weight: number
  height: number
  target_weight: number
  activity_level: string
  goal: string
  calculation_results: CalculationResults
}

export async function saveUserHealthData(
  userData: UserData,
  calculationResults: CalculationResults
) {
  try {
    const { data, error } = await supabase
      .from('user_health_data')
      .insert([
        {
          name: userData.name,
          email: userData.email,
          age: userData.age,
          sex: userData.sex,
          weight: userData.weight,
          height: userData.height,
          target_weight: calculationResults.targetWeight,
          activity_level: userData.activityLevel,
          goal: userData.goal,
          calculation_results: calculationResults
        }
      ])
      .select()

    if (error) {
      console.error('Error saving to Supabase:', error)
      return { success: false, error }
    }

    console.log('Data saved successfully:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Exception saving to Supabase:', error)
    return { success: false, error }
  }
}

export async function getAllUserHealthData(): Promise<UserHealthRecord[]> {
  try {
    const { data, error } = await supabase
      .from('user_health_data')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching from Supabase:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Exception fetching from Supabase:', error)
    return []
  }
}

export async function deleteUserHealthData(id: string) {
  try {
    const { error } = await supabase
      .from('user_health_data')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting from Supabase:', error)
      return { success: false, error }
    }

    return { success: true }
  } catch (error) {
    console.error('Exception deleting from Supabase:', error)
    return { success: false, error }
  }
}
