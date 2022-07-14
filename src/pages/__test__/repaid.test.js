import React from "react";
import {render}  from "react-dom";
import {BrowserRouter}  from "react-router-dom";
import Repaid from "pages/HomeTabs/repaid";

it("renders without crashing",()=>{
    const div=document.createElement("div");
    render(<BrowserRouter><Repaid/></BrowserRouter>,div)
})