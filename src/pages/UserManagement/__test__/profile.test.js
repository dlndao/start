import React from "react";
import {render}  from "react-dom";
import {BrowserRouter}  from "react-router-dom";
import Profile from "../profile";

it("renders without crashing",()=>{
    const div=document.createElement("div");
    render(<BrowserRouter><Profile/></BrowserRouter>,div)
})