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
import { Input } from "@/components/ui/input";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { DragDrop, DragDropInfo, DragDropInput } from "@/components/ui/DragDrop";
import { useFileUploader, UploadedFile } from "../../../hooks/useFileUploader";
import { ImagePreviewDialog } from "./ImagePreviewDialog";
import { useState } from "react";
import { Eye } from "lucide-react";

interface CreateUserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>, file?: File) => void;
    disabled?: boolean;
}

export function CreateUserDialog({ open, onOpenChange, onSubmit, disabled = false }: CreateUserDialogProps) {
    const [previewOpen, setPreviewOpen] = useState(false);

    const fileUploaderHook = useFileUploader({
        accept: '.png,.jpg,image/jpeg',
        maxSize: 5 * 1024 * 1024, // 5MB
        multiple: false,
    });

    const selectedFile = fileUploaderHook.files[0] as UploadedFile | undefined;
    const previewUrl = selectedFile ? (selectedFile.url || URL.createObjectURL(selectedFile)) : "";

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        onSubmit(e, selectedFile);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button disabled={disabled}>Criar Usuário</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Criar Usuário</DialogTitle>
                        <DialogDescription>
                            Preencha os dados para criar um novo usuário.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        <FieldGroup>
                            <Field>
                                <Label htmlFor="create-name">Nome*</Label>
                                <Input
                                    id="create-name"
                                    name="name"
                                    type="text"
                                    placeholder="Nome completo"
                                    required
                                />
                            </Field>
                            <Field>
                                <Label htmlFor="create-email">Email*</Label>
                                <Input
                                    id="create-email"
                                    name="email"
                                    type="email"
                                    placeholder="m@exemplo.com"
                                    required
                                />
                            </Field>
                            <Field>
                                <Label htmlFor="create-password">Senha*</Label>
                                <Input
                                    id="create-password"
                                    name="password"
                                    type="password"
                                    required
                                />
                            </Field>
                            <Field>
                                <Label htmlFor="create-type">Tipo de Usuário*</Label>
                                <select
                                    id="create-type"
                                    name="type"
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                                    required
                                    defaultValue="user"
                                >
                                    <option value="user">Usuário</option>
                                    <option value="admin">Administrador</option>
                                </select>
                            </Field>
                            <Field>
                                <Label htmlFor="create-image">Adicione uma imagem de usuario (opcional)</Label>
                                <DragDrop hook={fileUploaderHook}>
                                    <div className="flex flex-col gap-2">
                                        <DragDropInput id="image" />
                                        {previewUrl && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setPreviewOpen(true)}
                                            >
                                                <Eye className="w-4 h-4 mr-2" />
                                                Ver preview da imagem
                                            </Button>
                                        )}
                                    </div>
                                    <DragDropInfo />
                                </DragDrop>
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

                <ImagePreviewDialog
                    open={previewOpen}
                    onOpenChange={setPreviewOpen}
                    imageUrl={previewUrl}
                />
            </DialogContent>
        </Dialog>
    );
}
