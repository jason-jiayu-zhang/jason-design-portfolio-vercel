import fs from 'fs';
import path from 'path';

const WORKSPACE_DIR = process.cwd();
const PROJECTS_DIR = path.join(WORKSPACE_DIR, 'public/images/projects');
const EXPERIMENTS_DIR = path.join(WORKSPACE_DIR, 'public/images/experiments');

// Import sharp
const sharp = (await import('sharp')).default;

async function compressImage(filePath, outputDir, maxWidth, quality = 80) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.webp' || ext === '.gitkeep') return;

  const fileNameWithoutExt = path.basename(filePath, ext);
  const outputPath = path.join(outputDir, `${fileNameWithoutExt}.webp`);

  console.log(`Processing: ${path.basename(filePath)} -> ${fileNameWithoutExt}.webp`);

  try {
    const pipeline = sharp(filePath);
    const metadata = await pipeline.metadata();

    // Only resize if the width is greater than maxWidth
    if (metadata.width > maxWidth) {
      pipeline.resize(maxWidth);
    }

    await pipeline
      .webp({ quality })
      .toFile(outputPath);

    console.log(`Successfully compressed and saved to ${outputPath}`);
    
    // Remove the original raw image from the public folder to prevent duplicate commits
    fs.unlinkSync(filePath);
    console.log(`Removed original file: ${filePath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

async function run() {
  console.log('Starting image compression in workspace directories...');
  
  // Process Projects
  if (fs.existsSync(PROJECTS_DIR)) {
    const files = fs.readdirSync(PROJECTS_DIR);
    for (const file of files) {
      const fullPath = path.join(PROJECTS_DIR, file);
      if (fs.statSync(fullPath).isFile()) {
        await compressImage(fullPath, PROJECTS_DIR, 1920, 80);
      }
    }
  }

  // Process Experiments
  if (fs.existsSync(EXPERIMENTS_DIR)) {
    const files = fs.readdirSync(EXPERIMENTS_DIR);
    for (const file of files) {
      const fullPath = path.join(EXPERIMENTS_DIR, file);
      if (fs.statSync(fullPath).isFile()) {
        await compressImage(fullPath, EXPERIMENTS_DIR, 1200, 80);
      }
    }
  }

  console.log('Image compression completed!');
}

run().catch(console.error);
