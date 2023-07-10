import React, { useEffect } from "react";
import mermaid from "mermaid";

export const drawDiagram = async (mermaidCodeSnippet, chatData, setChatData, setOpen) => {   
    console.log(mermaidCodeSnippet); 
    const ele = document.querySelector('.mermaidDiv');
    const m_ele = document.querySelector('#magnify');
    const graphDefination = mermaidCodeSnippet
    try {
        const { svg } = await mermaid.render('mermaidDiv', graphDefination);
        if(svg != null) {
            ele.innerHTML = svg;
            m_ele.style.backgroundImage = `url(data:image/svg+xml;base64,${window.btoa(svg)})`;
            m_ele.style.backgroundRepeat = 'no-repeat';
            m_ele.style.backgroundColor = 'white';
        }
    } catch(err) {
        console.error(err);
        if(chatData.length != 0) {
            chatData[chatData.length-1].status = 'error';
            setChatData([...chatData]);
            setOpen(true);
        }
    }
}