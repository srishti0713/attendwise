import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useSubject from "../../hooks/useSubject.js";
import { updateSubject } from "../../api/subject.api.js";

const CARD_STYLES = {
    attended: "bg-[#B8E8CC] border border-[#8FD4AA]",
    missed: "bg-[#F5B8C8] border border-[#E88FA8]",
};

const DAYS = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];
const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];
const SHORT_MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

const parseDate = (ds) => {
    const [y, m, d] = ds.split("T")[0].split("-").map(Number);
    return new Date(y, m - 1, d);
};

const toISODate = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const normalizeDate = (raw) => {
    return String(raw).slice(0, 10);
};
const formatMonthKey = (ds) => {
    const d = parseDate(ds);
    return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};
const formatShortDate = (ds) => {
    const d = parseDate(ds);
    return `${d.getDate()} ${SHORT_MONTHS[d.getMonth()]}`;
};
const getDayName = (ds) => DAYS[parseDate(ds).getDay()];

const computeStats = (attendance = []) => {
    let attended = 0,
        total = 0;
    for (const e of attendance) {
        if (e.status === "attended") {
            attended++;
            total++;
        } else if (e.status === "missed") total++;
    }
    return {
        attended,
        total,
        pct: total === 0 ? 0 : Math.round((attended / total) * 100),
    };
};

const AttendanceSummaryCard = ({ attended, total, pct }) => (
    <div className="bg-[#D6CBFA] border border-[#6639ed] text-[#4A20C4] rounded-2xl p-4 w-full max-w-2xl mx-auto">
        <p className="text-xs font-bold uppercase tracking-widest mb-3">
            Attendance
        </p>
        <div className="flex items-center justify-between">
            <div>
                <p className="text-3xl font-bold font-playfair">{pct}%</p>
                <p className="text-sm font-medium mt-4">
                    {attended} / {total} classes attended
                </p>
            </div>
            <div className="text-5xl font-bold font-playfair opacity-10">∑</div>
        </div>
    </div>
);

const PencilIcon = () => (
    <svg
        width="13"
        height="13"
        viewBox="0 0 13 13"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M9.5 1.5a1.414 1.414 0 0 1 2 2L4 11H1.5V8.5L9.5 1.5Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const EntryRow = ({ entry, onEdit }) => {
    const cardStyle = CARD_STYLES[entry.status] ?? CARD_STYLES.missed;
    const isAttended = entry.status === "attended";
    const accent = isAttended ? "#1a7a3c" : "#a0253e";

    return (
        <div
            className={`${cardStyle} rounded-2xl p-4 w-full max-w-2xl mx-auto`}
        >
            <div className="flex items-center gap-4 justify-between">
                <div className="flex items-center gap-3">
                    <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ background: accent }}
                    />
                    <div>
                        <p
                            className="text-[11px] font-bold uppercase tracking-wider"
                            style={{ color: accent }}
                        >
                            {getDayName(entry.date)}
                        </p>
                        <h2 className="text-lg font-semibold text-[#1A1A2E]">
                            {formatShortDate(entry.date)}
                        </h2>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span
                        className="text-[11px] font-bold px-2.5 py-1 rounded-full text-white"
                        style={{ background: accent }}
                    >
                        {isAttended ? "Attended" : "Missed"}
                    </span>
                    <button
                        onClick={() => onEdit(entry)}
                        title="Edit entry"
                        aria-label={`Edit ${formatShortDate(entry.date)}`}
                        className="w-7 h-7 shrink-0 flex items-center justify-center rounded-lg transition-colors"
                        style={{ background: `${accent}22`, color: accent }}
                    >
                        <PencilIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};

const PILL_ACTIVE = {
    all: "bg-[#E8E0F8] text-[#4A20C4] border-[#6639ed]",
    attended: "bg-[#B8E8CC] text-[#1a7a3c] border-[#8FD4AA]",
    missed: "bg-[#F5B8C8] text-[#a0253e] border-[#E88FA8]",
};
const PILL_INACTIVE = "bg-transparent text-[#8070AA] border-[#D6CBFA]";

const FilterPills = ({ active, onChange }) => (
    <div className="flex gap-2 max-w-2xl mx-auto">
        {["all", "attended", "missed"].map((f) => (
            <button
                key={f}
                onClick={() => onChange(f)}
                className={`px-4 py-1.5 rounded-full border-[1.5px] text-sm font-semibold transition-all ${active === f ? PILL_ACTIVE[f] : PILL_INACTIVE}`}
            >
                {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
        ))}
    </div>
);

const MODAL_OPT_STYLES = {
    attended: "bg-[#B8E8CC] border-[#8FD4AA] text-[#1a7a3c]",
    missed: "bg-[#F5B8C8] border-[#E88FA8] text-[#a0253e]",
    off: "bg-[#E8E0F8] border-[#D6CBFA] text-[#4A20C4]",
};
const OPT_LABELS = {
    attended: "✓  Attended",
    missed: "✗  Missed",
    off: "◌  Mark as off day",
};

const EditModal = ({ entry, isPending, error, onSelect, onClose }) => {
    if (!entry) return null;
    return (
        <div
            className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-white rounded-2xl p-6 w-full max-w-xs">
                <p className="text-[15px] font-bold text-[#1A1A2E] mb-1">
                    Edit entry
                </p>
                <p className="text-[13px] text-[#8070AA] mb-4">
                    {getDayName(entry.date)}, {formatShortDate(entry.date)}
                </p>

                {error && (
                    <div className="bg-[#FEF0F0] border border-[#FDDCDC] rounded-xl px-4 py-2.5 mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E57373] shrink-0" />
                        <p className="text-xs font-semibold text-[#C0392B]">
                            {error}
                        </p>
                    </div>
                )}

                <div className="flex flex-col gap-2 mb-4">
                    {["attended", "missed", "off"].map((opt) => (
                        <button
                            key={opt}
                            onClick={() => onSelect(opt)}
                            disabled={isPending}
                            className={`rounded-xl px-4 py-2.5 border-[1.5px] text-sm font-semibold text-left transition-all disabled:opacity-50
                                ${MODAL_OPT_STYLES[opt]}
                                ${entry.status === opt ? "ring-2 ring-[#6639ed]" : ""}`}
                        >
                            {isPending && entry.status === opt
                                ? "Saving…"
                                : OPT_LABELS[opt]}
                        </button>
                    ))}
                </div>

                <button
                    onClick={onClose}
                    disabled={isPending}
                    className="w-full py-2 rounded-xl bg-[#E8E0F8] text-[#4A20C4] text-sm font-semibold hover:bg-[#D6CBFA] transition-colors disabled:opacity-50"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

const BackIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M10 3L5 8L10 13"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const SubjectAttendanceDetail = () => {
    const navigate = useNavigate();
    const { subjectId } = useParams();
    const queryClient = useQueryClient();

    const { data: subject, isLoading } = useSubject(subjectId);

    const [filter, setFilter] = useState("all");
    const [editingEntry, setEditingEntry] = useState(null);
    const [modalError, setModalError] = useState("");

    const attendanceMutation = useMutation({
        mutationFn: ({ subjectId, payload }) =>
            updateSubject(subjectId, payload),
        onSuccess: () => {
            setEditingEntry(null);
            setModalError("");
            queryClient.invalidateQueries({ queryKey: ["subject", subjectId] });
        },
        onError: (err) => {
            setModalError(
                err?.response?.data?.message || "Failed to update attendance",
            );
        },
    });

    const handleSelect = (newStatus) => {
    if (!editingEntry) return;
    attendanceMutation.mutate({
        subjectId,
        payload: {
            attendanceId: editingEntry._id,
            status: newStatus,
        },
    });
};
    const handleOpenModal = (entry) => {
        setModalError("");
        setEditingEntry(entry);
    };

    const handleCloseModal = () => {
        if (attendanceMutation.isPending) return;
        setEditingEntry(null);
        setModalError("");
    };

    const attendance = subject?.attendance ?? [];
    const { attended, total, pct } = computeStats(attendance);

    const visible = attendance
        .filter(
            (e) =>
                e.status !== "off" && (filter === "all" || e.status === filter),
        )
        .map((e) => ({ ...e, date: normalizeDate(e.date) }));

    const grouped = visible.reduce((acc, entry) => {
        const key = formatMonthKey(entry.date);
        (acc[key] ??= []).push(entry);
        return acc;
    }, {});

    return (
        <div className="p-4 pb-24">
            <div className="flex justify-between items-center mb-6 max-w-2xl mx-auto">
                <div className="flex items-center gap-2 min-w-0">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-7 h-7 shrink-0 flex items-center justify-center rounded-lg bg-[#E8E0F8] text-[#6B52B5] hover:bg-[#D6CBFA] hover:text-[#4A20C4] transition-colors"
                        aria-label="Go back"
                    >
                        <BackIcon />
                    </button>
                    <h1 className="font-playfair text-2xl font-bold text-[#1A1A2E] truncate">
                        {subject?.subjectName ?? "Subject"}
                        {subject?.semesterName && (
                            <span className="font-sans text-lg font-semibold text-[#8070AA]">
                                {" "}
                                — {subject.semesterName}
                            </span>
                        )}
                    </h1>
                </div>
            </div>

            {isLoading && (
                <p className="text-center text-[#8070AA] font-medium mt-10">
                    Loading...
                </p>
            )}

            {!isLoading && (
                <>
                    <div className="mb-4">
                        <AttendanceSummaryCard
                            attended={attended}
                            total={total}
                            pct={pct}
                        />
                    </div>

                    <div className="mb-4">
                        <FilterPills active={filter} onChange={setFilter} />
                    </div>

                    {visible.length === 0 && (
                        <p className="text-center text-[#8070AA] font-medium mt-10">
                            No entries to show
                        </p>
                    )}

                    {Object.entries(grouped).map(([monthKey, entries]) => (
                        <div key={monthKey} className="mb-5">
                            <p className="text-[11px] font-bold uppercase tracking-widest text-[#8070AA] mb-2 pl-1 max-w-2xl mx-auto">
                                {monthKey}
                            </p>
                            <div className="flex flex-col gap-3">
                                {entries.map((entry) => (
                                    <EntryRow
                                        key={entry.date}
                                        entry={entry}
                                        onEdit={handleOpenModal}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </>
            )}

            <EditModal
                entry={editingEntry}
                isPending={attendanceMutation.isPending}
                error={modalError}
                onSelect={handleSelect}
                onClose={handleCloseModal}
            />
        </div>
    );
};

export default SubjectAttendanceDetail;
