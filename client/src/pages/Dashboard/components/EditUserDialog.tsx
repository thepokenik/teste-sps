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
import { Input } from "@/components/ui/input";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import type { User } from "@/services/UserService";

interface EditUserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    user: User | null;
}

export function EditUserDialog({ open, onOpenChange, onSubmit, user }: EditUserDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={onSubmit}>
                    <DialogHeader>
                        <DialogTitle>Editar Usuário</DialogTitle>
                        <DialogDescription>
                            Atualize os dados do usuário. Deixe a senha em branco para não alterar.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        <FieldGroup>
                            <Field>
                                <Label htmlFor="edit-name">Nome</Label>
                                <Input
                                    id="edit-name"
                                    name="name"
                                    type="text"
                                    defaultValue={user?.name}
                                    required
                                />
                            </Field>
                            <Field>
                                <Label htmlFor="edit-email">Email</Label>
                                <Input
                                    id="edit-email"
                                    name="email"
                                    type="email"
                                    defaultValue={user?.email}
                                    required
                                />
                            </Field>
                            <Field>
                                <Label htmlFor="edit-password">Nova Senha (opcional)</Label>
                                <Input
                                    id="edit-password"
                                    name="password"
                                    type="password"
                                    placeholder="Deixe em branco para não alterar"
                                />
                            </Field>
                            <Field>
                                <Label htmlFor="edit-type">Tipo de Usuário</Label>
                                <select
                                    id="edit-type"
                                    name="type"
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                                    required
                                    defaultValue={user?.type || "user"}
                                >
                                    <option value="user">Usuário</option>
                                    <option value="admin">Administrador</option>
                                </select>
                            </Field>
                        </FieldGroup>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Cancelar</Button>
                        </DialogClose>
                        <Button type="submit">Salvar</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
