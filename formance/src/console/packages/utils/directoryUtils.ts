// Types for the file system structure
// To keep in sync with the languages inside the CodeEditor component
type TFileLanguage =
  | 'typescript'
  | 'yaml'
  | 'json'
  | 'bash'
  | 'plaintext'
  | 'numscript'
  | 'markdown';

export type TFileSystemItem = {
  name: string;
  type: 'file' | 'folder';
  content?: string;
  language?: TFileLanguage;
  children?: TFileSystemItem[];
  canDelete?: boolean; // If false, the delete button will not be shown (defaults to true)
  canRename?: boolean; // If false, the rename button will not be shown (defaults to true)
};

/**
 * Convert a TFileSystemItem to a format compatible with FileTree component
 * @param item - File system item to convert
 * @returns Converted item compatible with FileTree
 */
export function convertToFileTreeItem(item: TFileSystemItem): any {
  return {
    name: item.name,
    type: item.type,
    content: item.content,
    language: item.language,
    children: item.children?.map(convertToFileTreeItem),
    canDelete: item.canDelete,
    canRename: item.canRename,
  };
}

/**
 * Determine the appropriate language for syntax highlighting based on file name
 * @param fileName - The name of the file
 * @returns Language identifier for syntax highlighting
 */
export function getFileLanguage(fileName: string): TFileLanguage {
  if (fileName.endsWith('.yaml') || fileName.endsWith('.yml')) {
    return 'yaml';
  }
  if (fileName === '.secrets') {
    return 'bash'; // .secrets files are typically environment variable format
  }
  if (fileName.endsWith('.json')) {
    return 'json';
  }
  if (fileName.endsWith('.ts') || fileName.endsWith('.tsx')) {
    return 'typescript';
  }
  if (fileName.endsWith('.js') || fileName.endsWith('.jsx')) {
    return 'typescript'; // Use typescript for js files for better syntax highlighting
  }
  if (fileName.endsWith('.num')) {
    return 'numscript'; // Numscript transaction files
  }
  if (fileName.endsWith('.md')) {
    return 'markdown'; // Numscript transaction files
  }

  return 'plaintext';
}

/**
 * Find a file in a file tree by name (recursively searches folders)
 * @param files - Array of file system items to search
 * @param fileName - Name of the file to find
 * @returns The found file item or null
 */
export function findFileByName(
  files: TFileSystemItem[],
  fileName: string
): TFileSystemItem | null {
  for (const file of files) {
    if (file.type === 'file' && file.name === fileName) {
      return file;
    }
    if (file.type === 'folder' && file.children) {
      const found = findFileByName(file.children, fileName);
      if (found) return found;
    }
  }

  return null;
}

/**
 * Find a file or folder by its name (recursively searches through folders)
 * @param files - Array of file system items to search
 * @param itemName - Name of the file or folder to find
 * @returns The found item or null
 */
export function findItemByName(
  files: TFileSystemItem[],
  itemName: string
): TFileSystemItem | null {
  for (const item of files) {
    if (item.name === itemName) {
      return item;
    }
    if (item.type === 'folder' && item.children) {
      const found = findItemByName(item.children, itemName);
      if (found) return found;
    }
  }

  return null;
}

/**
 * Find a file in a file tree by matching name and content
 * @param files - Array of file system items to search
 * @param targetName - Name of the file to find
 * @param targetContent - Content of the file to match
 * @returns The found file item or null
 */
export function findFileInTree(
  files: TFileSystemItem[],
  targetName: string,
  targetContent?: string
): TFileSystemItem | null {
  for (const item of files) {
    if (
      item.type === 'file' &&
      item.name === targetName &&
      item.content === targetContent
    ) {
      return item;
    }
    if (item.children) {
      const found = findFileInTree(item.children, targetName, targetContent);
      if (found) return found;
    }
  }

  return null;
}

/**
 * Find a file or folder by path (e.g., "folder1/folder2/file.txt")
 * @param files - Array of file system items to search
 * @param path - Path to the file/folder (e.g., "folder/file.txt")
 * @returns The found item or null
 */
export function findByPath(
  files: TFileSystemItem[],
  path: string
): TFileSystemItem | null {
  const parts = path.split('/');
  let currentItems = files;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const item = currentItems.find((f) => f.name === part);

    if (!item) return null;
    if (i === parts.length - 1) return item;
    if (item.type === 'folder' && item.children) {
      currentItems = item.children;
    } else {
      return null;
    }
  }

  return null;
}

/**
 * Add a new file or folder to the file tree
 * @param files - Current file tree
 * @param parentPath - Path to the parent folder (empty string for root)
 * @param item - New file or folder to add
 * @returns Updated file tree
 */
export function addFileOrFolder(
  files: TFileSystemItem[],
  parentPath: string,
  item: TFileSystemItem
): TFileSystemItem[] {
  // If adding to root
  if (!parentPath) {
    return [...files, item];
  }

  // Add to a nested folder
  return files.map((file) => {
    if (file.type === 'folder') {
      // Check if this is the parent folder
      if (file.name === parentPath.split('/')[0]) {
        const remainingPath = parentPath.split('/').slice(1).join('/');

        if (!remainingPath) {
          // This is the target parent
          return {
            ...file,
            children: [...(file.children || []), item],
          };
        }

        // Recurse into children
        return {
          ...file,
          children: addFileOrFolder(file.children || [], remainingPath, item),
        };
      }
    }

    return file;
  });
}

/**
 * Delete a file or folder from the file tree
 * @param files - Current file tree
 * @param path - Path to the file/folder to delete
 * @returns Updated file tree
 */
export function deleteFileOrFolder(
  files: TFileSystemItem[],
  path: string
): TFileSystemItem[] {
  const parts = path.split('/');
  const targetName = parts[parts.length - 1];

  // If deleting from root
  if (parts.length === 1) {
    return files.filter((f) => f.name !== targetName);
  }

  // Delete from nested folder
  return files.map((file) => {
    if (file.type === 'folder' && file.name === parts[0]) {
      const remainingPath = parts.slice(1).join('/');

      if (parts.length === 2) {
        // Direct child
        return {
          ...file,
          children: (file.children || []).filter((c) => c.name !== targetName),
        };
      }

      // Recurse into children
      return {
        ...file,
        children: deleteFileOrFolder(file.children || [], remainingPath),
      };
    }

    return file;
  });
}

/**
 * Rename a file or folder in the file tree
 * @param files - Current file tree
 * @param path - Path to the file/folder to rename
 * @param newName - New name for the file/folder
 * @returns Updated file tree
 */
export function renameFileOrFolder(
  files: TFileSystemItem[],
  path: string,
  newName: string
): TFileSystemItem[] {
  const parts = path.split('/');
  const targetName = parts[parts.length - 1];

  // If renaming at root
  if (parts.length === 1) {
    return files.map((f) =>
      f.name === targetName
        ? {
            ...f,
            name: newName,
            language: f.type === 'file' ? getFileLanguage(newName) : undefined,
          }
        : f
    );
  }

  // Rename in nested folder
  return files.map((file) => {
    if (file.type === 'folder' && file.name === parts[0]) {
      const remainingPath = parts.slice(1).join('/');

      if (parts.length === 2) {
        // Direct child
        return {
          ...file,
          children: (file.children || []).map((c) =>
            c.name === targetName
              ? {
                  ...c,
                  name: newName,
                  language:
                    c.type === 'file' ? getFileLanguage(newName) : undefined,
                }
              : c
          ),
        };
      }

      // Recurse into children
      return {
        ...file,
        children: renameFileOrFolder(
          file.children || [],
          remainingPath,
          newName
        ),
      };
    }

    return file;
  });
}

/**
 * Get the path of a file or folder in the tree
 * @param files - File tree to search
 * @param targetItem - Item to find the path for
 * @param currentPath - Current path (used for recursion)
 * @returns Path string (e.g., "folder/subfolder/file.txt") or null
 */
export function getItemPath(
  files: TFileSystemItem[],
  targetItem: TFileSystemItem,
  currentPath: string = ''
): string | null {
  for (const item of files) {
    const itemPath = currentPath ? `${currentPath}/${item.name}` : item.name;

    if (item === targetItem || item.name === targetItem.name) {
      return itemPath;
    }

    if (item.type === 'folder' && item.children) {
      const found = getItemPath(item.children, targetItem, itemPath);
      if (found) return found;
    }
  }

  return null;
}
