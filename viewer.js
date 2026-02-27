// CodexLionusViewer v1.0
// Renders a PDF into canvases using PDF.js — no browser PDF UI.
// Configure the PDF URL below.

const PDF_URL = "https://www.teethofthelion.com/s/CODEX_LIONUS_MMXXVI_v04.pdf";

// CDN imports (keeps repo tiny)
import * as pdfjsLib from "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.min.mjs";
import pdfjsWorker from "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const statusEl = document.getElementById("status");
const viewerEl = document.getElementById("viewer");
const downloadLink = document.getElementById("downloadLink");
downloadLink.href = PDF_URL;

function setStatus(msg){
  if (!statusEl) return;
  statusEl.textContent = msg;
}

function makePageContainer(pageNumber){
  const div = document.createElement("div");
  div.className = "page";
  div.setAttribute("data-page", String(pageNumber));
  return div;
}

function getScaleForPage(viewport, targetWidth){
  // Fit to a comfortable max width; keep sharpness by rendering at devicePixelRatio
  const cssWidth = Math.min(targetWidth, 980);
  return cssWidth / viewport.width;
}

async function render(){
  try{
    setStatus("Loading Codex…");
    const loadingTask = pdfjsLib.getDocument({
      url: PDF_URL,
      // Avoid credential/cookie issues
      withCredentials: false,
    });
    const pdf = await loadingTask.promise;

    setStatus(`Rendering ${pdf.numPages} pages…`);

    // Clear any old pages
    viewerEl.innerHTML = "";

    const maxWidth = Math.min(window.innerWidth - 48, 980);

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++){
      const page = await pdf.getPage(pageNum);

      const unscaled = page.getViewport({ scale: 1 });
      const scale = getScaleForPage(unscaled, maxWidth);

      const viewport = page.getViewport({ scale });

      const container = makePageContainer(pageNum);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d", { alpha: false });

      // Render at DPR for crisp text
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = Math.floor(viewport.width * dpr);
      canvas.height = Math.floor(viewport.height * dpr);
      canvas.style.width = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      container.appendChild(canvas);
      viewerEl.appendChild(container);

      await page.render({
        canvasContext: ctx,
        viewport,
        background: "#ffffff",
      }).promise;
    }

    setStatus("");
  }catch(err){
    console.error(err);
    setStatus("Could not load the PDF. Check that the PDF URL is public, then refresh.");
  }
}

render();

// Re-render on resize (debounced)
let t = null;
window.addEventListener("resize", () => {
  if (t) clearTimeout(t);
  t = setTimeout(() => render(), 250);
});
