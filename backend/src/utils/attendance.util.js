export const getAttendanceStats = (attendance = [], safe, target) => {
    let attended = 0;
    let total = 0;

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

    const classesNeeded = (att, tot, goal) => {
        if (tot === 0) return 0;
        let needed = 0;
        while (((att + needed) / (tot + needed)) * 100 < goal) {
            needed++;
        }
        return needed;
    };

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

    const canMiss =
        current >= safe ? classesMissable(attended, total, safe) : 0;

    // ✅ Two-level mode: safe === target (e.g. both 75%)
    // Three-level mode: safe !== target (e.g. safe=75%, target=85%)
    const isTwoLevel = safe === target;

    let status, message;

    if (current < safe) {
        status = "danger";
        message = `Attend ${safeNeeded} class${safeNeeded !== 1 ? "es" : ""} to reach ${safe}%`;
    } else if (!isTwoLevel && current < target) {
        // Only show moderate in three-level mode
        status = "moderate";
        message = `Safe. Attend ${targetNeeded} more to reach ${target}%`;
    } else {
        status = "safe";
        message =
            canMiss > 0
                ? `You can miss ${canMiss} class${canMiss !== 1 ? "es" : ""} and stay above ${safe}%`
                : `Attend every class to stay above ${safe}%`;
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
