import React from "react";
import {render}  from "react-dom";
import {BrowserRouter}  from "react-router-dom";
import Borrow from "pages/HomeTabs/borrow";


it("renders without crashing",()=>{
    const div=document.createElement("div");
    render(<BrowserRouter><Borrow/></BrowserRouter>,div)
})