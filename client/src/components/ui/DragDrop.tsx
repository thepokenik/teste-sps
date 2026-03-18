import React, { createContext, useContext } from 'react';
import { cn } from '@/lib/utils';
import { Trash, X, Upload } from 'lucide-react';

interface FileError {
    fileName: string;
    message: string;
}

interface RootProps {
    onDrop: React.DragEventHandler<HTMLElement>;
    onDragEnter: React.DragEventHandler<HTMLElement>;
    onDragLeave: React.DragEventHandler<HTMLElement>;
    onDragOver: React.DragEventHandler<HTMLElement>;
}

interface InputProps {
    type: 'file';
    accept?: string;
    multiple?: boolean;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    style: React.CSSProperties;
}

interface DragDropContextValue {
    files: File[];
    errors: FileError[];
    isDragging: boolean;
    getRootProps: () => RootProps;
    getInputProps: () => InputProps;
    clearFiles: () => void;
}

const DragDropContext = createContext<DragDropContextValue | null>(null);

const useDragDrop = (): DragDropContextValue => {
    const context = useContext(DragDropContext);
    if (!context) {
        throw new Error('useDragDrop must be used within a DragDrop.Root provider');
    }
    return context;
};

interface DragDropProps {
    hook: DragDropContextValue;
    children: React.ReactNode;
    className?: string;
}

export const DragDrop = ({ hook, children, className }: DragDropProps) => {
    return (
        <DragDropContext.Provider value={hook}>
            <div className={cn('w-80', className)}>{children}</div>
        </DragDropContext.Provider>
    );
};
DragDrop.displayName = 'DragDrop';

interface DragDropInputProps extends Omit<React.LabelHTMLAttributes<HTMLLabelElement>, 'id'> {
    id: string;
}

export const DragDropInput = React.forwardRef<HTMLInputElement, DragDropInputProps>(
    ({ id, className, ...props }, ref) => {
        const { files, isDragging, getRootProps, getInputProps, clearFiles } = useDragDrop();

        return (
            <div className="dragdrop-container" {...getRootProps()}>
                <label
                    htmlFor={id}
                    className={cn(
                        'group relative flex flex-relative items-center gap-4 justify-center w-full h-18 rounded-lg border-2 border-dashed border-gray-400 cursor-pointer transition-colors',
                        'hover:border-blue-600 hover:text-blue-600',
                        { 'border-blue-600 text-blue-600': isDragging },
                        className,
                    )}
                    {...props}
                >
                    <Upload
                        className="h-8 w-8 mr-2 text-gray-500 transition-colors group-hover:text-blue-600 pointer-events-none"
                    />
                    {files.length === 0 ? (
                        <span className="w-40 text-sm text-center text-gray-500 transition-colors group-hover:text-blue-600 pointer-events-none">
                            {"Arraste e solte arquivos aqui ou clique para selecionar"}
                        </span>
                    ) : (
                        <span className="text-sm text-center text-gray-500 transition-colors group-hover:text-blue-600 pointer-events-none">
                            {'Arquivo(s) selecionado(s): ' + files.map((f) => f.name).join(', ')}
                        </span>
                    )}
                    <input id={id} {...getInputProps()} ref={ref} className="hidden" />
                    {files.length > 0 && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                clearFiles();
                            }}
                            className="absolute bottom-1 right-4 p-2 text-foreground hover:text-red-500 transition-colors"
                            aria-label="Clear selected files"
                        >
                            <Trash className="h-5 w-5" />
                        </button>
                    )}
                </label>
            </div>
        );
    },
);
DragDropInput.displayName = 'DragDropInput';

interface DragDropInfoProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
}

export const DragDropInfo = ({ className, children, ...props }: DragDropInfoProps) => {
    const { errors } = useDragDrop();

    if (errors.length > 0) {
        return (
            <div
                className={cn(
                    'w-full mt-2 flex bg-red-600 p-4 rounded-md items-start text-sm text-white transition-colors',
                    className,
                )}
                {...props}
            >
                <div className='flex flex-row'>
                    <X
                        className="h-4 w-4 mr-2 mt-0.5 text-white"
                    />
                    {`Erro: ${errors[0].message}`}
                </div>
            </div>
        );
    }

    return (
        <div
            className={cn(
                'w-full mt-2 flex bg-card p-4 rounded-md items-start text-sm text-foreground transition-colors',
                className,
            )}
            {...props}
        >
            <div>{children}</div>
        </div>
    );
};
DragDropInfo.displayName = 'DragDropInfo';
