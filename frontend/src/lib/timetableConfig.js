export const DAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

export const DAY_SHORT = {
    Monday: "Mon",
    Tuesday: "Tue",
    Wednesday: "Wed",
    Thursday: "Thu",
    Friday: "Fri",
    Saturday: "Sat",
};

export const SUBJECT_COLORS = [
    "bg-[#D6CBFA] border-[#C4B0F7] text-[#3C2A8A]", // lavender
    "bg-[#F5D6B8] border-[#E8B88F] text-[#7A3A00]", // orange
    "bg-[#B8D8F5] border-[#8FBDE8] text-[#1A3A6B]", // blue
    "bg-[#B8EEF0] border-[#7ADDE0] text-[#0A5A5C]", // cyan/teal
    "bg-[#EDD5C8] border-[#D4A898] text-[#5C2A1A]", // mocha
    "bg-[#F0B8EE] border-[#E080DC] text-[#5A0A58]", // magenta/pink-purple
];

export const buildColorMap = (subjects) => {
    const map = new Map();
    subjects.forEach((subject) => {
        if (!map.has(subject._id)) {
            map.set(
                subject._id,
                SUBJECT_COLORS[map.size % SUBJECT_COLORS.length],
            );
        }
    });
    return map;
};
