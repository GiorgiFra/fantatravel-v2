// formatDate.ts
export const formatDate = (
    date: Date | string,
    locale: string
): string => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString(locale);
};