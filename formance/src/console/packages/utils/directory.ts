// Server-only utilities for reading directories from the file system
// This file uses Node.js built-in modules (fs/promises) and should only be imported on the server
// WARNING: Do NOT import this file from client code or barrel exports

import type { TFileSystemItem } from './directoryUtils';
import { getFileLanguage } from './directoryUtils';

/**
 * Helper function to recursively read directory structure from the file system
 * WARNING: This is a server-only function that uses Node.js fs module
 * Accepts relative paths from project root (e.g., 'app/routes/organization/apps/examples/car-rental')
 */
export async function readDirectory(
  relativePath: string
): Promise<TFileSystemItem[]> {
  try {
    const fs = await import('fs/promises');
    const path = await import('path');

    // Resolve the full path from project root
    // Handle case where server runs from apps/portal or apps/studio instead of project root
    let basePath = process.cwd();
    if (
      basePath.endsWith('/apps/portal') ||
      basePath.endsWith('/apps/studio')
    ) {
      basePath = path.dirname(path.dirname(basePath));
    }
    const fullPath = path.join(basePath, relativePath);

    const items = await fs.readdir(fullPath, { withFileTypes: true });
    const fileSystemItems: TFileSystemItem[] = [];

    for (const item of items) {
      const itemPath = path.join(fullPath, item.name);

      if (item.isDirectory()) {
        const children = await readDirectory(
          path.join(relativePath, item.name)
        );
        fileSystemItems.push({
          name: item.name,
          type: 'folder',
          children,
        });
      } else if (item.isFile()) {
        const content = await fs.readFile(itemPath, 'utf-8');
        fileSystemItems.push({
          name: item.name,
          type: 'file',
          content,
          language: getFileLanguage(item.name),
        });
      }
    }

    return fileSystemItems.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'folder' ? -1 : 1;
      }

      return a.name.localeCompare(b.name);
    });
  } catch (error) {
    // LINT_EXCEPTION_REASON: Error logging for debugging file system operations
    // eslint-disable-next-line no-console
    console.error(`Error reading directory ${relativePath}:`, error);

    return [];
  }
}
