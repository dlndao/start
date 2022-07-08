import React from "react";
import {render}  from "react-dom";
import {BrowserRouter}  from "react-router-dom";
import Ignored from "pages/HomeTabs/ignored";

it("renders without crashing",async()=>{
    const div=document.createElement("div");
    render(await <BrowserRouter><Ignored/></BrowserRouter>,div)
    
})