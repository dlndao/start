import React from "react";
import {render}  from "react-dom";
import {BrowserRouter}  from "react-router-dom";
import ResetPassword from "../resetPassword";

it("renders without crashing",()=>{
    const div=document.createElement("div");
    render(<BrowserRouter><ResetPassword/></BrowserRouter>,div)
})