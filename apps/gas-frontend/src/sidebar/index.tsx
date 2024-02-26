import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import RootWindow from './RootWindow';
import HomeWindow from './HomeWindow';
import {
    RouterProvider,
    createMemoryRouter
  } from "react-router-dom";
import NewImport from './NewImport';
import "../styles/index.css";
import { ThemeProvider } from '@mui/material';
import ComingSoon from './ComingSoon';
import AddPostgreSqlConfig from './AddPostgreSqlConfig';
import ImportPostgresScreen from './ImportPostgresScreen';

function App() {
    let storedRoute = localStorage.getItem('currentRoute');
    if(storedRoute == undefined || storedRoute == null) {
        storedRoute = "/";
    }
    const initialEntries = [storedRoute]
    const routes = [
        {
            path: "/",
            element: <RootWindow />,
            children: [
                {
                    index: true,
                    element: <HomeWindow />
                },
                {
                    path: "/new_import",
                    element: <NewImport />
                },
                {
                    path: "/coming_soon",
                    element: <ComingSoon />
                },
                {
                    path: "config/add/postgres",
                    element: <AddPostgreSqlConfig />
                },
                {
                    path: "import/postgres",
                    element: <ImportPostgresScreen />
                }
            ]
        },
    ];
    const router = createMemoryRouter(routes, {initialEntries: initialEntries});
    router.subscribe((state) => {
        localStorage.setItem('currentRoute', state.location.pathname + state.location.search);
    });

    return router;
}

window.console.log("Rendering App");
const container = document.getElementById('app');
if (container != null) {
const root = createRoot(container);
root.render(
    <React.StrictMode>
        <RouterProvider router={App()} />
    </React.StrictMode>);
}
