import React from "react";
import {render}  from "react-dom";
import {BrowserRouter}  from "react-router-dom";
import ForgotPassword from "../forgotPassword";

it("renders without crashing",()=>{
    const div=document.createElement("div");
    render(<BrowserRouter><ForgotPassword/></BrowserRouter>,div)
})