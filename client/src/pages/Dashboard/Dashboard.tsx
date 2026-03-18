import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import UserService, { type User } from "@/services/UserService";
import AttachService, { type Attach } from "@/services/AttachService";
import { CreateUserDialog } from "./components/CreateUserDialog";
import { EditUserDialog } from "./components/EditUserDialog";
import { DeleteUserDialog } from "./components/DeleteUserDialog";
import { UsersTable } from "./components/UsersTable";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { House, Download, Eye } from 'lucide-react';
import { CreateAttachsDialog } from "./components/CreateAttachsDialog";
import { ImagePreviewDialog } from "./components/ImagePreviewDialog";

const userService = new UserService();
const attachService = new AttachService();

function Dashboard() {
    const [users, setUsers] = useState<User[]>([]);
    const [userAttachs, setUserAttachs] = useState<Attach[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [attachsDialogOpen, setAttachsDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState("");

    const navigate = useNavigate();

    const { user: authUser, updateUser: updateAuthUser } = useAuth();
    const isAdmin = authUser?.type === "admin";

    useEffect(() => {
        if (isAdmin) {
            fetchUsers();
        } else if (authUser?.id) {
            fetchUserAttachs(authUser.id);
        }
    }, [isAdmin, authUser?.id]);

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

    async function fetchUserAttachs(userId: number) {
        try {
            setIsLoading(true);
            const response = await attachService.list(userId);
            setUserAttachs(response.data);
        } catch (error: any) {
            console.error("Error fetching attachs:", error);
            const message = error?.response?.data?.error || "Erro ao carregar anexos.";
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
                                {isAdmin ? "Gerencie os usuários do sistema" : "Veja todos os seus arquivos aqui"}
                            </p>
                        </div>
                        {isAdmin && (
                            <CreateUserDialog
                                open={createDialogOpen}
                                onOpenChange={setCreateDialogOpen}
                                onSubmit={handleCreateUser}
                                disabled={!isAdmin}
                            />
                        )}
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
                        ) : isLoading ? (
                            <div className="flex justify-center p-8"><span className="text-muted-foreground animate-pulse text-sm">Carregando seus arquivos...</span></div>
                        ) : userAttachs.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {userAttachs.map((attach) => (
                                    <div key={attach.id} className="p-4 flex flex-col gap-3 rounded-md border border-muted-foreground/20 bg-card">
                                        <span className="text-sm font-semibold">Lote de Envio #{attach.id}</span>
                                        <ul className="list-none flex flex-wrap gap-2">
                                            {attach.files?.map((file: any, i: number) => {
                                                const isImage = file.name.match(/\.(jpeg|jpg|png|gif|webp)$/i) || file.url.startsWith("data:img") || file.url.startsWith("data:image/");
                                                return (
                                                    <li key={i} className="flex gap-2 items-center text-sm border bg-muted/50 px-3 py-2 rounded-md grow justify-between">
                                                        <span className="truncate max-w-[150px]" title={file.name}>{file.name}</span>
                                                        <div className="flex gap-2 justify-end">
                                                            {isImage && (
                                                                <Button variant="secondary" size="icon" className="h-7 w-7" onClick={() => {
                                                                    setPreviewUrl(file.url);
                                                                    setPreviewOpen(true);
                                                                }}>
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                            )}
                                                            <Button variant="outline" size="icon" className="h-7 w-7 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white" asChild>
                                                                <a href={file.url} download={file.name}>
                                                                    <Download className="h-4 w-4" />
                                                                </a>
                                                            </Button>
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="mb-4 p-5 bg-muted/50 rounded-md border border-muted-foreground/20 flex flex-col items-center justify-center">
                                <p className="text-muted-foreground text-center">
                                    Nenhum arquivo enviado para a sua conta ainda.
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

                <ImagePreviewDialog 
                    open={previewOpen} 
                    onOpenChange={setPreviewOpen} 
                    imageUrl={previewUrl} 
                />
            </div>
        </div>
    );
}

export default Dashboard;