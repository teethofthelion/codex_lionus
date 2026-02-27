// CodexLionusViewer v1.2 (local PDF.js, no CDN)

const PDF_URL = "./CODEX_LIONUS_MMXXVI_v04.pdf";

import * as pdfjsLib from "./pdf.mjs";
pdfjsLib.GlobalWorkerOptions.workerSrc = "./pdf.worker.mjs";

const statusEl = document.getElementById("status");
const viewerEl = document.getElementById("viewer");
const downloadLink = document.getElementById("downloadLink");
downloadLink.href = PDF_URL;

function setStatus(msg){ statusEl.textContent = msg; }

async function render(){
  try{
    setStatus("Loading Codex…");
    const pdf = await pdfjsLib.getDocument({ url: PDF_URL }).promise;

    setStatus(`Rendering ${pdf.numPages} pages…`);
    viewerEl.innerHTML = "";

    const maxWidth = Math.min(window.innerWidth - 48, 980);
    const dpr = Math.max(1, window.devicePixelRatio || 1);

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++){
      const page = await pdf.getPage(pageNum);

      const unscaled = page.getViewport({ scale: 1 });
      const scale = maxWidth / unscaled.width;
      const viewport = page.getViewport({ scale });

      const wrap = document.createElement("div");
      wrap.className = "page";

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d", { alpha:false });

      canvas.width  = Math.floor(viewport.width * dpr);
      canvas.height = Math.floor(viewport.height * dpr);
      canvas.style.width  = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      wrap.appendChild(canvas);
      viewerEl.appendChild(wrap);

      await page.render({ canvasContext: ctx, viewport, background:"#ffffff" }).promise;
    }

    setStatus("");
  }catch(err){
    console.error(err);
    setStatus("Load failed. Check file names + module script tag.");
  }
}

render();
