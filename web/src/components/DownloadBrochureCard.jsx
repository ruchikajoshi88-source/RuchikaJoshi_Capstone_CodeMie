import React, { useEffect, useMemo, useState } from "react";

function useSimulateError() {
  return useMemo(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get("simulate_error") === "true";
    } catch {
      return false;
    }
  }, []);
}

function generateDemoPdfBlob() {
  // Demo binary data that downloads as a pdf file.
  // Note this is not a full PDF generator - just a small demo file.
  const content = [
    "%PDF-1.4\n",
    "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
 ",
    "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
 ",
    "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 300 144] /Contents 4 0 R /Resources << >> >> endobj

 ",
    "4 0 obj << /Length 55 >> stream
",
    "BT
\/F1 18 Tf
72 100 Td
(Tour Brochure - Demo) Tj
ET
stream
endobj

 ",
    "xref
0 5
0000000000 65535 f 
0000000010 00000 n 
0000000060 00000 n 
0000000115 00000 n 
0000000215 00000 n 
trailer << /Size 5 /Root 1 0 R >>
startxref
300
%%EOF
"
  ];
  return new Blob(content, { type: "application/pdf" });
}

export default function DownloadBrochureCard() {
  const simulateError = useSimulateErroror();
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
  }, [simulateError]);

  const onDownload = () => {
    if (simulateError) {
      setError("Unable to generate brochure (demo)");
      return;
    }

    setError("");
    const blob = generateDemoPdfBlob();
    const url = URL.createObjectURL(blob);

    try {
      const a = document.createElement("a");
      a.href = url;
      a.download = "tour-brochure.pdf";
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } finally {
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="card" data-testid="download-brochure-card">
      <div className="card-header">
        <p className="card-title">Download Brochure</p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={onDownload}
          data-testid="download-brochure-button"
        >
          Download
        </button>
      </div>

      <div className="helper" data-testid="download-brochure-helper-text">
        Demo file generated in-browser
      </div>

      {error ? (
        <div className="error" data-testid="download-brochure-error">
          {error}
        </div>
      ) : null}
    </div>
  ); 
}
