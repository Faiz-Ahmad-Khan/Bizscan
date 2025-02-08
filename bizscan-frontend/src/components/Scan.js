import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Scan.css";

const Scan = () => {
  const [qrCode, setQrCode] = useState(null);
  
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.id) {
      axios
        .get(`http://localhost:8080/profile/${storedUser.id}/qrcode`, {
          responseType: "arraybuffer",
        })
        .then((response) => {
          const imageBase64 = btoa(
            new Uint8Array(response.data).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ""
            )
          );
          setQrCode(`data:image/png;base64,${imageBase64}`);
        })
        .catch((error) => console.error("Error fetching QR Code:", error));
    }
  }, []);

  const handleDownloadQR = () => {
    const link = document.createElement("a");
    link.href = qrCode;
    link.download = "profile_qr.png";
    link.click();
  };

  return (
    <div className="scan-container">
      <h2>Your Profile QR Code</h2>
      {qrCode ? <img src={qrCode} alt="QR Code" className="qr-image" /> : <p>Loading QR Code...</p>}
      <button className="download-button" onClick={handleDownloadQR}>
        Download QR Code
      </button>
    </div>
  );
};

export default Scan;
