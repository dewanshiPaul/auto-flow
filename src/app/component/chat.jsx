import { Box } from "@mui/material";
import './chat.scss';

export const Chat = ({
    prompt,
    isLoading,
    id
}) => {
    const handlePrompt = () => {
        return prompt.replace(/\n/g,'<br>')
    }
    return (
        <div id={id} style={{
            display: 'flex',
            marginBottom: '1vh'
        }}>
            <div className="chat_box">
                <p style={{
                    whiteSpace: 'pre-wrap'
                }}>
                    {prompt}
                </p>
                <div className="state" style={{
                    backgroundColor: isLoading === 'working' ? 'yellow' : isLoading === 'error' ? 'red' : isLoading === 'success' ? 'lightgreen' : 'transparent'
                }}
                /> 
            </div>
        </div>
    )
}