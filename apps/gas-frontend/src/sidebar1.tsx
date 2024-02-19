import React from 'react';
import { createRoot } from 'react-dom/client';
import About from './components/About';
import {
    RouterProvider,
    createMemoryRouter
  } from "react-router-dom";
import Contacts from './components/Contacts';

const router = createMemoryRouter([
    {
        path: "/",
        element: <About />,
    },
    {
        path: "contacts",
        element: <Contacts />
    }
]);

const container = document.getElementById('app');
if (container != null) {
    const root = createRoot(container);
root.render(<React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>);
}