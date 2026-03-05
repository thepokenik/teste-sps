import { useLoaderData, type LoaderFunctionArgs } from "react-router-dom";

interface User {
    id: string;
    name: string;
    email: string;
}

interface UserLoaderData {
    user: User;
}

export function userLoader({ params }: LoaderFunctionArgs) {
    const user: User = {
        id: params.userId as string,
        name: "teste",
        email: "teste@gmail.com",
    };

    return { user };
}

function EditUser() {
    const { user } = useLoaderData() as UserLoaderData;

    return (
        <div>
            <p>Edição de Usuário</p>
            <div>
                <form>
                    <label>Nome:</label>
                    <input type="text" defaultValue={user.name} />
                    <br />
                    <br />
                    <button type="submit">Salvar</button>
                </form>
            </div>
        </div>
    );
}

export default EditUser;
