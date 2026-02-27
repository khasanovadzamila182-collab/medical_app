// ─── Dosage Calculation Module ─────────────────────────────────────
// All formulas from "Протокол лечения ОРВИ" PDF

export interface DosageResult {
    drug: string;
    doseMl?: number;
    doseDrops?: number;
    unit: string;
    frequency: string;
    notes: string;
    isFixed: boolean;
}

/** Парацетамол (120 мг / 5 мл) → dose = weight × 0.625 мл */
export function calcParacetamol(weightKg: number): DosageResult {
    const doseMl = Math.round(weightKg * 0.625 * 10) / 10;
    return {
        drug: "Парацетамол (сироп 120мг/5мл)",
        doseMl,
        unit: "мл",
        frequency: "Каждые 4-6 часов, не более 4 раз/сут",
        notes: "Максимальная суточная доза: 60 мг/кг. Не давать при аллергии.",
        isFixed: false,
    };
}

/** Ибупрофен (100 мг / 5 мл) → dose = weight / 2 мл */
export function calcIbuprofen(weightKg: number): DosageResult {
    const doseMl = Math.round((weightKg / 2) * 10) / 10;
    return {
        drug: "Ибупрофен (сироп 100мг/5мл)",
        doseMl,
        unit: "мл",
        frequency: "Каждые 6-8 часов, не более 3 раз/сут",
        notes: "Давать после еды. Не комбинировать с парацетамолом без назначения врача.",
        isFixed: false,
    };
}

/** Пульмикорт — фиксированная доза */
export function calcPulmicort(): DosageResult {
    return {
        drug: "Пульмикорт (0.5 мг)",
        doseMl: 0.5,
        unit: "мг + 2 мл физраствора",
        frequency: "Ингаляция через небулайзер",
        notes: "Разбавить 2 мл физраствора. Ингаляция 10-15 мин. При лающем кашле — проверить через 30 мин.",
        isFixed: true,
    };
}

/** Беродуал — по возрасту */
export function calcBerodual(ageMonths: number): DosageResult {
    const drops = ageMonths < 72 ? 10 : 20; // < 6 лет = 10, ≥ 6 лет = 20
    return {
        drug: "Беродуал",
        doseDrops: drops,
        unit: "капель + 3 мл физраствора",
        frequency: "Ингаляция через небулайзер, до 3 раз/сут",
        notes: `${drops} капель + 3 мл физраствора. При свистах и обструкции.`,
        isFixed: true,
    };
}

/** Регидрон — для выпаивания */
export function calcRehydration(weightKg: number): DosageResult {
    const mlPerHour = Math.round(weightKg * 5);
    return {
        drug: "Регидрон / солевой раствор",
        doseMl: mlPerHour,
        unit: "мл/час маленькими глотками",
        frequency: "Глоток каждые 5-15 минут",
        notes: `По ${Math.round(mlPerHour / 4)}-${Math.round(mlPerHour / 2)} мл каждые 5-15 минут. Если рвота — подождать 10 мин и продолжить.`,
        isFixed: false,
    };
}

/** Universal dispatcher */
export function calculateDosage(
    drug: string,
    weightKg: number,
    ageMonths: number
): DosageResult | null {
    switch (drug) {
        case "paracetamol": return calcParacetamol(weightKg);
        case "ibuprofen": return calcIbuprofen(weightKg);
        case "pulmicort": return calcPulmicort();
        case "berodual": return calcBerodual(ageMonths);
        case "rehydration": return calcRehydration(weightKg);
        default: return null;
    }
}
