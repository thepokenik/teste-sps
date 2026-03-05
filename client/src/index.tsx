import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import router from "@/routes";

import "@/index.css";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement,
);

root.render(
    <React.StrictMode>
        <AuthProvider>
            <RouterProvider router={router} />
            <Toaster richColors />
        </AuthProvider>
    </React.StrictMode>,
);
