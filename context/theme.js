/*
 * @author Gaurav Kumar
 */

import React, {useState} from "react";

export const ThemeContext = React.createContext();

export const ThemeProvider = (props) => {
    const colors = {
        primary: "#572CD8",
        secondary: "#FF7D3B"
    };
    return (
        <ThemeContext.Provider value={{colors}} {...props}/>
    );
};
