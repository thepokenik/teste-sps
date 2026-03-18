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
import { useFileUploader } from "../../../hooks/useFileUploader";
import { useEffect, useState } from "react";

interface CreateUserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    disabled?: boolean;
}

export function CreateUserDialog({ open, onOpenChange, onSubmit, disabled = false }: CreateUserDialogProps) {
    const [imageUrl, setImageUrl] = useState<string>("");

    const fileUploaderHook = useFileUploader({
        accept: '.png,.jpg,image/jpeg',
        maxSize: 5 * 1024 * 1024, // 5MB
        multiple: false,
    });

    useEffect(() => {
        if (fileUploaderHook.files.length === 0) {
            setImageUrl("");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setImageUrl(typeof reader.result === "string" ? reader.result : "");
        };
        reader.onerror = () => {
            setImageUrl("");
            console.error("Erro ao processar arquivo");
        };

        reader.readAsDataURL(fileUploaderHook.files[0]);
    }, [fileUploaderHook.files, fileUploaderHook.errors]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button disabled={disabled}>Criar Usuário</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={onSubmit}>
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
                                    <DragDropInput id="image" />
                                    <DragDropInfo />
                                </DragDrop>
                                <input type="hidden" name="imageUrl" value={imageUrl} />
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
