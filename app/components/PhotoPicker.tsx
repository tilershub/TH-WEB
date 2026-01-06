"use client";

import React from "react";

/**
 * PhotoPicker provides a simple interface for selecting and previewing
 * multiple image files. It enforces a maximum number of files and
 * allows users to remove individual images from the selection. This
 * component does not upload files by itself; it only manages local
 * File objects. Uploading is handled in the parent component when
 * publishing the task.
 */
interface PhotoPickerProps {
  files: File[];
  setFiles: (files: File[]) => void;
  max?: number;
}

export default function PhotoPicker({ files, setFiles, max = 5 }: PhotoPickerProps) {
  /**
   * Handle file selection from the input element. Newly selected files
   * are appended to the existing file list up to the configured max.
   */
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (!selectedFiles.length) return;
    const updated = [...files, ...selectedFiles];
    const limited = updated.slice(0, max);
    setFiles(limited);
    e.target.value = "";
  };

  /**
   * Remove a file by its index from the current selection.
   */
  const removeFile = (idx: number) => {
    const updated = files.filter((_, i) => i !== idx);
    setFiles(updated);
  };

  return (
    <div className="mt-1">
      <div className="flex flex-wrap gap-2">
        {files.map((file, idx) => (
          <div key={idx} className="relative h-20 w-20 overflow-hidden rounded border">
            <img
              src={URL.createObjectURL(file)}
              alt={`Selected file ${idx + 1}`}
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeFile(idx)}
              className="absolute top-0 right-0 m-0.5 h-5 w-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center"
              aria-label="Remove image"
            >
              ×
            </button>
          </div>
        ))}
        {files.length < (max || 5) && (
          <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded border border-dashed border-neutral-300 text-sm text-neutral-500">
            + Add
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={onChange}
              className="hidden"
            />
          </label>
        )}
      </div>
      <div className="mt-2 text-xs text-neutral-500">
        {files.length}/{max} selected
      </div>
    </div>
  );
}