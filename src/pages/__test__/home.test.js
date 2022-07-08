import React from "react";
import {render}  from "react-dom";
import {BrowserRouter}  from "react-router-dom";
import Home from "pages/HomeTabs/home";


it("renders without crashing",()=>{
    const div=document.createElement("div");
    render(<BrowserRouter><Home/></BrowserRouter>,div)
})