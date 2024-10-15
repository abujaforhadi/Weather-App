const getDayNameFromDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        throw new Error('Invalid date format');
    }
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return dayNames[date.getDay()];
};

const dateStr = "2024-10-15"; 
const dayName = getDayNameFromDate(dateStr);
console.log(dayName);
