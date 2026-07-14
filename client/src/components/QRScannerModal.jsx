import { Scanner } from "@yudiel/react-qr-scanner";

function QRScannerModal({ open, onClose, onScan }) {

    if (!open) return null;

    return (

        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

            <div className="bg-white rounded-xl shadow-xl p-5 w-[95%] max-w-md">

                <h2 className="text-2xl font-bold mb-4 text-center">

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
                    className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg"
                >

                    Cancel

                </button>

            </div>

        </div>

    );

}

export default QRScannerModal;