import Button from "../buttons/Button";

const ConfirmModal = ({
    title,
    message,
    confirmLabel,
    confirmClass,
    onConfirm,
    onCancel,
    variant = "default",
}) => {
    const cardClass =
        variant === "danger"
            ? "bg-[#FFF0F3] border border-[#E88FA8]"
            : "bg-white border border-[#E2DBF0]";

    const titleClass =
        variant === "danger" ? "text-[#7A1530]" : "text-[#1A1A2E]";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-6">
            <div
                className={`${cardClass} rounded-2xl p-6 w-full max-w-sm flex flex-col gap-4`}
            >
                <div>
                    <p className={`text-base font-bold mb-1 ${titleClass}`}>
                        {title}
                    </p>
                    <p className="text-sm text-[#8070AA]">{message}</p>
                </div>
                <div className="flex gap-3">
                    <Button
                        onClick={onCancel}
                        className="flex-1 bg-[#E8E0F8] text-[#4A20C4] border-none rounded-xl py-3 text-sm font-bold"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onConfirm}
                        className={`flex-1 border-none rounded-xl py-3 text-sm font-bold ${confirmClass}`}
                    >
                        {confirmLabel}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
