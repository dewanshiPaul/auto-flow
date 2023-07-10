import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.API_KEY
});

delete configuration.baseOptions.headers['User-Agent'];

const openai = new OpenAIApi(configuration);

const preprocess = (response) => {
    const code = response?.split(/```/g)
    console.log(code[1]);
    return code[1]?.split("mermaid\n")[1] === undefined ? code[1] : code[1]?.split("mermaid\n")[1]
}

export async function sendChatgptRequest(
    chatData,
    setChatData,
    setOpen
) {
    console.log('route',chatData);
    try {
        const res = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: 'user',
                    content: `You are an expert in generating code with Mermaid.js for creating diagrams and visualization. Please provide Mermaid.js code snippet strictly without any explanation of the code snippet for the following prompt:${chatData[chatData.length-1].prompt}`,
                }
            ]
        })
        console.log("res: ",res.data.choices[0].message.content)
        const rsp = preprocess(res.data.choices[0].message.content)
        console.log("rsp:",rsp);
        chatData[chatData.length-1].status = 'success';
        setChatData([...chatData]);
        return {
            message: rsp === undefined ? res.data.choices[0].message.content : rsp,
            status: 200
        }
    } catch(err) {
        console.error(err);
        chatData[chatData.length-1].status = 'error';
        setChatData([...chatData]);
        setOpen(true)
        return {
            error: err.message,
            status: err.type === 'server_error' ? 503 : 500
        }
    }
}