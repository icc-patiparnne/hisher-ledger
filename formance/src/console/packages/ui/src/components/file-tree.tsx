'use client';

import {
  ChevronRight,
  FileIcon,
  FolderIcon,
  Pencil,
  Trash2,
} from 'lucide-react';
import { memo, useState } from 'react';

type TFileLanguage = TCodeEditorLang | 'numscript';

import { Button } from './button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './collapsible';
import { TCodeEditorLang } from './editor/shiki/shiki';
import { Input } from './input';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

export type TFileTreeItem = {
  name: string;
  type: 'folder' | 'file';
  children?: TFileTreeItem[];
  content?: string; // File content for when type is 'file'
  language?: TFileLanguage;
  onClick?: (item: TFileTreeItem) => void; // Click handler for files
  canDelete?: boolean; // If false, the delete button will not be shown (defaults to true)
  canRename?: boolean; // If false, the rename button will not be shown (defaults to true)
};

export type TFileTreeActions = {
  onRename?: (item: TFileTreeItem, newName: string) => void;
  onDelete?: (item: TFileTreeItem) => void;
};

function FileTree({
  fileTree,
  onFileSelect,
  onFolderSelect,
  selectedFile,
  actions,
  isReadonly,
}: {
  fileTree: TFileTreeItem[];
  onFileSelect?: (item: TFileTreeItem) => void;
  onFolderSelect?: (item: TFileTreeItem) => void;
  selectedFile?: TFileTreeItem | null;
  actions?: TFileTreeActions;
  isReadonly?: boolean;
}) {
  return (
    <div className="bg-background p-4">
      <div className="w-full -ml-4">
        {fileTree.map((treeItem) => (
          <FileTreeItem
            key={treeItem.name}
            {...treeItem}
            onFileSelect={onFileSelect}
            onFolderSelect={onFolderSelect}
            selectedFile={selectedFile}
            actions={actions}
            isReadonly={isReadonly}
          />
        ))}
      </div>
    </div>
  );
}

const FileTreeItem = memo(
  ({
    name,
    type,
    children,
    content,
    onClick,
    onFileSelect,
    onFolderSelect,
    selectedFile,
    actions,
    isReadonly,
    canDelete,
    canRename,
  }: TFileTreeItem & {
    onFileSelect?: (item: TFileTreeItem) => void;
    onFolderSelect?: (item: TFileTreeItem) => void;
    selectedFile?: TFileTreeItem | null;
    actions?: TFileTreeActions;
    isReadonly?: boolean;
  }) => {
    // Hooks must be at the top level
    const [renamePopoverOpen, setRenamePopoverOpen] = useState(false);
    const [newName, setNewName] = useState(name);

    const handleFileClick = () => {
      const fileItem = { name, type, children, content, onClick };
      onFileSelect?.(fileItem);
      onClick?.(fileItem);
    };

    const handleFolderClick = (e: React.MouseEvent) => {
      // Only trigger folder select when clicking on the folder icon/name, not the chevron
      if ((e.target as HTMLElement).closest('.folder-name')) {
        const folderItem = { name, type, children, content, onClick };
        onFolderSelect?.(folderItem);
      }
    };

    const handleRename = () => {
      if (newName.trim() && newName !== name) {
        actions?.onRename?.(
          { name, type, children, content, onClick },
          newName.trim()
        );
      }
      setRenamePopoverOpen(false);
      setNewName(name);
    };

    if (type === 'file') {
      const isSelected =
        selectedFile?.name === name && selectedFile?.type === type;

      // Check if delete and rename are allowed (defaults to true if not specified)
      const canDeleteFile = canDelete !== false;
      const canRenameFile = canRename !== false;

      return (
        <div
          className={`group flex text-sm items-center gap-2 pl-10 h-7 cursor-pointer hover:bg-accent-foreground/5 rounded transition-colors ${
            isSelected ? 'bg-accent-foreground/5' : ''
          }`}
        >
          <div
            className="flex items-center gap-2 flex-1 min-w-0"
            onClick={handleFileClick}
          >
            <FileIcon className="h-4 w-4 shrink-0" />
            <span className="truncate">{name}</span>
          </div>
          {!isReadonly && actions && (canRenameFile || canDeleteFile) && (
            <div className="opacity-0 group-hover:opacity-100 flex items-center shrink-0">
              {canRenameFile && (
                <Popover
                  open={renamePopoverOpen}
                  onOpenChange={setRenamePopoverOpen}
                >
                  <PopoverTrigger className="size-7 -mr-2" size="sm" asChild>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setNewName(name);
                      }}
                      title="Rename"
                      className="bg-transparent hover:bg-transparent"
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent size="sm" className="w-64 p-3" align="start">
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">
                        Rename file
                      </p>
                      <Input
                        type="text"
                        size="sm"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleRename();
                          } else if (e.key === 'Escape') {
                            setRenamePopoverOpen(false);
                            setNewName(name);
                          }
                        }}
                        autoFocus
                      />
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setRenamePopoverOpen(false);
                            setNewName(name);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button size="sm" onClick={handleRename}>
                          Rename
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
              {canDeleteFile && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    actions.onDelete?.({
                      name,
                      type,
                      children,
                      content,
                      onClick,
                    });
                  }}
                  className="bg-transparent hover:bg-transparent hover:text-destructive-foreground"
                  title="Delete"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          )}
        </div>
      );
    }

    // Check if delete and rename are allowed for folders (defaults to true if not specified)
    const canDeleteFolder = canDelete !== false;
    const canRenameFolder = canRename !== false;

    return (
      <Collapsible className="pl-4 group/folder">
        <CollapsibleTrigger className="w-full group flex items-center gap-2 h-7">
          <ChevronRight className="h-4 w-4 group-data-[state=open]:rotate-90 transition-transform shrink-0" />
          <span
            className="folder-name flex items-center gap-2 text-sm hover:text-foreground/80 flex-1 min-w-0"
            onClick={handleFolderClick}
          >
            <FolderIcon className="h-4 w-4 fill-current shrink-0" />
            <span className="truncate">{name}</span>
          </span>
          {!isReadonly && actions && (canRenameFolder || canDeleteFolder) && (
            <div className="opacity-0 group-hover/folder:opacity-100 flex items-center shrink-0">
              {canRenameFolder && (
                <Popover
                  open={renamePopoverOpen}
                  onOpenChange={setRenamePopoverOpen}
                >
                  <PopoverTrigger className="size-7 -mr-2" size="sm" asChild>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setNewName(name);
                      }}
                      title="Rename"
                      className="bg-transparent hover:bg-transparent"
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent size="sm" className="w-64 p-3" align="start">
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">
                        Rename folder
                      </p>
                      <Input
                        type="text"
                        size="sm"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleRename();
                          } else if (e.key === 'Escape') {
                            setRenamePopoverOpen(false);
                            setNewName(name);
                          }
                        }}
                        autoFocus
                      />
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setRenamePopoverOpen(false);
                            setNewName(name);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button size="sm" onClick={handleRename}>
                          Rename
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
              {canDeleteFolder && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    actions.onDelete?.({
                      name,
                      type,
                      children,
                      content,
                      onClick,
                    });
                  }}
                  className="bg-transparent hover:bg-transparent hover:text-destructive-foreground"
                  title="Delete"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          )}
        </CollapsibleTrigger>
        <CollapsibleContent>
          {children?.map((child) => (
            <FileTreeItem
              key={child.name}
              {...child}
              onFileSelect={onFileSelect}
              onFolderSelect={onFolderSelect}
              selectedFile={selectedFile}
              actions={actions}
              isReadonly={isReadonly}
            />
          ))}
        </CollapsibleContent>
      </Collapsible>
    );
  }
);

FileTreeItem.displayName = 'FileTreeItem';

export { FileTree };
