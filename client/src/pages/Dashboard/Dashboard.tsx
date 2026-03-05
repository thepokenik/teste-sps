import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import UserService, { type User } from "@/services/UserService";
import { toast } from "sonner";
import { CreateUserDialog } from "./components/CreateUserDialog";
import { EditUserDialog } from "./components/EditUserDialog";
import { DeleteUserDialog } from "./components/DeleteUserDialog";
import { UsersTable } from "./components/UsersTable";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const userService = new UserService();

function Dashboard() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, []);

    async function fetchUsers() {
        try {
            setIsLoading(true);
            const response = await userService.list();
            setUsers(response.data);
        } catch (error: any) {
            console.error("Error fetching users:", error);
            const message = error?.response?.data?.error || "Erro ao carregar usuários.";
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleCreateUser(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const type = formData.get("type") as string;

        try {
            await userService.create({ name, email, type, password });
            toast.success("Usuário criado com sucesso!");
            fetchUsers();
            setCreateDialogOpen(false);
        } catch (error: any) {
            console.error("Error creating user:", error);
            const message = error?.response?.data?.error || "Erro ao criar usuário.";
            toast.error(message);
        }
    }

    async function handleUpdateUser(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!selectedUser) return;

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const type = formData.get("type") as string;

        try {
            const updateData: any = { name, email, type };
            if (password) {
                updateData.password = password;
            }

            await userService.update(selectedUser.id, updateData);
            toast.success("Usuário atualizado com sucesso!");
            setEditDialogOpen(false);
            setSelectedUser(null);
            fetchUsers();
        } catch (error: any) {
            console.error("Error updating user:", error);
            const message = error?.response?.data?.error || "Erro ao atualizar usuário.";
            toast.error(message);
        }
    }

    async function handleDeleteUser() {
        if (!selectedUser) return;

        try {
            await userService.delete(selectedUser.id);
            toast.success("Usuário excluído com sucesso!");
            setDeleteDialogOpen(false);
            setSelectedUser(null);
            fetchUsers();
        } catch (error: any) {
            console.error("Error deleting user:", error);
            const message = error?.response?.data?.error || "Erro ao excluir usuário.";
            toast.error(message);
        }
    }

    function openEditDialog(user: User) {
        setSelectedUser(user);
        setEditDialogOpen(true);
    }

    function openDeleteDialog(user: User) {
        setSelectedUser(user);
        setDeleteDialogOpen(true);
    }


    return (
        <div className="flex min-h-svh flex-col items-center bg-muted p-6 md:p-10">
            <div className="w-full max-w-6xl">
                <Button className="mb-4" onClick={() => navigate("/")}>Voltar para Home</Button>
                <Card className="p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h2 className="text-2xl font-semibold">Dashboard</h2>
                            <p className="text-sm text-muted-foreground">
                                Gerencie os usuários do sistema
                            </p>
                        </div>
                        <CreateUserDialog
                            open={createDialogOpen}
                            onOpenChange={setCreateDialogOpen}
                            onSubmit={handleCreateUser}
                        />
                    </div>

                    <div className="mt-6">
                        <UsersTable
                            users={users}
                            isLoading={isLoading}
                            onEdit={openEditDialog}
                            onDelete={openDeleteDialog}
                        />
                    </div>
                </Card>

                <EditUserDialog
                    open={editDialogOpen}
                    onOpenChange={setEditDialogOpen}
                    onSubmit={handleUpdateUser}
                    user={selectedUser}
                />

                <DeleteUserDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    onConfirm={handleDeleteUser}
                    user={selectedUser}
                />
            </div>
        </div>
    );
}

export default Dashboard;