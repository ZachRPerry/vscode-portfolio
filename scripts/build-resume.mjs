import { mdToPdf } from "md-to-pdf";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const input = join(ROOT, "src/files/resume.md");
const output = join(ROOT, "public/Zach-Perry-Resume.pdf");

const css = `
  @page { margin: 0.6in; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    font-size: 10.5pt;
    line-height: 1.45;
    color: #111;
  }
  h1 {
    font-size: 22pt;
    margin: 0 0 2pt 0;
    color: #007acc;
  }
  h2 {
    font-size: 13pt;
    margin: 16pt 0 4pt 0;
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 2pt;
    color: #007acc;
  }
  h3 {
    font-size: 11pt;
    margin: 10pt 0 2pt 0;
  }
  h3 + p em {
    color: #555;
    font-size: 9.5pt;
  }
  p, ul, li { margin: 4pt 0; }
  ul { padding-left: 16pt; }
  li { margin: 2pt 0; }
  a { color: #007acc; text-decoration: none; }
  code { background: #f3f3f3; padding: 1pt 3pt; border-radius: 3px; font-size: 9.5pt; }
  hr { border: none; border-top: 1px solid #ccc; margin: 10pt 0; }
  strong { color: #000; }
`;

console.log(`[build-resume] ${input} → ${output}`);

await mdToPdf(
  { path: input },
  {
    dest: output,
    css,
    pdf_options: {
      format: "Letter",
      printBackground: true,
    },
  }
);

console.log("[build-resume] done");
