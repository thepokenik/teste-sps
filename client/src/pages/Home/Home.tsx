import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

function Home() {
    const { isAuthenticated, user, logout } = useAuth();

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background">
            <h1 className="text-3xl font-bold">SPS REACT TEST</h1>

            {isAuthenticated ? (
                <div className="flex flex-col items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                        Logado como <span className="font-medium text-foreground">{user?.name}</span>
                    </p>
                    <div className="flex gap-3">
                        <Button asChild>
                            <Link to="/users">Usuários</Link>
                        </Button>
                        <Button variant="outline" onClick={logout}>
                            Sair
                        </Button>
                    </div>
                </div>
            ) : (
                <Button asChild>
                    <Link to="/login">Entrar</Link>
                </Button>
            )}
        </div>
    );
}

export default Home;
