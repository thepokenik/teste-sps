import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";

interface ImagePreviewDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    imageUrl: string;
}

export function ImagePreviewDialog({ open, onOpenChange, imageUrl }: ImagePreviewDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Visualização da Imagem</DialogTitle>
                    <DialogDescription>
                        Como a imagem aparecerá no sistema
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center p-4">
                    {imageUrl ? (
                        <img src={imageUrl} alt="Preview" className="max-h-[60vh] object-contain rounded-md shadow-lg" />
                    ) : (
                        <p className="text-sm text-muted-foreground">Nenhuma imagem selecionada</p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
