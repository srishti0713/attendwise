export const getAttendanceStats = (attendance = [], safe, target) => {
    let attended = 0;
    let total = 0;

    // ✅ Calculate attended & total (ignore "off")
    for (const entry of attendance) {
        if (entry.status === "attended") {
            attended++;
            total++;
        } else if (entry.status === "missed") {
            total++;
        }
        // "off" is ignored
    }

    const current = total === 0 ? 0 : (attended / total) * 100;

    //  Helper to calculate required classes
    const classesNeeded = (att, tot, goal) => {
        if (tot === 0) return 0;

        let needed = 0;

        while (((att + needed) / (tot + needed)) * 100 < goal) {
            needed++;
        }

        return needed;
    };

    const safeNeeded = classesNeeded(attended, total, safe);
    const targetNeeded = classesNeeded(attended, total, target);

    //  Status logic
    let status, message;

    if (current < safe) {
        status = "danger";
        message = `Attend ${safeNeeded} classes to reach ${safe}%`;
    } else if (current < target) {
        status = "moderate";
        message = `Safe. Attend ${targetNeeded} more to reach ${target}%`;
    } else {
        status = "safe";
        message = `Above ${target}%`;
    }

    return {
        attended,
        total,
        attendancePercentage: Number(current.toFixed(2)),
        classesToSafeZone: safeNeeded,
        classesToGoal: targetNeeded,
        status,
        message,
    };
};