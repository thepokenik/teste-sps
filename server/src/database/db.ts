interface User {
    id: number;
    name: string;
    email: string;
    type: string;
    password: string;
    imageUrl?: string;
}

const users: User[] = [
    {
        id: 1,
        name: "admin",
        email: "admin@spsgroup.com.br",
        type: "admin",
        password: "1234",
    },
];

export type { User };
export default users;
