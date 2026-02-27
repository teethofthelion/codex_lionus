// CodexLionusViewer v1.1 (adblock-friendly)

const PDF_URL = "./CODEX_LIONUS_MMXXVI_v04.pdf";

// Use unpkg instead of jsdelivr (often less blocked)
import * as pdfjsLib from "https://unpkg.com/pdfjs-dist@4.10.38/build/pdf.min.mjs";

// IMPORTANT: set worker as a plain URL (no ?url indirection)
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://unpkg.com/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs";

const statusEl = document.getElementById("status");
const viewerEl = document.getElementById("viewer");
const downloadLink = document.getElementById("downloadLink");
downloadLink.href = PDF_URL;

function setStatus(msg){ statusEl.textContent = msg; }

async function render(){
  try{
    setStatus("Loading Codex…");
    const pdf = await pdfjsLib.getDocument({ url: PDF_URL, withCredentials:false }).promise;

    setStatus(`Rendering ${pdf.numPages} pages…`);
    viewerEl.innerHTML = "";

    const maxWidth = Math.min(window.innerWidth - 48, 980);
    const dpr = Math.max(1, window.devicePixelRatio || 1);

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++){
      const page = await pdf.getPage(pageNum);

      const unscaled = page.getViewport({ scale: 1 });
      const scale = Math.min(maxWidth, 980) / unscaled.width;
      const viewport = page.getViewport({ scale });

      const container = document.createElement("div");
      container.className = "page";

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d", { alpha:false });

      canvas.width  = Math.floor(viewport.width * dpr);
      canvas.height = Math.floor(viewport.height * dpr);
      canvas.style.width  = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      container.appendChild(canvas);
      viewerEl.appendChild(container);

      await page.render({ canvasContext: ctx, viewport, background:"#ffffff" }).promise;
    }

    setStatus("");
  }catch(err){
    console.error(err);
    setStatus("Could not load PDF.js or the PDF. (Adblock/CSP) Try whitelisting the site or use local PDF.js.");
  }
}

render();

let t=null;
window.addEventListener("resize", () => {
  clearTimeout(t);
  t = setTimeout(render, 250);
});
