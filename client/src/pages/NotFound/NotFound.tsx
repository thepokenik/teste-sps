import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

function NotFound() {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
            <div className="w-full max-w-md">
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-6xl font-bold text-primary">404</CardTitle>
                        <CardDescription className="text-xl pt-2">
                            Página não encontrada
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-4">
                        <p className="text-sm text-muted-foreground text-center">
                            A página que você está procurando não existe ou foi movida.
                        </p>
                        <Button asChild className="w-full sm:w-auto">
                            <Link to="/">Voltar para Home</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default NotFound;