#!/usr/bin/env node
/**
 * Build a versioned PDF for the Potato thesis.
 *
 * Reads the version from the badge in thesis/index.html (e.g. "Version 0.16 | Working Draft")
 * and writes thesis_v0.16.pdf next to it. Loads the page in headless Chromium with the
 * @media print rules in style.css and adds a serif-styled page-number footer.
 *
 * Usage:
 *   node tools/build-thesis-pdf.js                # detect version from index.html
 *   node tools/build-thesis-pdf.js 0.16           # force version
 */

const path = require("path");
const fs = require("fs");
const puppeteer = require("puppeteer");

const REPO = path.resolve(__dirname, "..");
const THESIS_DIR = path.join(REPO, "thesis");
const THESIS_HTML = path.join(THESIS_DIR, "index.html");

function detectVersion() {
    const html = fs.readFileSync(THESIS_HTML, "utf8");
    const m = html.match(/Version\s+(\d+\.\d+(?:\.\d+)?)\s*\|/);
    if (!m) {
        throw new Error("could not detect Version badge in thesis/index.html");
    }
    return m[1];
}

function detectTitle() {
    const html = fs.readFileSync(THESIS_HTML, "utf8");
    const m = html.match(/<h1>([^<]+)<\/h1>/);
    return m ? m[1].trim() : "Geometric Affective State Representation";
}

(async () => {
    const version = process.argv[2] || detectVersion();
    const title = detectTitle();
    const outPath = path.join(THESIS_DIR, `thesis_v${version}.pdf`);
    const fileUrl = "file://" + THESIS_HTML;
    const today = new Date().toISOString().slice(0, 10);

    console.log(`Rendering thesis v${version} -> ${path.basename(outPath)}`);

    const browser = await puppeteer.launch({
        headless: "new",
        args: ["--no-sandbox"],
    });

    try {
        const page = await browser.newPage();
        await page.emulateMediaType("print");
        await page.goto(fileUrl, { waitUntil: "networkidle0", timeout: 60000 });

        const headerTemplate = `<div style="font-family: Georgia, 'Times New Roman', serif; font-size: 8pt; color: #555; width: 100%; padding: 0 0.85in; display: flex; justify-content: space-between; -webkit-print-color-adjust: exact;">
            <span style="font-style: italic;">${title.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</span>
            <span>v${version}</span>
        </div>`;

        const footerTemplate = `<div style="font-family: Georgia, 'Times New Roman', serif; font-size: 9pt; color: #555; width: 100%; padding: 0 0.85in; display: flex; justify-content: space-between; -webkit-print-color-adjust: exact;">
            <span>${today}</span>
            <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
        </div>`;

        await page.pdf({
            path: outPath,
            format: "Letter",
            printBackground: false,
            displayHeaderFooter: true,
            headerTemplate,
            footerTemplate,
            margin: {
                top: "0.95in",
                right: "0.85in",
                bottom: "0.85in",
                left: "0.85in",
            },
            preferCSSPageSize: false,
        });

        const bytes = fs.statSync(outPath).size;
        console.log(`${path.basename(outPath)}  ${(bytes / 1024).toFixed(1)} KB`);
    } finally {
        await browser.close();
    }
})();
