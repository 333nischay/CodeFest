import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Login from "./Authentication/Login.jsx";
import PrivateRoute from "./router/PrivateRoute.jsx";
import Register from "./Authentication/Register.jsx";
import LoginRoute from "./router/LoginRoute.jsx";
import LandingPage from "./components/LandingPage.jsx";
import CreateWorkspace from "./components/CreateWorkspace.jsx";
import WorkSpaceInvitation from "./router/WorkSpaceInvitation.jsx";
import WorkSpace from "./components/WorkSpace.jsx";
import OpenExistingWorkspace from "./components/OpenExistingWorkspace.jsx";
import ForgotPassword from "./Authentication/ForgotPassword.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(

    <Route path="/" element={<App />}>
      <Route path="/" element={<LandingPage/>} />
      <Route path="/workspace/:id" element={<PrivateRoute><WorkSpace/></PrivateRoute>} />
      <Route path="/createWorkspace" element={<PrivateRoute><CreateWorkspace /></PrivateRoute>} />
      <Route path="/openWorkspace" element={<PrivateRoute><OpenExistingWorkspace /></PrivateRoute>} />
      <Route path="/workspaceInvite" element={<PrivateRoute><WorkSpaceInvitation /></PrivateRoute>} />
      <Route path="/Login" element={<LoginRoute><Login /></LoginRoute>} />
      <Route path="/forgotPassword" element={<LoginRoute><ForgotPassword /></LoginRoute>} />
      <Route path="/register" element={<LoginRoute><Register /></LoginRoute>} />
    </Route>
  )
);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />

  </StrictMode>
);
