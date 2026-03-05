import { createBrowserRouter } from "react-router-dom";

import Home from "@/pages/Home/Home";
import SignIn from "@/pages/Login/SignIn";
import Dashboard from "@/pages/Dashboard/Dashboard";
import ProtectedRoute from "@/components/ProtectedRoute";
import NotFound from "@/pages/NotFound/NotFound";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/login",
        element: <SignIn />,
    },
    {
        path: "/users",
        element: (
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
        ),
    },
    {
        path: "*",
        element: <NotFound />
    }
]);

export default router;
