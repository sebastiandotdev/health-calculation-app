"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getAllUserHealthData,
  deleteUserHealthData,
  type UserHealthRecord,
} from "@/lib/queries";
import Link from "next/link";

export default function AdminPage() {
  const [records, setRecords] = useState<UserHealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<UserHealthRecord | null>(
    null
  );

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    setLoading(true);
    const data = await getAllUserHealthData();
    setRecords(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este registro?")) return;

    const result = await deleteUserHealthData(id);
    if (result.success) {
      setRecords(records.filter((r) => r.id !== id));
      if (selectedRecord?.id === id) {
        setSelectedRecord(null);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActivityLevelLabel = (level: string) => {
    const labels: Record<string, string> = {
      sedentary: "Sedentario",
      light: "Ligera actividad",
      moderate: "Moderadamente activo",
      active: "Muy activo",
      "very-active": "Extremadamente activo",
    };
    return labels[level] || level;
  };

  const getGoalLabel = (goal: string) => {
    const labels: Record<string, string> = {
      lose: "Perder peso",
      maintain: "Mantener peso",
      gain: "Ganar peso",
    };
    return labels[goal] || goal;
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-muted via-background to-muted flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando registros...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-muted via-background to-muted py-8 px-4">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex gap-5 items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Panel de Administrador
            </h1>
            <p className="text-muted-foreground">
              Total de registros: {records.length}
            </p>
          </div>
          <Button onClick={loadRecords} variant="outline">
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
            Actualizar
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Volver al home</Link>
          </Button>
        </div>

        {records.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <p className="text-muted-foreground text-lg">
                No hay registros aún
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Los registros aparecerán aquí cuando los usuarios completen el
                formulario
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Lista de registros */}
            <div className="space-y-4 max-h-[800px] overflow-y-auto">
              {records.map((record) => (
                <Card
                  key={record.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedRecord?.id === record.id
                      ? "ring-2 ring-primary"
                      : ""
                  }`}
                  onClick={() => setSelectedRecord(record)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{record.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {record.email}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(record.created_at)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(record.id);
                        }}
                        className="text-destructive hover:text-destructive"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Edad:</span>{" "}
                        {record.age} años
                      </div>
                      <div>
                        <span className="text-muted-foreground">Sexo:</span>{" "}
                        {record.sex === "male" ? "Masculino" : "Femenino"}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Peso:</span>{" "}
                        {record.weight} kg
                      </div>
                      <div>
                        <span className="text-muted-foreground">Objetivo:</span>{" "}
                        {record.target_weight} kg
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Detalles del registro seleccionado */}
            <div className="sticky top-4 h-fit">
              {selectedRecord ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Detalles Completos</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-2 text-lg">
                        Información Personal
                      </h3>
                      <div className="space-y-2 text-sm">
                        <p>
                          <strong>Nombre:</strong> {selectedRecord.name}
                        </p>
                        <p>
                          <strong>Email:</strong> {selectedRecord.email}
                        </p>
                        <p>
                          <strong>Fecha:</strong>{" "}
                          {formatDate(selectedRecord.created_at)}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2 text-lg">
                        Datos Físicos
                      </h3>
                      <div className="space-y-2 text-sm">
                        <p>
                          <strong>Edad:</strong> {selectedRecord.age} años
                        </p>
                        <p>
                          <strong>Sexo:</strong>{" "}
                          {selectedRecord.sex === "male"
                            ? "Masculino"
                            : "Femenino"}
                        </p>
                        <p>
                          <strong>Peso actual:</strong> {selectedRecord.weight}{" "}
                          kg
                        </p>
                        <p>
                          <strong>Altura:</strong> {selectedRecord.height} cm
                        </p>
                        <p>
                          <strong>Peso objetivo:</strong>{" "}
                          {selectedRecord.target_weight} kg
                        </p>
                        <p>
                          <strong>Nivel de actividad:</strong>{" "}
                          {getActivityLevelLabel(selectedRecord.activity_level)}
                        </p>
                        <p>
                          <strong>Meta:</strong>{" "}
                          {getGoalLabel(selectedRecord.goal)}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2 text-lg">
                        Resultados Calculados
                      </h3>
                      <div className="space-y-2 text-sm">
                        <p>
                          <strong>TMB:</strong>{" "}
                          {selectedRecord.calculation_results.bmr.toFixed(0)}{" "}
                          kcal/día
                        </p>
                        <p>
                          <strong>TDEE:</strong>{" "}
                          {selectedRecord.calculation_results.tdee.toFixed(0)}{" "}
                          kcal/día
                        </p>
                        <p>
                          <strong>Calorías recomendadas:</strong>{" "}
                          {selectedRecord.calculation_results.recommendedCalories.toFixed(
                            0
                          )}{" "}
                          kcal/día
                        </p>
                        <p>
                          <strong>Peso actual:</strong>{" "}
                          {selectedRecord.calculation_results.currentWeight} kg
                        </p>
                        <p>
                          <strong>Peso objetivo:</strong>{" "}
                          {selectedRecord.calculation_results.targetWeight} kg
                        </p>
                        <p>
                          <strong>Peso de equilibrio:</strong>{" "}
                          {selectedRecord.calculation_results.equilibriumWeight.toFixed(
                            2
                          )}{" "}
                          kg
                        </p>
                        <p>
                          <strong>Días para alcanzar el objetivo:</strong>{" "}
                          {selectedRecord.calculation_results.daysToGoal}
                        </p>
                      </div>
                    </div>

                    {selectedRecord.calculation_results
                      .nutritionRecommendations &&
                      selectedRecord.calculation_results
                        .nutritionRecommendations.length > 0 && (
                        <div>
                          <h3 className="font-semibold mb-2 text-lg">
                            Recomendaciones Nutricionales
                          </h3>
                          <ul className="space-y-1 text-sm list-disc list-inside">
                            {selectedRecord.calculation_results.nutritionRecommendations.map(
                              (rec, idx) => (
                                <li key={idx}>{rec}</li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="py-16 text-center">
                    <svg
                      className="w-16 h-16 mx-auto mb-4 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                      />
                    </svg>
                    <p className="text-muted-foreground">
                      Selecciona un registro para ver los detalles
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
