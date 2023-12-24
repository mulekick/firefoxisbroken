// import modules
import React from "react";

// general interfaces
export interface AnimationsParams {
    w:number,
    h: number,
    maxTranslate?:number,
    maxDelay?:number
}

// components interfaces
export interface LayoutProps {
    title:string,
    description:string,
    outletComponent:React.JSX.Element
}

export interface HeaderProps {
    title:string
}

export interface KeyframesProps {
    children:Array<React.JSX.Element> | React.JSX.Element | null,
    viewerPerspective?:number
}

export interface AnimationsProps {
    emojisPopulation:Array<string>
}

// pages interfaces
export interface AnimationPageProps {
    ep:Array<string>
}