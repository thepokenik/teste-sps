import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AuthService from "@/services/AuthService";
import { SignInForm } from "./components/SignInForm";
import { toast } from "sonner"

const authService = new AuthService();

function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            const { token, user } = await authService.login(email, password);
            login(token, user);
            navigate("/");
            toast.success('Login realizado com sucesso!');
            setLoading(false);
        } catch (error: any) {
            const message = error?.response?.data?.error || "E-mail ou senha inválidos.";
            toast.error(message);
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-4xl">
                <SignInForm
                    onSubmit={handleSubmit}
                    email={email}
                    onEmailChange={setEmail}
                    password={password}
                    onPasswordChange={setPassword}
                    loading={loading}
                />
            </div>
        </div>
    );
}

export default SignIn;
