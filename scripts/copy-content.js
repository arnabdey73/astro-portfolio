// scripts/copy-content.js
import { mkdir, cp } from 'node:fs/promises';
import { join } from 'node:path';

async function copyContent() {
  try {
    // Create dist/content directory
    const contentDir = join(process.cwd(), 'dist', 'content');
    await mkdir(contentDir, { recursive: true });

    // Copy content files
    const sourceDir = join(process.cwd(), 'content');
    await cp(sourceDir, contentDir, { recursive: true });

    console.log('Content files copied successfully!');
  } catch (error) {
    console.error('Error copying content:', error);
    process.exit(1);
  }
}

copyContent();
