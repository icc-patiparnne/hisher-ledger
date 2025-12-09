'use client';

import {
  TFileSystemItem,
  addFileOrFolder,
  convertToFileTreeItem,
  deleteFileOrFolder,
  findFileByName,
  findItemByName,
  getFileLanguage,
  getItemPath,
  renameFileOrFolder,
} from '@platform/utils';
import { FilePlus, FolderPlus } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '../button';
import { FileTree, TFileTreeActions, TFileTreeItem } from '../file-tree';
import { Input } from '../input';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import { CodeEditor, TCodeEditorProps } from './code-editor';

export type TMultiCodeEditorProps = {
  files: TFileSystemItem[];
  onFileChange?: (file: TFileSystemItem, content: string) => void;
  onModifiedFilesChange?: (modifiedFiles: TFileSystemItem[]) => void;
  onAllFilesChange?: (allFiles: TFileSystemItem[]) => void;
  onFileCreate?: (file: TFileSystemItem, parentPath: string) => void;
  onFileDelete?: (path: string) => void;
  onFileRename?: (oldPath: string, newName: string) => void;
} & Omit<TCodeEditorProps, 'withBorders' | 'defaultValue' | 'value'>;

export function MultiCodeEditor({
  files,
  isReadonly,
  isDark,
  onFileChange,
  onModifiedFilesChange,
  onAllFilesChange,
  onFileCreate,
  onFileDelete,
  onFileRename,
}: TMultiCodeEditorProps) {
  const [_, setOriginalFiles] = useState<TFileSystemItem[]>(files);
  const [editableFiles, setEditableFiles] = useState<TFileSystemItem[]>(files);
  const [selectedFile, setSelectedFile] = useState<TFileSystemItem | null>(
    null
  );
  const [selectedFolder, setSelectedFolder] = useState<TFileTreeItem | null>(
    null
  );
  const [createFilePopoverOpen, setCreateFilePopoverOpen] = useState(false);
  const [createFolderPopoverOpen, setCreateFolderPopoverOpen] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const modifiedFilesRef = useRef<Map<string, TFileSystemItem>>(new Map());

  // Update files when props change, but preserve modifications
  useEffect(() => {
    setOriginalFiles(files);

    // Merge new files with existing modifications
    const mergeFilesWithModifications = (
      newFiles: TFileSystemItem[]
    ): TFileSystemItem[] =>
      newFiles.map((file) => {
        // Check if this file has been modified
        const modifiedFile = modifiedFilesRef.current.get(file.name);
        if (modifiedFile) {
          // Use the modified version but update other properties from new file
          return { ...file, content: modifiedFile.content };
        }

        // If file has children, recursively merge them
        if (file.children) {
          return {
            ...file,
            children: mergeFilesWithModifications(file.children),
          };
        }

        return file;
      });

    const mergedFiles = mergeFilesWithModifications(files);
    setEditableFiles(mergedFiles);

    // Notify parent about all files (including modifications)
    onAllFilesChange?.(mergedFiles);
  }, [files, onAllFilesChange]);

  // Convert to file tree format - memoized to avoid recalculation on every render
  const fileTree = useMemo(
    () => editableFiles.map(convertToFileTreeItem),
    [editableFiles]
  );

  // Set default selected file to first file found
  useEffect(() => {
    if (!selectedFile && editableFiles.length > 0) {
      const firstFile =
        editableFiles.find((file) => file.type === 'file') ||
        editableFiles
          .flatMap((file) => file.children || [])
          .find((child) => child.type === 'file');

      if (firstFile) {
        setSelectedFile(firstFile);
      }
    }
  }, [selectedFile, editableFiles]);

  const handleFileSelect = useCallback(
    (fileTreeItem: TFileTreeItem) => {
      // Only handle file selection for actual files, not folders
      if (fileTreeItem.type !== 'file') return;

      // Find by name only - this should be sufficient since file names should be unique within their scope
      const foundFile = findFileByName(editableFiles, fileTreeItem.name);

      if (foundFile) {
        setSelectedFile(foundFile);
        // Clear folder selection when a file is selected
        setSelectedFolder(null);
      }
    },
    [editableFiles]
  );

  const handleCodeChange = useCallback(
    (newContent: string) => {
      if (!selectedFile || isReadonly) return;

      // Update the file content in the editable files state
      const updateFileContent = (items: TFileSystemItem[]): TFileSystemItem[] =>
        items.map((item) => {
          if (item === selectedFile) {
            const updatedFile = { ...item, content: newContent };
            // Notify parent component
            onFileChange?.(updatedFile, newContent);

            return updatedFile;
          }
          if (item.children) {
            return { ...item, children: updateFileContent(item.children) };
          }

          return item;
        });

      const updatedFiles = updateFileContent(editableFiles);
      setEditableFiles(updatedFiles);

      // Update selected file reference
      const updatedSelectedFile = { ...selectedFile, content: newContent };
      setSelectedFile(updatedSelectedFile);

      // Track modifications only if not read-only
      if (!isReadonly) {
        modifiedFilesRef.current.set(selectedFile.name, updatedSelectedFile);

        // Convert map to array and notify parent component
        const modifiedFilesArray = Array.from(
          modifiedFilesRef.current.values()
        );
        onModifiedFilesChange?.(modifiedFilesArray);

        // Also notify about all files with current state
        onAllFilesChange?.(updatedFiles);
      }
    },
    [
      selectedFile,
      isReadonly,
      editableFiles,
      onFileChange,
      onModifiedFilesChange,
      onAllFilesChange,
    ]
  );

  // Helper to get the target parent path for creating new items
  const getTargetParentPath = useCallback((): string => {
    // If a folder is explicitly selected, use it
    if (selectedFolder) {
      return getItemPath(editableFiles, selectedFolder as any) || '';
    }

    // If a file is selected, determine its parent folder
    if (selectedFile) {
      const selectedPath = getItemPath(editableFiles, selectedFile);
      if (selectedPath) {
        // If path contains '/', extract parent folder path
        const lastSlashIndex = selectedPath.lastIndexOf('/');
        if (lastSlashIndex > -1) {
          return selectedPath.substring(0, lastSlashIndex);
        }
      }
    }

    // Default to root
    return '';
  }, [selectedFolder, selectedFile, editableFiles]);

  // Helper to get the display name of the target parent - memoized
  const targetParentDisplayName = useMemo((): string | null => {
    const parentPath = getTargetParentPath();
    if (!parentPath) return null;

    // Get the last segment of the path for display
    const segments = parentPath.split('/');
    const displayName = segments[segments.length - 1];

    return displayName || null;
  }, [getTargetParentPath]);

  const handleCreateFile = useCallback(() => {
    if (!newFileName.trim()) return;

    const parentPath = getTargetParentPath();

    const newFile: TFileSystemItem = {
      name: newFileName.trim(),
      type: 'file',
      content: '',
      language: getFileLanguage(newFileName.trim()),
    };

    const updatedFiles = addFileOrFolder(editableFiles, parentPath, newFile);
    setEditableFiles(updatedFiles);
    onAllFilesChange?.(updatedFiles);
    onFileCreate?.(newFile, parentPath);

    // Select the newly created file
    const createdFile = findFileByName(updatedFiles, newFile.name);
    if (createdFile) {
      setSelectedFile(createdFile);
    }

    // Reset state
    setCreateFilePopoverOpen(false);
    setNewFileName('');
  }, [
    newFileName,
    getTargetParentPath,
    editableFiles,
    onAllFilesChange,
    onFileCreate,
  ]);

  const handleCreateFolder = useCallback(() => {
    if (!newFolderName.trim()) return;

    const parentPath = getTargetParentPath();

    const newFolder: TFileSystemItem = {
      name: newFolderName.trim(),
      type: 'folder',
      children: [],
    };

    const updatedFiles = addFileOrFolder(editableFiles, parentPath, newFolder);
    setEditableFiles(updatedFiles);
    onAllFilesChange?.(updatedFiles);
    onFileCreate?.(newFolder, parentPath);

    // Reset state
    setCreateFolderPopoverOpen(false);
    setNewFolderName('');
  }, [
    newFolderName,
    getTargetParentPath,
    editableFiles,
    onAllFilesChange,
    onFileCreate,
  ]);

  const handleFolderSelect = useCallback((folderTreeItem: TFileTreeItem) => {
    if (folderTreeItem.type === 'folder') {
      setSelectedFolder(folderTreeItem);
    }
  }, []);

  const handleTreeItemRename = useCallback(
    (treeItem: TFileTreeItem, newName: string) => {
      // Find the actual item in the file tree (works for both files and folders)
      const item = findItemByName(editableFiles, treeItem.name);
      if (!item) return;

      const path = getItemPath(editableFiles, item);
      if (!path) return;

      const updatedFiles = renameFileOrFolder(editableFiles, path, newName);
      setEditableFiles(updatedFiles);
      onAllFilesChange?.(updatedFiles);
      onFileRename?.(path, newName);

      // Update selected file if it's the one being renamed
      if (selectedFile && selectedFile.name === item.name) {
        const renamedFile = findFileByName(updatedFiles, newName);
        if (renamedFile) {
          setSelectedFile(renamedFile);
        }
      }
    },
    [editableFiles, selectedFile, onAllFilesChange, onFileRename]
  );

  const handleTreeItemDelete = useCallback(
    (treeItem: TFileTreeItem) => {
      // Find the actual item in the file tree (works for both files and folders)
      const item = findItemByName(editableFiles, treeItem.name);
      if (!item) return;

      const path = getItemPath(editableFiles, item);
      if (!path) return;

      // Delete the item (will delete folder and all its contents)
      const updatedFiles = deleteFileOrFolder(editableFiles, path);
      setEditableFiles(updatedFiles);
      onAllFilesChange?.(updatedFiles);
      onFileDelete?.(path);

      // Clear selection if the deleted item (or any file inside a deleted folder) is selected
      if (selectedFile) {
        // Check if selected file is the deleted item or inside the deleted folder
        const selectedPath = getItemPath(editableFiles, selectedFile);
        if (selectedPath?.startsWith(path)) {
          setSelectedFile(null);
        }
      }
    },
    [editableFiles, selectedFile, onAllFilesChange, onFileDelete]
  );

  const treeActions: TFileTreeActions = useMemo(
    () => ({
      onRename: handleTreeItemRename,
      onDelete: handleTreeItemDelete,
    }),
    [handleTreeItemRename, handleTreeItemDelete]
  );

  return (
    <div
      className={`not-prose flex h-full border border-border rounded-lg overflow-hidden`}
    >
      {/* File Tree Panel */}
      <div className="w-80 bg-background border-r border-border shrink-0 flex flex-col">
        <div className="flex p-3 items-center justify-between border-b border-border h-12 shrink-0">
          <h3 className="text-sm font-medium text-foreground">Files</h3>
          {!isReadonly && (
            <div className="flex gap-1">
              <Popover
                open={createFilePopoverOpen}
                onOpenChange={setCreateFilePopoverOpen}
              >
                <PopoverTrigger className="size-7 -mr-2" size="sm" asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setNewFileName('')}
                    title="New File"
                    className="bg-transparent hover:bg-transparent"
                  >
                    <FilePlus className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent size="sm" className="w-64 p-3" align="start">
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      Create new file
                      {targetParentDisplayName &&
                        ` in ${targetParentDisplayName}`}
                    </p>
                    <Input
                      type="text"
                      size="sm"
                      value={newFileName}
                      onChange={(e) => setNewFileName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleCreateFile();
                        } else if (e.key === 'Escape') {
                          setCreateFilePopoverOpen(false);
                          setNewFileName('');
                        }
                      }}
                      placeholder="file.txt"
                      autoFocus
                    />
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCreateFilePopoverOpen(false);
                          setNewFileName('');
                        }}
                      >
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleCreateFile}>
                        Create
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <Popover
                open={createFolderPopoverOpen}
                onOpenChange={setCreateFolderPopoverOpen}
              >
                <PopoverTrigger className="size-7" size="sm" asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setNewFolderName('')}
                    title="New Folder"
                    className="bg-transparent hover:bg-transparent"
                  >
                    <FolderPlus className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent size="sm" className="w-64 p-3" align="start">
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">
                      Create new folder
                      {targetParentDisplayName &&
                        ` in ${targetParentDisplayName}`}
                    </p>
                    <Input
                      type="text"
                      size="sm"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleCreateFolder();
                        } else if (e.key === 'Escape') {
                          setCreateFolderPopoverOpen(false);
                          setNewFolderName('');
                        }
                      }}
                      placeholder="folder-name"
                      autoFocus
                    />
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCreateFolderPopoverOpen(false);
                          setNewFolderName('');
                        }}
                      >
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleCreateFolder}>
                        Create
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {fileTree.length > 0 ? (
            <FileTree
              fileTree={fileTree}
              onFileSelect={handleFileSelect}
              onFolderSelect={handleFolderSelect}
              selectedFile={
                selectedFile ? convertToFileTreeItem(selectedFile) : null
              }
              actions={treeActions}
              isReadonly={isReadonly}
            />
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              <p className="text-sm">No files found</p>
            </div>
          )}
        </div>
      </div>

      {/* Code Editor Panel */}
      <div
        className="w-full bg-background dark:bg-emerald-700 flex flex-col overflow-hidden"
        key={selectedFile?.name || 'no-file'}
      >
        {selectedFile ? (
          <>
            {/* File Header */}
            <div className="px-4 py-3 border-b bg-background border-border h-12">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">
                  {selectedFile.name}
                </span>
                {selectedFile.language && (
                  <span className="text-xs px-2 py-1 text-accent-foreground bg-accent rounded">
                    {selectedFile.language}
                  </span>
                )}
              </div>
            </div>

            {/* Code Editor */}
            <div className="flex-1 overflow-y-auto">
              <CodeEditor
                value={selectedFile.content || ''}
                language={selectedFile.language}
                onChange={handleCodeChange}
                isReadonly={isReadonly}
                isDark={isDark}
                adaptiveHeight={false}
                withBorders={false}
                key={selectedFile.name} // Force re-render when file changes
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <p className="text-sm">
                Select a file from the tree to view its content
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
