/* eslint-disable max-lines-per-function */
/* eslint-disable node/no-unpublished-import */

// import modules
import React from "react";
import Head from "next/head.js";

// import interfaces
import {LayoutProps} from "../lib/interfaces.ts";

const

    // app layout component
    Layout = (props:LayoutProps):React.JSX.Element => {
        const
            // extract props
            {title, description, outletComponent} = props;

        // return component
        return <>
            <Head>
                { /* using the head tag layout from mdn as of now */}
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
                <title>{ title }</title>
                <meta name="description" content={ description } />
                <meta name="robots" content="noindex, nofollow" />
            </Head>
            <div className="App">
                {/* the nav + container pattern has to be implemented here */}
                <main className="container">
                    {
                        // display the component for the current route ...
                        outletComponent
                    }
                </main>
            </div>
        </>;
    };

// export components
export default Layout;