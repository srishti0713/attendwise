import Button from "../buttons/Button";

const ConfirmModal = ({ title, message, confirmLabel, confirmClass, onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-6">
            <div className="bg-white border border-[#E2DBF0] rounded-2xl p-6 w-full max-w-sm flex flex-col gap-4">
                <div>
                    <p className="text-base font-bold text-[#1A1A2E] mb-1">{title}</p>
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