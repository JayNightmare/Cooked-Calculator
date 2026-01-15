import { useMemo } from "react";

export interface Degree {
    subject: string;
    risk: number; // Legacy field, kept for reference
    aiExposure: number;
    employmentRate: number;
    startingSalary: number;
    saturation: number;
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

        let calculatedScore = 0;

        // 1. AI Exposure Assessment (45% weight)
        // High exposure directly increases cooked-ness
        calculatedScore += degree.aiExposure * 0.45;

        // 2. Employment Reality Check
        // Low employment rate dramatically increases risk
        // Multiplier of 2.5 means 60% employment adds 1.0 to score (instant cook)
        calculatedScore += (1 - degree.employmentRate) * 2.5;

        // 3. Market Saturation (10% weight)
        calculatedScore += degree.saturation * 0.1;

        // Post-Grad Logic
        // PhDs in high risk fields are actually MORE cooked (overqualified + no jobs)
        if (postGrad === "PhD") {
            if (degree.aiExposure > 0.7 || degree.saturation > 0.7) {
                calculatedScore += 0.15; // The "Overqualified Barista" penalty
            } else {
                calculatedScore -= 0.1; // Useful PhDs still save you
            }
        } else if (postGrad === "Masters") {
            calculatedScore -= 0.05; // Masters usually helps a little
        }

        // Salary Buffer
        // If starting salary is decent (>30k), it mitigates some risk
        if (degree.startingSalary > 30) {
            calculatedScore -= 0.1;
        } else if (degree.startingSalary < 20) {
            calculatedScore += 0.1; // Poverty trap penalty
        }

        // Grade Multiplier
        // A First class degree acts as a shield, a Third acts as an anchor
        const gradeMultipliers: Record<Grade, number> = {
            First: 0.85,
            "2:1": 1.0,
            "2:2": 1.15,
            Third: 1.4,
        };
        calculatedScore *= gradeMultipliers[grade] || 1.0;

        // Cap at 1.0 (100%)
        return Math.max(0, Math.min(calculatedScore, 1.0));
    }, [degree, grade, postGrad]);
};
