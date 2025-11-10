"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { UserData } from "@/lib/types";

// Password Supabase: y9OFhdsKezpGBL9I
export function CalculatorForm() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [formData, setFormData] = useState<Partial<UserData>>({
    sex: "male",
    activityLevel: "moderate",
    goal: "maintain",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const name = localStorage.getItem("userName");
    const email = localStorage.getItem("userEmail");

    if (!name || !email) {
      router.push("/");
      return;
    }

    setUserName(name);
    setFormData((prev) => ({ ...prev, name, email }));
  }, [router]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.age || formData.age < 15 || formData.age > 100) {
      newErrors.age = "Edad debe estar entre 15 y 100 años";
    }

    if (!formData.weight || formData.weight < 30 || formData.weight > 300) {
      newErrors.weight = "Peso debe estar entre 30 y 300 kg";
    }

    if (!formData.height || formData.height < 100 || formData.height > 250) {
      newErrors.height = "Altura debe estar entre 100 y 250 cm";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      if (validateForm()) {
        const targetWeightChange = formData.goal === "maintain" ? 0 : 5;
        const completeData = { ...formData, targetWeightChange } as UserData;

        localStorage.setItem("userData", JSON.stringify(completeData));

        setTimeout(() => {
          router.push("/results");
        }, 500);
      }
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-primary/20">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-bold text-primary">
          Hola, {userName}! 👋
        </CardTitle>
        <CardDescription className="text-base">
          Completa la siguiente información para calcular tu plan personalizado
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Edad (años)</Label>
              <Input
                id="age"
                type="number"
                placeholder="25"
                value={formData.age || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    age: Number.parseInt(e.target.value),
                  })
                }
                className={errors.age ? "border-error" : ""}
              />
              {errors.age && <p className="text-sm text-error">{errors.age}</p>}
            </div>

            <div className="space-y-2">
              <Label>Sexo</Label>
              <RadioGroup
                value={formData.sex}
                onValueChange={(value) =>
                  setFormData({ ...formData, sex: value as "male" | "female" })
                }
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male" className="font-normal cursor-pointer">
                    Masculino
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label
                    htmlFor="female"
                    className="font-normal cursor-pointer"
                  >
                    Femenino
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Peso inicial (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="70"
                value={formData.weight || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    weight: Number.parseFloat(e.target.value),
                  })
                }
                className={errors.weight ? "border-error" : ""}
              />
              {errors.weight && (
                <p className="text-sm text-error">{errors.weight}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Altura (cm)</Label>
              <Input
                id="height"
                type="number"
                placeholder="170"
                value={formData.height || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    height: Number.parseInt(e.target.value),
                  })
                }
                className={errors.height ? "border-error" : ""}
              />
              {errors.height && (
                <p className="text-sm text-error">{errors.height}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="activity">Nivel de actividad diaria</Label>
            <Select
              value={formData.activityLevel}
              onValueChange={(value) =>
                setFormData({ ...formData, activityLevel: value as any })
              }
            >
              <SelectTrigger id="activity">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary">
                  Sedentario (poco o ningún ejercicio)
                </SelectItem>
                <SelectItem value="light">
                  Ligero (ejercicio 1-3 días/semana)
                </SelectItem>
                <SelectItem value="moderate">
                  Moderado (ejercicio 3-5 días/semana)
                </SelectItem>
                <SelectItem value="active">
                  Activo (ejercicio 6-7 días/semana)
                </SelectItem>
                <SelectItem value="very-active">
                  Muy activo (ejercicio intenso diario)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal">Objetivo</Label>
            <Select
              value={formData.goal}
              onValueChange={(value) =>
                setFormData({ ...formData, goal: value as any })
              }
            >
              <SelectTrigger id="goal">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lose">Perder peso</SelectItem>
                <SelectItem value="maintain">Mantener peso</SelectItem>
                <SelectItem value="gain">Ganar peso</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/")}
              className="flex-1"
            >
              Volver
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary-dark"
            >
              Calcular resultados
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
