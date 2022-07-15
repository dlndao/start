import React from "react";
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { CasperAssets } from "pages/CasperAssets";
import { UserProvider } from "contexts/UserAuthContext";
it("renders without crashing", () => {
    const div = document.createElement("div");
    render(
        <UserProvider>            
            <CasperAssets />            
        </UserProvider>, div)
})