import { Scanner } from "@yudiel/react-qr-scanner";

function QRScannerModal({ open, onClose, onScan }) {

    if (!open) return null;

    return (

            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">

                <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6">

                    <h2 className="mb-4 text-center text-2xl font-semibold tracking-tight text-slate-950">

                    Scan QR Code

                </h2>

                <Scanner
                    constraints={{
                        facingMode: "environment"
                    }}
                    onScan={(results) => {

                        if (!results || results.length === 0) return;

                        const value = results[0].rawValue;

                        onScan(value);

                        onClose();

                    }}
                    onError={(error) => {
                        console.error(error);
                    }}
                />

                <button
                    onClick={onClose}
                    className="mt-4 w-full rounded-xl bg-rose-600 py-3 text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-rose-700 hover:shadow-md"
                >

                    Cancel

                </button>

            </div>

        </div>

    );

}

export default QRScannerModal;