interface Attach {
    id: number;
    user_id: number;
    files: { name: string; url: string }[];
}

const attachs: Attach[] = [];

export type { Attach };
export default attachs;
