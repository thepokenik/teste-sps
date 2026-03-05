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

interface CreateUserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function CreateUserDialog({ open, onOpenChange, onSubmit }: CreateUserDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button>Criar Usuário</Button>
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
                                <Label htmlFor="create-name">Nome</Label>
                                <Input
                                    id="create-name"
                                    name="name"
                                    type="text"
                                    placeholder="Nome completo"
                                    required
                                />
                            </Field>
                            <Field>
                                <Label htmlFor="create-email">Email</Label>
                                <Input
                                    id="create-email"
                                    name="email"
                                    type="email"
                                    placeholder="m@exemplo.com"
                                    required
                                />
                            </Field>
                            <Field>
                                <Label htmlFor="create-password">Senha</Label>
                                <Input
                                    id="create-password"
                                    name="password"
                                    type="password"
                                    required
                                />
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
