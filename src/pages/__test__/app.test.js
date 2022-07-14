import React from "react";
import {render}  from "react-dom";
import {BrowserRouter}  from "react-router-dom";
import { App } from "pages/App";



it("renders without crashing",()=>{
    const div=document.createElement("div");
    render(<BrowserRouter><App/></BrowserRouter>,div)
})


