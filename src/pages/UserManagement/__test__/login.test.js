import React from "react";
import {render}  from "react-dom";
import {BrowserRouter}  from "react-router-dom";
import Login from "../login";

it("renders without crashing",()=>{
    const div=document.createElement("div");
    render(<BrowserRouter><Login/></BrowserRouter>,div)
})