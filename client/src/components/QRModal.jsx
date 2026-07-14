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

        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

            <div className="bg-white rounded-xl shadow-xl p-8 w-[90%] max-w-md">

                <h2 className="text-2xl font-bold text-center mb-6">

                    {title}

                </h2>

                <div className="flex justify-center">

                    <QRCodeCanvas
                        id="qrCanvas"
                        value={value}
                        size={250}
                        includeMargin={true}
                    />

                </div>

                <p className="text-center mt-4 font-semibold">

                    {value}

                </p>

                <div className="flex gap-3 mt-8">

                    <button
                        onClick={downloadQR}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
                    >
                        Download
                    </button>

                    <button
                        onClick={onClose}
                        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg"
                    >
                        Close
                    </button>

                </div>

            </div>

        </div>

    );

}

export default QRModal;