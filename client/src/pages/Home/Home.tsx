import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

function Home() {
    const { isAuthenticated, user, logout } = useAuth();

    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
            <div className="w-full max-w-2xl">
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl font-bold">SPS Gerenciamento de Usuários</CardTitle>
                        {isAuthenticated && (
                            <CardDescription className="text-base pt-2">
                                Bem-vindo, <span className="font-semibold text-foreground">{user?.name}</span>!
                            </CardDescription>
                        )}
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-6">
                        {isAuthenticated ? (
                            <>
                                <p className="text-sm text-muted-foreground text-center">
                                    Você está conectado ao painel de administração
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                    <Button asChild className="w-full sm:w-auto">
                                        <Link to="/users">Gerenciar Usuários</Link>
                                    </Button>
                                    <Button variant="outline" onClick={logout} className="w-full sm:w-auto">
                                        Sair
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <p className="text-sm text-muted-foreground text-center">
                                    Faça login para acessar o sistema
                                </p>
                                <Button asChild className="w-full sm:w-auto">
                                    <Link to="/login">Entrar</Link>
                                </Button>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default Home;
