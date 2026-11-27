import React, { useState } from "react";

export const BROCHURE_FILENAME = "tour-brochure.pdf";
export const BROCHURE_HELPER_TEXT = "Demo file generated in-browser";
export const BROCHURE_ERROR_TEXT = "Unable to generate brochure (demo)";

function isSimulateErrorEnabled() {
  try {
    return new URLSearchParams(window.location.search).get("simulate_error") === "true";
  } catch {
    return false;
  }
}

export function generateDemoPdfBlob() {
  const stream = "BT /F1 18 Tf 24 72 Td (Tour Brochure - Demo) Tj ET";
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 300 144] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [];
  objects.forEach((body, i) => {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${body}\nendobj\n`;
  });

  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.forEach((o) => {
    pdf += `${String(o).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;

  return new Blob([pdf], { type: "application/pdf" });
}

export default function DownloadBrochureCard() {
  const [error, setError] = useState("");

  const onDownload = () => {
    if (isSimulateErrorEnabled()) {
      setError(BROCHURE_ERROR_TEXT);
      return;
    }

    let url;
    try {
      url = URL.createObjectURL(generateDemoPdfBlob());
      const a = document.createElement("a");
      a.href = url;
      a.download = BROCHURE_FILENAME;
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setError("");
    } catch {
      setError(BROCHURE_ERROR_TEXT);
    } finally {
      if (url) URL.revokeObjectURL(url);
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

      {error ? (
        <div className="error" role="alert" data-testid="download-brochure-error">
          {error}
        </div>
      ) : (
        <div className="helper" data-testid="download-brochure-helper-text">
          {BROCHURE_HELPER_TEXT}
        </div>
      )}
    </div>
  );
}
