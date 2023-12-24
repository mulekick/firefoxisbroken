/* eslint-disable node/no-unpublished-import */

// import modules
import React from "react";
import {AppProps} from "next/app.js";

// thats a pretty exotic way to import global scss files when you compare it to vite.js ...
import "../scss/pico.scss";

const
    // create the app wrapper component
    AppWrapper = (props:AppProps):React.JSX.Element => {
        const
            // extract props
            {Component, pageProps} = props;

        return <Component { ...pageProps } />;
    };

export default AppWrapper;