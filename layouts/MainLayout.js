import React from "react";
import NavHeader from "../components/NavHeader/NavHeader";

export const MainLayout = ({ children, user }) => (
  <div>
    <NavHeader user={user} />
    {children}
  </div>
);
