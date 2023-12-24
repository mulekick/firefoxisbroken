// import modules
import React from "react";
import {Html, Head, Main, NextScript} from "next/document.js";

const
    // create the HTML document wrapper component
    DocumentWrapper = ():React.JSX.Element => <Html data-theme="dark">
        <Head />
        <body>
            <Main />
            <NextScript />
        </body>
    </Html>;

export default DocumentWrapper;