// import modules
import React from "react";

// import interfaces
import {HeaderProps} from "../lib/interfaces.ts";

const
    // same header for all pages (articles) ...
    Header = (props:HeaderProps):React.JSX.Element => {
        const
            // extract props
            {title} = props;

        return <header><h1>{ title }</h1></header>;
    };

// export page as default
export default Header;