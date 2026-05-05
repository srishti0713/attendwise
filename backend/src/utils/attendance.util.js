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

    // Helper to calculate how many classes can be missed safely
    const classesMissable = (att, tot, threshold) => {
        if (tot === 0) return 0;

        let missable = 0;

        while ((att / (tot + missable + 1)) * 100 >= threshold) {
            missable++;
        }

        return missable;
    };

    const safeNeeded = classesNeeded(attended, total, safe);
    const targetNeeded = classesNeeded(attended, total, target);

    // How many classes can be missed without falling below safe threshold
    const canMiss =
        current >= safe ? classesMissable(attended, total, safe) : 0;

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
        canMiss,
        status,
        message,
    };
};

// Overall attendance across all subjects
export const getOverallAttendance = (subjects = []) => {
    let totalAttended = 0;
    let totalClasses = 0;

    for (const subject of subjects) {
        totalAttended += subject.attended ?? 0;
        totalClasses += subject.total ?? 0;
    }

    const overallPercentage =
        totalClasses === 0
            ? 0
            : Number(((totalAttended / totalClasses) * 100).toFixed(2));

    return {
        totalAttended,
        totalClasses,
        overallPercentage,
    };
};
