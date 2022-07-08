import React from "react";
import {render}  from "react-dom";
import {BrowserRouter}  from "react-router-dom";
import Register from "../register";

it("renders without crashing",()=>{
    const div=document.createElement("div");
    render(<BrowserRouter><Register/></BrowserRouter>,div)
})