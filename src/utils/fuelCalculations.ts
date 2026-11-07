import { FuelLog } from '../types';

export interface FuelRefillWithAutonomy extends FuelLog {
  deltaKm: number | null;
  kmPerLiter: number | null;
  litersPer100Km: number | null;
  autonomyTankKm: number | null;
  costPerKm: number | null;
  efficiencyRating: 'excellent' | 'good' | 'normal' | 'low';
}

export interface GlobalFuelStats {
  averageKmPerLiter: number;
  averageAutonomyTankKm: number;
  bestAutonomyTankKm: number;
  totalKmTracked: number;
  totalLiters: number;
  totalCostUsd: number;
  averageCostPerKm: number;
  evaluatedRefillsCount: number;
}

/**
 * Calculates historical autonomy and efficiency metrics for each fuel log.
 * Computes the delta from the chronologically preceding log.
 */
export function calculateFuelAutonomyHistory(
  logs: FuelLog[],
  tankCapacity: number = 12.0
): FuelRefillWithAutonomy[] {
  if (!logs || logs.length === 0) return [];

  // Sort chronologically ascending (by odometer, then date)
  const sortedChronological = [...logs].sort((a, b) => {
    if (a.odometer !== b.odometer) return a.odometer - b.odometer;
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const computedMap = new Map<string, FuelRefillWithAutonomy>();

  for (let i = 0; i < sortedChronological.length; i++) {
    const current = sortedChronological[i];
    const previous = i > 0 ? sortedChronological[i - 1] : null;

    if (previous && current.odometer > previous.odometer && current.liters > 0) {
      const deltaKm = current.odometer - previous.odometer;
      const kmPerLiter = Number((deltaKm / current.liters).toFixed(1));
      const litersPer100Km = Number(((current.liters / deltaKm) * 100).toFixed(2));
      const autonomyTankKm = Math.round(kmPerLiter * tankCapacity);
      const costPerKm = Number((current.totalUsd / deltaKm).toFixed(3));

      let efficiencyRating: 'excellent' | 'good' | 'normal' | 'low' = 'good';
      if (kmPerLiter >= 45) {
        efficiencyRating = 'excellent';
      } else if (kmPerLiter >= 36) {
        efficiencyRating = 'good';
      } else if (kmPerLiter >= 28) {
        efficiencyRating = 'normal';
      } else {
        efficiencyRating = 'low';
      }

      computedMap.set(current.id, {
        ...current,
        deltaKm,
        kmPerLiter,
        litersPer100Km,
        autonomyTankKm,
        costPerKm,
        efficiencyRating,
      });
    } else {
      // First baseline entry or zero-delta
      computedMap.set(current.id, {
        ...current,
        deltaKm: null,
        kmPerLiter: null,
        litersPer100Km: null,
        autonomyTankKm: Math.round(38.5 * tankCapacity), // Reference default estimate
        costPerKm: null,
        efficiencyRating: 'normal',
      });
    }
  }

  // Return preserving the original array order (usually latest first)
  return logs.map((log) => computedMap.get(log.id) || {
    ...log,
    deltaKm: null,
    kmPerLiter: null,
    litersPer100Km: null,
    autonomyTankKm: Math.round(38.5 * tankCapacity),
    costPerKm: null,
    efficiencyRating: 'normal',
  });
}

/**
 * Computes live autonomy projection for a new fuel entry being typed into the form
 */
export function calculateLiveRefillProjection(
  newOdometer: number,
  newLiters: number,
  newTotalUsd: number,
  previousLog: FuelLog | null,
  tankCapacity: number = 12.0
): {
  deltaKm: number | null;
  kmPerLiter: number | null;
  autonomyTankKm: number | null;
  costPerKm: number | null;
  litersPer100Km: number | null;
  isValid: boolean;
  message: string;
} {
  if (!previousLog) {
    const baseAutonomy = Math.round(38.5 * tankCapacity);
    return {
      deltaKm: null,
      kmPerLiter: 38.5,
      autonomyTankKm: baseAutonomy,
      costPerKm: null,
      litersPer100Km: 2.6,
      isValid: true,
      message: 'Primer registro del tanque de combustible (punto de referencia inicial)',
    };
  }

  const deltaKm = newOdometer - previousLog.odometer;

  if (deltaKm <= 0) {
    return {
      deltaKm: deltaKm,
      kmPerLiter: null,
      autonomyTankKm: null,
      costPerKm: null,
      litersPer100Km: null,
      isValid: false,
      message: `El odómetro debe ser mayor a la última recarga (${previousLog.odometer.toLocaleString()} Km)`,
    };
  }

  if (newLiters <= 0) {
    return {
      deltaKm,
      kmPerLiter: null,
      autonomyTankKm: null,
      costPerKm: null,
      litersPer100Km: null,
      isValid: false,
      message: 'Ingresa los litros cargados para calcular la autonomía',
    };
  }

  const kmPerLiter = Number((deltaKm / newLiters).toFixed(1));
  const autonomyTankKm = Math.round(kmPerLiter * tankCapacity);
  const costPerKm = newTotalUsd > 0 ? Number((newTotalUsd / deltaKm).toFixed(3)) : null;
  const litersPer100Km = Number(((newLiters / deltaKm) * 100).toFixed(2));

  return {
    deltaKm,
    kmPerLiter,
    autonomyTankKm,
    costPerKm,
    litersPer100Km,
    isValid: true,
    message: `${deltaKm} Km recorridos con un rendimiento de ${kmPerLiter} Km/L`,
  };
}

/**
 * Calculates aggregate stats over all evaluated refills
 */
export function calculateGlobalFuelStats(
  logsWithAutonomy: FuelRefillWithAutonomy[],
  tankCapacity: number = 12.0
): GlobalFuelStats {
  const validEvaluated = logsWithAutonomy.filter((l) => l.kmPerLiter !== null && l.deltaKm !== null);

  const totalCostUsd = logsWithAutonomy.reduce((sum, l) => sum + l.totalUsd, 0);
  const totalLiters = logsWithAutonomy.reduce((sum, l) => sum + l.liters, 0);

  if (validEvaluated.length === 0) {
    const fallbackAutonomy = Math.round(38.5 * tankCapacity);
    return {
      averageKmPerLiter: 38.5,
      averageAutonomyTankKm: fallbackAutonomy,
      bestAutonomyTankKm: fallbackAutonomy,
      totalKmTracked: 0,
      totalLiters,
      totalCostUsd,
      averageCostPerKm: 0,
      evaluatedRefillsCount: 0,
    };
  }

  const sumKmPerLiter = validEvaluated.reduce((sum, l) => sum + (l.kmPerLiter || 0), 0);
  const sumDeltaKm = validEvaluated.reduce((sum, l) => sum + (l.deltaKm || 0), 0);
  const sumCostEvaluated = validEvaluated.reduce((sum, l) => sum + l.totalUsd, 0);

  const averageKmPerLiter = Number((sumKmPerLiter / validEvaluated.length).toFixed(1));
  const averageAutonomyTankKm = Math.round(averageKmPerLiter * tankCapacity);
  const bestAutonomyTankKm = Math.max(...validEvaluated.map((l) => l.autonomyTankKm || 0));
  const averageCostPerKm = sumDeltaKm > 0 ? Number((sumCostEvaluated / sumDeltaKm).toFixed(3)) : 0;

  return {
    averageKmPerLiter,
    averageAutonomyTankKm,
    bestAutonomyTankKm,
    totalKmTracked: sumDeltaKm,
    totalLiters,
    totalCostUsd,
    averageCostPerKm,
    evaluatedRefillsCount: validEvaluated.length,
  };
}
