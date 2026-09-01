const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const logoDir = path.join(__dirname, "public", "Logo");

async function convertPngToWebp() {
  const files = fs.readdirSync(logoDir).filter((f) => f.endsWith(".png"));

  for (const file of files) {
    const inputPath = path.join(logoDir, file);
    const outputPath = path.join(logoDir, file.replace(".png", ".webp"));

    await sharp(inputPath).webp({ quality: 90 }).toFile(outputPath);

    console.log(`✅ ${file} → ${file.replace(".png", ".webp")}`);
  }

  console.log("\nDone! All PNG files converted to WebP.");
}

convertPngToWebp().catch(console.error);
