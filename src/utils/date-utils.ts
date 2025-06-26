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

export function getMonthsBetweenDates(startDate: Date, endDate: Date): Array<{ monthIndex: number; year: number }> {
    const months: Array<{ monthIndex: number; year: number }> = [];
    
    // Ensure startDate is before endDate
    if (startDate > endDate) {
        [startDate, endDate] = [endDate, startDate];
    }

    // Start from the first day of the start month
    const current = new Date(startDate);
    current.setDate(1);
    
    while (current <= endDate) {
        months.push({
            monthIndex: current.getMonth(),
            year: current.getFullYear()
        });
        
        // Move to next month
        current.setMonth(current.getMonth() + 1);
    }
    
    return months;
}
