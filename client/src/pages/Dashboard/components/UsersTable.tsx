import { Button } from "@/components/ui/button";
import type { User } from "@/services/UserService";

interface UsersTableProps {
    users: User[];
    isLoading: boolean;
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
    onAttach: (user: User) => void;
}

export function UsersTable({ users, isLoading, onEdit, onDelete, onAttach }: UsersTableProps) {
    if (isLoading) {
        return (
            <p className="text-center py-8 text-muted-foreground">
                Carregando usuários...
            </p>
        );
    }

    if (users.length === 0) {
        return (
            <p className="text-center py-8 text-muted-foreground">
                Nenhum usuário encontrado
            </p>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b">
                        <th className="text-left p-3 font-semibold">ID</th>
                        <th className="text-left p-3 font-semibold">Nome</th>
                        <th className="text-left p-3 font-semibold">Email</th>
                        <th className="text-left p-3 font-semibold">Tipo</th>
                        <th className="text-right p-3 font-semibold">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-muted/50">
                            <td className="p-3">{user.id}</td>
                            <td className="p-3">{user.name}</td>
                            <td className="p-3">{user.email}</td>
                            <td className="p-3">{user.type}</td>
                            <td className="p-3 text-right space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onEdit(user)}
                                >
                                    Editar
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onAttach(user)}
                                >
                                    Anexos
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => onDelete(user)}
                                >
                                    Excluir
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
