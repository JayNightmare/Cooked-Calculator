import { useMemo } from "react";

export interface Degree {
    subject: string;
    risk: number;
    careerPivot: string;
}

export type Grade = "First" | "2:1" | "2:2" | "Third";
export type PostGrad = "None" | "Masters" | "PhD";

export const useCookedScore = (
    degree: Degree | null,
    grade: Grade,
    postGrad: PostGrad
) => {
    return useMemo(() => {
        if (!degree) return 0;

        let calculatedScore = degree.risk;

        // Grade Multiplier
        const gradeMultipliers: Record<Grade, number> = {
            First: 0.8,
            "2:1": 1.0,
            "2:2": 1.2,
            Third: 1.5,
        };
        calculatedScore *= gradeMultipliers[grade] || 1.0;

        // Post-Grad Logic
        if (postGrad === "PhD" && degree.risk > 0.7) {
            calculatedScore += 0.1; // Hyper-Specialization Penalty
        }

        // Cap at 1.0 (100%)
        return Math.min(calculatedScore, 1.0);
    }, [degree, grade, postGrad]);
};
