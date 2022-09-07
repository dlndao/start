import React from "react";
import {render}  from "react-dom";
import {BrowserRouter}  from "react-router-dom";
import Ignored from "pages/HomeTabs/ignored";

it("renders without crashing",()=>{
    const div=document.createElement("div");
    render( <BrowserRouter><Ignored/></BrowserRouter>,div)
    
})