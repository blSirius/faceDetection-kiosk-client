import React from 'react'

import happy from './expressionSet/smile.png'

export const emoji = (expression) => {
    if (expression === 'neutral') {
        return (
            <img className='w-12 h-12 rounded-xl' src={happy}></img>
        );
    }
    else if (expression === 'happy') {
        return (
            <img className='w-12 h-12 rounded-xl' src={happy}></img>
        );
    }
    else if (expression === 'sad') {
        return (
            <img className='w-12 h-12 rounded-xl' src={happy}></img>
        );
    }
    else if (expression === 'angry') {
        return (
            <img className='w-12 h-12 rounded-xl' src={happy}></img>
        );
    }
    else if (expression === 'disgusted') {
        return (
            <img className='w-12 h-12 rounded-xl' src={happy}></img>
        );
    }
    else if (expression === 'fearful') {
        return (
            <img className='w-12 h-12 rounded-xl' src={happy}></img>
        );
    }
    else if (expression === 'surprised') {
        return (
            <img className='w-12 h-12 rounded-xl' src={happy}></img>
        );
    }

    return null;
};

