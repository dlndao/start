import React from "react";
import {render}  from "react-dom";
import {BrowserRouter}  from "react-router-dom";
import Start from "pages/start";


it("renders without crashing",()=>{
    const div=document.createElement("div");
    render(<BrowserRouter><Start/></BrowserRouter>,div)
})