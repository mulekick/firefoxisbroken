/* eslint-disable array-element-newline */

// import modules
import React from "react";

// import interfaces
import {AnimationsParams} from "./interfaces.ts";

const

    // -------------------------------------------------------

    // default emoji width / height in pixels
    EMOJI_WIDTH = 50,
    EMOJI_HEIGHT = 50,

    // window resize event throttling
    RESIZE_DEBOUNCE_TIME = 1e3,

    // default viewer perspective for 3D transforms
    DEFAULT_PERSPECTIVE = 1.5e3,

    // -------------------------------------------------------

    // random number between 2 values
    rnd = (lb:number, ub:number) => lb + Math.round(Math.random() * (ub - lb)),

    // emojis list
    emojis = [
        `😀`, `😃`, `😄`, `😁`, `😆`, `😅`, `😂`, `🤣`,
        `😊`, `😇`, `🙂`, `🙃`, `😉`, `😌`, `😍`, `🥰`,
        `😘`, `😗`, `😙`, `😚`, `😋`, `😛`, `😝`, `😜`,
        `🤪`, `🤨`, `🧐`, `🤓`, `😎`, `🤩`, `🥳`, `😏`,
        `😒`, `😞`, `😔`, `😟`, `😕`, `🙁`, `☹️`, `😣`,
        `😖`, `😫`, `😩`, `🥺`, `😢`, `😭`, `😤`, `😠`,
        `😡`, `🤬`, `🤯`, `😳`, `🥵`, `🥶`, `😱`, `😨`,
        `😰`, `😥`, `😓`, `🤗`, `🤔`, `🤭`, `🤫`, `🤥`,
        `😶`, `😐`, `😑`, `😬`, `🙄`, `😯`, `😦`, `😧`,
        `😮`, `😲`, `🥱`, `😴`, `🤤`, `😪`, `😵`, `🤐`,
        `🥴`, `🤢`, `🤮`, `🤧`, `😷`, `🤒`, `🤕`, `🤑`,
        `🤠`, `😈`, `👿`, `👹`, `👺`, `🤡`, `💩`, `👻`,
        `💀`, `☠️`, `👽`, `👾`, `🤖`, `🎃`, `😺`, `😸`,
        `😹`, `😻`, `😼`, `😽`, `🙀`, `😿`, `😾`
    ],

    // get random emoji
    getEmoji = ():string => emojis[rnd(0, emojis.length - 1)],

    // generate bright colors ...
    getColor = ():string => `hsl(${ 360 * Math.random() }, ${ 45 + 50 * Math.random() }%, ${ 45 + 50 * Math.random() }%)`,

    // get container dimensions
    getContainerArea = (ew: number, eh: number):AnimationsParams => {
        const
            // read container div dimensions
            e:HTMLDivElement|null = window.document.querySelector(`#page-content`),
            r:DOMRect|null = e ? e.getBoundingClientRect() : null,
            // default to 0 if unavailable (we prevent render until container div has loaded)
            w = r ? r.width - ew : 0,
            h = r ? r.height - eh : 0;
        // return
        return {w, h};
    },

    // debounce callback execution ... higher order functions require
    // using the function signature as a type when passing as a parameter
    debounceCallback = (tr:React.MutableRefObject<number>, cb:() => void, t:number):void => {
        window.clearTimeout(tr.current);
        tr.current = window.setTimeout(cb, t);
    },

    // -------------------------------------------------------

    // degrees to radian conversion
    d2r = (a:number):number => a * Math.PI / 180,

    // for clarity
    [ sin, cos, tan ] = [ (x:number) => Math.sin(d2r(x)), (x:number) => Math.cos(d2r(x)), (x:number) => Math.tan(d2r(x)) ],

    // transforms the standard 16 * 16 matrix notation into a matrix3d() rule
    translateMatrix = (matrix:Array<number>):string => {
        const
            // read array
            // [ a1, a2, a3, a4, b1, b2, b3, b4, c1, c2, c3, c4, d1, d2, d3, d4 ] = matrix;
            [ x1, y1, z1, tx, x2, y2, z2, ty, x3, y3, z3, tz, xW, yW, zW, tW ] = matrix;

        // return in css compliant format ...
        // return [ a1, b1, c1, d1, a2, b2, c2, d2, a3, b3, c3, d3, a4, b4, c4, d4 ].map(x => String(x)).join(`, `);
        return [ x1, x2, x3, xW, y1, y2, y3, yW, z1, z2, z3, zW, tx, ty, tz, tW ].map(x => String(x)).join(`, `);
    },

    // perspective (common factor for coordinates in projective space)
    // applying perspective on individual elements transforms does not
    // yields the desired effects, so it is best to use the prespective
    // property on the parent element ...
    perspective = (p:number):string => `matrix3d(${ translateMatrix([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, -1 / p, 1
    ]) })`,

    // scale
    scale = (x:number, y:number, z: number):string => `matrix3d(${ translateMatrix([
        x, 0, 0, 0,
        0, y, 0, 0,
        0, 0, z, 0,
        0, 0, 0, 1
    ]) })`,

    // skew
    skew = (x:number, y:number):string => `matrix3d(${ translateMatrix([
        1, tan(x), 0, 0,
        tan(y), 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]) })`,

    // translation
    translate = (x:number, y:number, z:number):string => `matrix3d(${ translateMatrix([
        1, 0, 0, x,
        0, 1, 0, y,
        0, 0, 1, z,
        0, 0, 0, 1
    ]) })`,

    // 3D Z-axis rotation
    rotateZ = (a:number):string => `matrix3d(${ translateMatrix([
        cos(a), sin(a) * -1, 0, 0,
        sin(a), cos(a), 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]) })`,

    // 3D X-axis rotation
    rotateX = (a:number):string => `matrix3d(${ translateMatrix([
        1, 0, 0, 0,
        0, cos(a), sin(a) * -1, 0,
        0, sin(a), cos(a), 0,
        0, 0, 0, 1
    ]) })`,

    // 3D Y-axis rotation
    rotateY = (a:number):string => `matrix3d(${ translateMatrix([
        cos(a), 0, sin(a), 0,
        0, 1, 0, 0,
        sin(a) * -1, 0, cos(a), 0,
        0, 0, 0, 1
    ]) })`;

    // not rewriting rotate3d since I don't know the details of the scalar product implementation ...

    // !!! MATRIXES ARE NON COMMUTATIVE !!! THE ORDERS IN WHICH TRANSFORMATIONS ARE APPLIED AFFECTS THE RESULTS !!!

    // -------------------------------------------------------

// eslint-disable-next-line object-curly-newline
export {EMOJI_WIDTH, EMOJI_HEIGHT, RESIZE_DEBOUNCE_TIME, DEFAULT_PERSPECTIVE, rnd, d2r, sin, cos, tan, getEmoji, getColor, getContainerArea, debounceCallback, perspective, scale, skew, translate, rotateZ, rotateX, rotateY};