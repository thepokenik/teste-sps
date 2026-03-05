import { createBrowserRouter } from "react-router-dom";

import Home from "@/pages/Home/Home";
import SignIn from "@/pages/Login/SignIn";
import Dashboard from "@/pages/Dashboard/Dashboard";
import UserEdit, { userLoader } from "@/pages/Dashboard/UserEdit";
import ProtectedRoute from "@/components/ProtectedRoute";

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
        path: "/users/:userId",
        element: (
            <ProtectedRoute>
                <UserEdit />
            </ProtectedRoute>
        ),
        loader: userLoader,
    },
]);

export default router;
