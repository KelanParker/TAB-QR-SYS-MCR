import { QRCodeCanvas } from "qrcode.react";

function QRModal({
    open,
    onClose,
    title,
    value
}) {

    if (!open) return null;

    function downloadQR() {

        const canvas = document.getElementById("qrCanvas");

        const url = canvas.toDataURL("image/png");

        const link = document.createElement("a");

        link.download = `${value}.png`;

        link.href = url;

        link.click();

    }

    return (

            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">

                <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">

                    <h2 className="mb-6 text-center text-2xl font-semibold tracking-tight text-slate-950">

                    {title}

                </h2>

                    <div className="flex justify-center rounded-2xl bg-slate-50 p-4">

                    <QRCodeCanvas
                        id="qrCanvas"
                        value={value}
                        size={250}
                        includeMargin={true}
                    />

                </div>

                <div className="mt-8 flex gap-3">

                    <button
                        onClick={downloadQR}
                        className="flex-1 rounded-xl bg-slate-950 py-3 text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md"
                    >
                        Download
                    </button>

                    <button
                        onClick={onClose}
                        className="flex-1 rounded-xl border border-slate-300 bg-white py-3 text-slate-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-md"
                    >
                        Close
                    </button>

                </div>

            </div>

        </div>

    );

}

export default QRModal;