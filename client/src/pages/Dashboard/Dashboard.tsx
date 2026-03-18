import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import UserService, { type User } from "@/services/UserService";
import AttachService from "@/services/AttachService";
import { CreateUserDialog } from "./components/CreateUserDialog";
import { EditUserDialog } from "./components/EditUserDialog";
import { DeleteUserDialog } from "./components/DeleteUserDialog";
import { UsersTable } from "./components/UsersTable";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { House } from 'lucide-react';
import { CreateAttachsDialog } from "./components/CreateAttachsDialog";

const userService = new UserService();
const attachService = new AttachService();

function Dashboard() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [attachsDialogOpen, setAttachsDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const navigate = useNavigate();

    const { user: authUser, updateUser: updateAuthUser } = useAuth();
    const isAdmin = authUser?.type === "admin";

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

    async function handleCreateUser(e: React.FormEvent<HTMLFormElement>, file?: File | null) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const type = formData.get("type") as string;

        try {
            await userService.create({
                name,
                email,
                type,
                password,
                ...(file && { imageUrl: file })
            });
            toast.success("Usuário criado com sucesso!");
            fetchUsers();
            setCreateDialogOpen(false);
        } catch (error: any) {
            console.error("Error creating user:", error);
            const message = error?.response?.data?.error || "Erro ao criar usuário.";
            toast.error(message);
        }
    }

    async function handleUpdateUser(e: React.FormEvent<HTMLFormElement>, file?: File | null) {
        e.preventDefault();
        if (!selectedUser) return;

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const type = formData.get("type") as string;

        let finalImageUrl: string | File | undefined = undefined;

        if (file === null) {
            finalImageUrl = "";
        } else if (file) {
            if (file.name === "current-image" && file.size === 0) {
                finalImageUrl = undefined;
            } else {
                finalImageUrl = file;
            }
        }

        try {
            const updateData: any = { name, email, type };
            if (password) {
                updateData.password = password;
            }
            if (finalImageUrl !== undefined) {
                updateData.imageUrl = finalImageUrl;
            }

            const response = await userService.update(selectedUser.id, updateData);

            if (authUser?.id === selectedUser.id) {
                updateAuthUser(response.data);
            }

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

    async function handleCreateAttachs(e: React.FormEvent<HTMLFormElement>, files: File[] = []) {
        e.preventDefault();
        if (!selectedUser) return;

        const formData = new FormData(e.currentTarget);
        formData.append("user_id", selectedUser.id.toString());

        files.forEach((file) => {
            formData.append("attachments", file);
        });

        try {
            await attachService.create(formData);

            toast.success("Anexos criados com sucesso!");
            fetchUsers();
            setAttachsDialogOpen(false);
        } catch (error: any) {
            console.error("Error creating attachs:", error);
            const message = error?.response?.data?.error || "Erro ao criar anexos.";
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

    function openAttachsDialog(user: User) {
        setSelectedUser(user);
        setAttachsDialogOpen(true);
    }

    return (
        <div className="flex min-h-svh flex-col items-center bg-muted p-6 md:p-10">
            <div className="w-full max-w-6xl">
                <Button className="mb-4" size="icon" onClick={() => navigate("/")}><House /></Button>
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
                            disabled={!isAdmin}
                        />
                    </div>

                    <div className="mt-6">
                        {isAdmin ? (
                            <UsersTable
                                users={users}
                                isLoading={isLoading}
                                onEdit={openEditDialog}
                                onDelete={openDeleteDialog}
                                onAttach={openAttachsDialog}
                            />
                        ) : (
                            <div className="mb-4 p-3 bg-muted/50 rounded-md border border-muted-foreground/20">
                                <p className="text-sm text-muted-foreground text-center">
                                    Apenas administradores podem ver, criar, editar ou excluir usuários.
                                </p>
                            </div>
                        )}
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

                <CreateAttachsDialog
                    open={attachsDialogOpen}
                    onOpenChange={setAttachsDialogOpen}
                    onSubmit={handleCreateAttachs}
                    user={selectedUser}
                />
            </div>
        </div>
    );
}

export default Dashboard;