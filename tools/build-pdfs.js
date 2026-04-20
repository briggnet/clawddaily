#!/usr/bin/env node
/**
 * Build PDFs for every paper HTML under papers/.
 *
 * HTML is the source of truth. Styling is driven by @media print in
 * style.css. This script loads each file:// page in headless
 * Chromium, waits for render, emits a Letter-sized PDF next to it.
 *
 * Usage:
 *   node tools/build-pdfs.js                 # all papers/*.html
 *   node tools/build-pdfs.js centroid-model  # single paper by basename
 */

const path = require("path");
const fs = require("fs");
const puppeteer = require("puppeteer");

const REPO = path.resolve(__dirname, "..");
const PAPERS_DIR = path.join(REPO, "papers");

async function renderOne(browser, htmlPath) {
    const pdfPath = htmlPath.replace(/\.html$/i, ".pdf");
    const fileUrl = "file://" + htmlPath;

    const page = await browser.newPage();
    await page.emulateMediaType("print");
    await page.goto(fileUrl, { waitUntil: "networkidle0", timeout: 60000 });

    await page.pdf({
        path: pdfPath,
        format: "Letter",
        printBackground: false,
        margin: {
            top: "0.75in",
            right: "0.85in",
            bottom: "0.75in",
            left: "0.85in",
        },
        preferCSSPageSize: true,
    });

    await page.close();
    const bytes = fs.statSync(pdfPath).size;
    console.log(
        `${path.basename(pdfPath).padEnd(38)}  ${(bytes / 1024).toFixed(1)} KB`
    );
}

(async () => {
    const arg = process.argv[2];
    let targets;
    if (arg) {
        const base = arg.replace(/\.html$/, "");
        const p = path.join(PAPERS_DIR, base + ".html");
        if (!fs.existsSync(p)) {
            console.error(`not found: ${p}`);
            process.exit(1);
        }
        targets = [p];
    } else {
        targets = fs
            .readdirSync(PAPERS_DIR)
            .filter((f) => f.endsWith(".html") && !f.startsWith("index"))
            .map((f) => path.join(PAPERS_DIR, f))
            .sort();
    }

    console.log(`Rendering ${targets.length} PDF(s)...`);
    const browser = await puppeteer.launch({
        headless: "new",
        args: ["--no-sandbox"],
    });
    try {
        for (const t of targets) {
            try {
                await renderOne(browser, t);
            } catch (e) {
                console.error(`FAIL ${path.basename(t)}: ${e.message}`);
            }
        }
    } finally {
        await browser.close();
    }
    console.log("done.");
})();
