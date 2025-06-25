export function getLastTwelveMonths(): Array<{ monthIndex: number; year: number }> {
    const months: Array<{ monthIndex: number; year: number }> = [];
    const currentDate = new Date();
    
    for (let i = 0; i < 12; i++) {
        const monthDate = new Date(currentDate);
        monthDate.setMonth(currentDate.getMonth() - i);
        
        months.push({
            monthIndex: monthDate.getMonth(),
            year: monthDate.getFullYear()
        });
    }
    
    // Return months in chronological order (oldest to newest)
    return months.sort((a, b) => {
        if (a.year === b.year) {
            return a.monthIndex - b.monthIndex;
        }
        return a.year - b.year;
    });
}
