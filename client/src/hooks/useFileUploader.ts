import { useState, useCallback, useEffect } from 'react';

export interface FileError {
    fileName: string;
    message: string;
}

// Extends the native File with an optional `url` field used for pre-existing files (edit mode)
export interface UploadedFile extends File {
    url?: string;
}

export interface UploaderConfig {
    /** Comma-separated string of accepted file types (e.g., '.png,.jpg,image/jpeg'). */
    accept?: string;
    /** Whether to allow multiple files. Defaults to `true`. */
    multiple?: boolean;
    /** Maximum file size in bytes. */
    maxSize?: number;
    /** Async function for custom content validation. Should throw if validation fails. */
    validator?: (file: UploadedFile) => Promise<void>;
    /** Pre-existing files to populate the uploader (e.g., for edit mode). */
    initialFiles?: UploadedFile[];
}

export const useFileUploader = ({
    accept,
    multiple = true,
    maxSize,
    validator,
    initialFiles = [],
}: UploaderConfig = {}) => {
    const [files, setFiles] = useState<UploadedFile[]>(() =>
        Array.isArray(initialFiles) ? initialFiles : [],
    );
    const [errors, setErrors] = useState<FileError[]>([]);
    const [isDragging, setIsDragging] = useState<boolean>(false);

    // Sync files when initialFiles changes (edit mode support)
    useEffect(() => {
        if (initialFiles && initialFiles.length > 0) {
            setFiles(Array.isArray(initialFiles) ? initialFiles : []);
        }
    }, [initialFiles]);

    const processFiles = useCallback(
        async (incomingFiles: UploadedFile[]) => {
            setErrors([]);

            const newFiles: UploadedFile[] = [];
            const newErrors: FileError[] = [];

            const acceptedTypes = accept ? accept.split(',').map((t) => t.trim()) : null;

            for (const file of incomingFiles) {
                try {
                    if (acceptedTypes) {
                        const fileExtension = `.${file.name.split('.').pop()}`;
                        if (
                            !acceptedTypes.includes(file.type) &&
                            !acceptedTypes.includes(fileExtension)
                        ) {
                            throw new Error('Tipo de arquivo inválido');
                        }
                    }

                    if (maxSize && file.size > maxSize) {
                        throw new Error('Arquivo muito grande');
                    }

                    if (validator) {
                        await validator(file);
                    }

                    newFiles.push(file);
                } catch (error) {
                    newErrors.push({
                        fileName: file.name,
                        message: error instanceof Error ? error.message : 'unknownError',
                    });
                }
            }

            setFiles((prevFiles) => {
                const currentFiles = multiple ? prevFiles : [];
                const allFiles = [...currentFiles, ...newFiles];

                // Deduplicate: prefer url for pre-existing files, otherwise use name+size+lastModified
                const uniqueFilesMap = new Map<string, UploadedFile>();
                allFiles.forEach((file) => {
                    const uniqueKey = file.url
                        ? file.url
                        : `${file.name}-${file.size}-${file.lastModified}`;
                    uniqueFilesMap.set(uniqueKey, file);
                });

                return Array.from(uniqueFilesMap.values());
            });

            setErrors(newErrors);
        },
        [accept, multiple, maxSize, validator],
    );

    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLElement>) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                processFiles(Array.from(e.dataTransfer.files) as UploadedFile[]);
                e.dataTransfer.clearData();
            }
        },
        [processFiles],
    );

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files && e.target.files.length > 0) {
                processFiles(Array.from(e.target.files) as UploadedFile[]);
            }
            e.target.value = '';
        },
        [processFiles],
    );

    const clearFiles = useCallback(() => {
        setFiles([]);
        setErrors([]);
    }, []);

    const onDragEnter = useCallback((e: React.DragEvent<HTMLElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const onDragLeave = useCallback((e: React.DragEvent<HTMLElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const onDragOver = useCallback((e: React.DragEvent<HTMLElement>) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const getRootProps = useCallback(
        () => ({
            onDrop: handleDrop,
            onDragEnter,
            onDragLeave,
            onDragOver,
        }),
        [handleDrop, onDragEnter, onDragLeave, onDragOver],
    );

    const getInputProps = useCallback(
        () => ({
            type: 'file' as const,
            accept,
            multiple,
            onChange: handleChange,
            style: { display: 'none' } as React.CSSProperties,
        }),
        [accept, multiple, handleChange],
    );

    return {
        files,
        errors,
        isDragging,
        getRootProps,
        getInputProps,
        clearFiles,
    };
};
