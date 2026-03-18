import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { DragDrop, DragDropInfo, DragDropInput } from "@/components/ui/DragDrop";
import { useFileUploader } from "../../../hooks/useFileUploader";
import { useEffect, useState } from "react";

interface CreateAttachsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    disabled?: boolean;
}

export function CreateAttachsDialog({ open, onOpenChange, onSubmit, disabled = false }: CreateAttachsDialogProps) {
    const [attachs, setAttachs] = useState<string>("");

    const fileUploaderHook = useFileUploader({
        accept: '*',
        maxSize: 5 * 1024 * 1024, // 5MB
        multiple: true,
    });

    useEffect(() => {
        if (fileUploaderHook.files.length === 0) {
            setAttachs("");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setAttachs(typeof reader.result === "string" ? reader.result : "");
        };
        reader.onerror = () => {
            setAttachs("");
            console.error("Erro ao processar arquivo");
        };

        reader.readAsDataURL(fileUploaderHook.files[0]);
    }, [fileUploaderHook.files, fileUploaderHook.errors]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={onSubmit}>
                    <DialogHeader>
                        <DialogTitle>Criar Anexos</DialogTitle>
                        <DialogDescription>
                            Preencha os dados para criar novos anexos.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        <FieldGroup>
                            <Field>
                                <Label htmlFor="create-image">Adicione os Anexos</Label>
                                <DragDrop hook={fileUploaderHook}>
                                    <DragDropInput id="image" />
                                    <DragDropInfo />
                                </DragDrop>
                                <input type="hidden" name="imageUrl" value={attachs} />
                            </Field>
                        </FieldGroup>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Cancelar</Button>
                        </DialogClose>
                        <Button type="submit">Criar</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
