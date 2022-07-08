import React from "react";
import {render}  from "react-dom";
import {BrowserRouter}  from "react-router-dom";
import Invest from "pages/HomeTabs/invest";


it("renders without crashing",()=>{
    const div=document.createElement("div");
    render(<BrowserRouter><Invest/></BrowserRouter>,div)
})