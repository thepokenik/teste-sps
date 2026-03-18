import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { DragDrop, DragDropInfo, DragDropInput } from "@/components/ui/DragDrop";
import { useFileUploader, UploadedFile } from "../../../hooks/useFileUploader";
import type { User } from "@/services/UserService";
import AttachService, { type Attach } from "@/services/AttachService";
import { useEffect, useState } from "react";
import { Trash } from "lucide-react";
import { toast } from "sonner";

const attachService = new AttachService();

interface CreateAttachsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>, files?: File[]) => void;
    disabled?: boolean;
    user: User | null;
}

export function CreateAttachsDialog({ open, onOpenChange, onSubmit, disabled = false, user }: CreateAttachsDialogProps) {
    const [existingAttachs, setExistingAttachs] = useState<Attach[]>([]);

    const fileUploaderHook = useFileUploader({
        multiple: true,
    });

    const selectedFile = fileUploaderHook.files[0] as UploadedFile | undefined;

    const previewUrl = selectedFile && selectedFile.type.startsWith('image/')
        ? (selectedFile.url || URL.createObjectURL(selectedFile))
        : "";

    useEffect(() => {
        if (open && user?.id) {
            fetchAttachs();
        } else {
            setExistingAttachs([]);
        }
    }, [open, user?.id]);

    const fetchAttachs = async () => {
        if (!user?.id) return;
        try {
            const response = await attachService.list(user.id);
            setExistingAttachs(response.data);
        } catch (error) {
            console.error("Erro ao buscar anexos", error);
        }
    };

    const handleDeleteAttach = async (id: number) => {
        try {
            await attachService.delete(id);
            toast.success("Anexo excluído!");
            fetchAttachs();
        } catch (error) {
            console.error("Erro ao excluir", error);
            toast.error("Erro ao excluir anexo");
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        onSubmit(e, fileUploaderHook.files);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Gerenciar Anexos</DialogTitle>
                        <DialogDescription>
                            Envie novos anexos ou veja/exclua os já enviados para este usuário.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4 max-h-[60vh] overflow-y-auto">
                        <FieldGroup>
                            <Field>
                                <Label htmlFor="create-image">Adicione Novos Anexos</Label>
                                <DragDrop hook={fileUploaderHook}>
                                    <DragDropInput id="image" />
                                    <DragDropInfo />
                                </DragDrop>
                            </Field>

                            {existingAttachs.length > 0 && (
                                <Field className="mt-6">
                                    <Label>Anexos Existentes</Label>
                                    <div className="mt-2 space-y-3">
                                        {existingAttachs.map((attach) => (
                                            <div key={attach.id} className="flex flex-col border p-3 rounded-md bg-muted/30 relative">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-sm font-semibold">Lote de Envio #{attach.id}</span>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => attach.id && handleDeleteAttach(attach.id)}
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-100 h-7 w-7 absolute top-2 right-2"
                                                    >
                                                        <Trash className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <ul className="list-disc list-inside text-xs text-muted-foreground flex flex-col gap-1">
                                                    {attach.files?.map((file: any, i: number) => (
                                                        <li key={i}>{file.name}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </Field>
                            )}
                        </FieldGroup>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Cancelar</Button>
                        </DialogClose>
                        <Button type="submit" disabled={disabled || fileUploaderHook.files.length === 0}>
                            Enviar Arquivos
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
