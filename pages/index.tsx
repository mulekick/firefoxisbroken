/* eslint-disable node/no-unsupported-features/es-syntax */

// import modules
import React from "react";
import dynamic from "next/dynamic.js";
import {GetStaticProps, GetStaticPropsContext} from "next";
import Layout from "../components/layout.tsx";
import {getEmoji} from "../lib/helpers.ts";

// import interfaces
import {AnimationPageProps} from "../lib/interfaces.ts";

const

    // use dynamic import features to disable SSR since CSS animations are dynamically computed at each render ...
    Animations = dynamic(() => import(`../components/emojisFloating.tsx`), {ssr: false}),

    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    getStaticProps: GetStaticProps = (context: GetStaticPropsContext) => ({
        // eslint-disable-next-line newline-per-chained-call
        props: {ep: new Array(7).fill(null).map(() => getEmoji())}
    });

// export static site generation function in a namespace
// that function can not be exported from a non page file ...
export {getStaticProps};

const
    // page component
    FloatingEmojis = (props:AnimationPageProps):React.JSX.Element => {
        const
            // read props
            {ep} = props;

        // return component
        return <Layout
            title={ `Firefox is broken ?` }
            description={ `Not broken just acting up a bit I guess 🤔` }
            outletComponent={ <Animations emojisPopulation={ ep } /> }
        />;
    };

// export page as default
export default FloatingEmojis;