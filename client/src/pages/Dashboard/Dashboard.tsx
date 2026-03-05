import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import UserService from "@/services/UserService";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { toast } from "sonner";

const userService = new UserService();

function Dashboard() {

    async function handleCreateUser(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            await userService.create({ name, email, type: "user", password });
        } catch {
            toast.error("Erro ao criar usuário.");
        } finally {
            toast.success("Usuário criado com sucesso!");
        }
    }

    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
            <Card className="w-full max-w-4xl p-6">
                <h2 className="text-xl font-semibold">Dashboard</h2>
                <p className="text-sm text-muted-foreground">
                    Bem-vindo ao painel de controle!
                </p>
                <Dialog>
                    <form onSubmit={handleCreateUser}>
                        <DialogTrigger asChild>
                            <Button>Criar Usuário</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Criar Usuário</DialogTitle>
                                <DialogDescription>
                                    Preencha os dados para criar um novo usuário.
                                </DialogDescription>
                            </DialogHeader>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="name">Nome</FieldLabel>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Nome completo"
                                        required
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="email">Email</FieldLabel>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="m@exemplo.com"
                                        required
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="password">Senha</FieldLabel>
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                    />
                                </Field>
                            </FieldGroup>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancelar</Button>
                                </DialogClose>
                                <Button type="submit">Criar</Button>
                            </DialogFooter>
                        </DialogContent>
                    </form>
                </Dialog>
            </Card>

            <h1> Painel de Controle</h1>
            <div>Lista de usuários</div>
        </div>
    );
}

export default Dashboard;
