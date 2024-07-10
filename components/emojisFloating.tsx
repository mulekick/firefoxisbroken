
// import modules
import React, {useState, useEffect, useRef} from "react";
// eslint-disable-next-line object-curly-newline, no-unused-vars, @typescript-eslint/no-unused-vars
import {EMOJI_WIDTH, EMOJI_HEIGHT, RESIZE_DEBOUNCE_TIME, DEFAULT_PERSPECTIVE, rnd, sin, cos, getColor, getContainerArea, debounceCallback, scale, translate, rotateX, rotateY} from "../lib/helpers.ts";
import Header from "./header.tsx";

// import interfaces
import {AnimationsProps, AnimationsParams, KeyframesProps} from "../lib/interfaces.ts";

interface AnimatedElementPropsSignature {
    index:number,
    emojis:Array<string>,
    duration:number,
    translateTo: {x:number, y:number, z:number},
    rotateTo: {rx:number, ry:number, rz:number},
    totalElements:number,
    maxDelay:number
}

const

    // since this is the parent component of all animated elements
    // the perspective has to be set up here - it is expressed in
    // pixels for precisions sake, it also has to be relevant to the
    // dimensions of animated children components ...
    Keyframes = (props:KeyframesProps):React.JSX.Element => {

        const
            // ...
            {children, viewerPerspective} = props;

        // in the event an element undergoes a transformation, its parent
        // element has to have its perspective set in order to enable the
        // 3d effect, even in the case of nested elements ...
        return <>
            <style>
                {
                    `.set-inner-perspective {
                        /* inherit parent property value ... */
                        transform-style: inherit;
                        perspective-origin: top;
                        perspective: ${ viewerPerspective }px;
                    }`
                }
            </style>
            <section id="page-content" className="set-inner-perspective">{ children }</section>
        </>;
    },

    // animated component
    AnimatedElement = (props:AnimatedElementPropsSignature):React.JSX.Element => {

        const
            // ...
            {index, emojis, duration, translateTo: {x, y, z}, rotateTo: {rx, ry, rz}, totalElements, maxDelay} = props,
            // current animation delay
            currentDelay = index * maxDelay / totalElements,
            // prism face width and height in pixels
            [ faceWidth, faceHeight ] = [ 75, 150 ];

        // 1) the transform-box property seems only relevant to SVG transforms ... also,
        // when doing transforms on 3d elements, the transform-origin property has to
        // be set to each individual offset ...

        // 2) the perspective transform applies a transformation to elements by changing
        // their z-axis common factor in the projective space - as a result, 3d objects
        //  created from 2d elements from the plane level get some undesired "distortion"
        // effects, so z-axis translations + scaling have to be favored over perspective
        // transforms to create the illusion of depth instead ...
        return <>
            <style>
                {
                    `.emoji-side-${ index }-0 {
                        background-color: ${ getColor() };

                    }
                    .emoji-side-${ index }-1 {
                        background-color: ${ getColor() };
                        transform-origin: ${ faceWidth }px 0 0;
                        transform: ${ translate(0, faceHeight * -1, 0) } ${ rotateY(108) };

                    }
                    .emoji-side-${ index }-2 {
                        background-color: ${ getColor() };
                        transform-origin: 0 0 0;
                        transform: ${ translate(0, faceHeight * -2, 0) } ${ rotateY(-108) };

                    }
                    .emoji-side-${ index }-3 {
                        background-color: ${ getColor() };
                        transform-origin: 0 0 0;
                        transform: ${ translate(faceWidth * -1 * cos(72), faceHeight * -3, faceWidth * sin(72)) } ${ rotateY(-36) };

                    }
                    .emoji-side-${ index }-4 {
                        background-color: ${ getColor() };
                        transform-origin: ${ faceWidth }px 0 0;
                        transform: ${ translate(faceWidth * cos(72), faceHeight * -4, faceWidth * sin(72)) } ${ rotateY(36) };

                    }
                    @keyframes float-${ index } {
                        from {
                            visibility: visible;
                            transform-origin: ${ faceWidth / 2 }px ${ faceWidth }px ${ faceHeight / 4 * sin(54) / cos(54) }px;
                            transform: ${ translate(x, y, z) } ${ rotateY(-45) };
                        }
                        to {
                            visibility: visible;
                            transform-origin: ${ faceWidth / 2 }px ${ faceWidth }px ${ faceHeight / 4 * sin(54) / cos(54) }px;
                            transform: ${ translate(x, y, z) } ${ rotateY(-45) } rotate3d(${ rx }, ${ ry }, ${ rz }, 360deg)  ;
                        }
                    }
                    .animate-${ index } {
                        /* inherit parent property value ... */
                        transform-style: inherit;
                        visibility: hidden;
                        position: absolute;
                        animation: ${ String(duration) }s linear ${ String(currentDelay / 10) }s infinite normal forwards running float-${ index };
                    }`
                }
            </style>
            <div className={ `animate-${ index }` }>
                {
                    emojis.map((e:string, i:number):React.JSX.Element => <div key={ i } className={ `emoji-side emoji-side-${ index }-${ i }` }>{ e }</div>)
                }
            </div>
        </>;
    },

    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    Animations = (props:AnimationsProps):React.JSX.Element => {

        const
            // extract props
            {emojisPopulation} = props,
            // create ref to debounce timer
            debounceTimerRef = useRef<number>(0),
            // store container dimensions in state
            [ windowArea, setWindowArea ] = useState<AnimationsParams>(getContainerArea(EMOJI_WIDTH, EMOJI_HEIGHT * 2)),
            // container loaded indicator
            [ containerLoaded, setContainerLoaded ] = useState<boolean>(false),
            // window resize listener ...
            resizeListener = ():void => debounceCallback(debounceTimerRef, ():void => {
                // eslint-disable-next-line max-nested-callbacks
                requestAnimationFrame(():number => requestAnimationFrame(():void => setWindowArea(getContainerArea(EMOJI_WIDTH, EMOJI_HEIGHT * 2))));
            }, RESIZE_DEBOUNCE_TIME);

        // re-render everything on resize ...
        useEffect(() => {
            // initial read of container dimensions ...
            setWindowArea(getContainerArea(EMOJI_WIDTH, EMOJI_HEIGHT * 2));
            // mark container as loaded
            setContainerLoaded(true);
            // add resize listener, debounce execution
            window.addEventListener(`resize`, resizeListener);
            // remove listener on component unmount
            return () => window.removeEventListener(`resize`, resizeListener);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        // the perspective property applies a transformation to child elements
        // by changing their z-axis common factor in the projective space - as
        // a result, 3d objects created from 2d elements at the plane level get
        // some projection effects that create the illusion of depth ...
        return <>
            {
                <style>
                    {
                        `@keyframes reveal-perspective {
                            to {
                                perspective-origin: bottom;
                                perspective: ${ DEFAULT_PERSPECTIVE }px;
                            }
                        }
                        .set-outer-perspective {
                            perspective-origin: top;
                            perspective: ${ DEFAULT_PERSPECTIVE * 2 }px;
                            animation: 5s ease-out 1.5s 1 normal forwards running reveal-perspective;
                        }
                        @keyframes reveal-transform {
                            to {
                                transform-origin: bottom;
                                transform: ${ rotateX(45) };
                            }
                        }
                        .set-perspective-transform {
                            /* set all descendants for rendering in the 3d space */
                            /* failure to do this prevents correct rendering of 3d transforms further down ... */
                            transform-style: preserve-3d;
                            transform-origin: top;
                            animation: 5s ease-out 1.5s 1 normal forwards running reveal-transform;
                        }`
                    }
                </style>
            }
            <div className="set-outer-perspective">
                { /* apply the transform on the whole article ... */ }
                <article className="set-perspective-transform">
                    <Header title={ `Not consistent with chrome, but okay 🤨` } />
                    { /* and the second perspective to the page contents element */ }
                    <Keyframes viewerPerspective={ DEFAULT_PERSPECTIVE * 4 }>
                        {
                            // render only once container has loaded ...
                            containerLoaded ?
                                emojisPopulation.map((x:string, i:number, a:Array<string>):React.JSX.Element => <AnimatedElement
                                    key={ i }
                                    index={ i }
                                    emojis={ [ x, x, x, x, x ] }
                                    duration={ rnd(10, 20) }
                                    translateTo={ {
                                        x: rnd(0, windowArea.w),
                                        y: rnd(0, windowArea.h),
                                        // z: rnd(0.1e2, 0.99e3)
                                        // stack emojis instead ...
                                        z: 75 + i * (DEFAULT_PERSPECTIVE * 0.25 / a.length)
                                    } }
                                    rotateTo={ {
                                        rx: rnd(-180, 180),
                                        ry: rnd(-180, 180),
                                        rz: rnd(-180, 180)
                                    } }
                                    totalElements={ a.length }
                                    maxDelay={ 5 }
                                />) :
                                null
                        }
                    </Keyframes>
                </article>
            </div>
        </>;
    };

// export default component
export default Animations;