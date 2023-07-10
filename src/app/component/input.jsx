import { Box, Button } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import './input.scss';
import { useEffect } from "react";

export function Input({
    prompt,
    handleChange,
    getDataFromOpenApi,
    chatData,
}) {
    const handleHeight = () => {
        const textarea = document.getElementById("promptText");
        if(textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`
        }
    } 

    useEffect(() => {
        handleHeight();
    }, [prompt])

    return (
        <Box className="input">
            <textarea 
                id="promptText"
                type="text"
                value={prompt}
                onChange={handleChange}
                placeholder="graph with 4 nodes in horizontal"
                rows={1}
                onInput={handleHeight}
            />
            <Button 
                variant="contained"
                onClick={getDataFromOpenApi}
                disabled={prompt === "" || chatData[chatData.length-1]?.status === 'working'}
            >
                <SendIcon />
            </Button>
        </Box>
    )
}