"use client"

// import Image from 'next/image'
import styles from './page.module.scss'
import { sendChatgptRequest } from './api/prompt/route'
import { useEffect, useState } from 'react'
import { drawDiagram } from './component/mermaidcanva'
import mermaid from 'mermaid'
import { DownloadButton } from './component/download'
import { Input } from './component/input'
import { Chat } from './component/chat'
import { Alert, AlertTitle, Avatar, Button, CircularProgress, Menu, MenuItem, Snackbar, Typography } from '@mui/material'
import { SignIn } from './component/login'
import { Header } from './component/header'
import { signOut, useSession } from 'next-auth/react'

// make loader to fetch image data to start

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [mermaidCodeSnippet, setMermaidCodeSnippet] = useState("graph LR\n    A --> B\n    B --> C\n    C --> D\n\n");
  const [chatData, setChatData] = useState([]);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { data } = useSession();

  const handlePopoverClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const popoverOpen = Boolean(anchorEl);

  const handleChange = (e) => {
    setPrompt(e.target.value)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleMagnify = (e) => {
    let original = document.querySelector('.mermaidDiv');
    let magnified = document.querySelector('#magnify');
    const { left, top } =original.getBoundingClientRect();
    let style = magnified.style;
    let x = (e.clientX - left) / original.offsetWidth * 100;
    let y = (e.clientY - top) / original.offsetHeight * 100;

    style.backgroundPositionX = x+'%';
    style.backgroundPositionY = y+'%';
    style.left = e.clientX-45+'px';
    style.top = e.clientY-45+'px';

    style.backgroundSize = 'cover';
    style.transform = 'scale(3)';

  }

  const generateId = () => {
    return 'chat_'+document.getElementById('chat').childNodes.length+1
  }

  const updateChatData = () => {
    const id = generateId();
    chatData.push({prompt: prompt, status: "working", id: id});
    setChatData([...chatData]);
  }

  const getData = async () => {
    updateChatData();
    setPrompt("");
    try {
      const code = await sendChatgptRequest(chatData,setChatData,setOpen);
      console.log("code",code)
      setMermaidCodeSnippet(code.message)
    } catch(err) {
      console.error(err)
    }
  }

  useEffect(() => {
      mermaid.initialize({ startOnLoad: true });
      if(data?.user?.name) {
        drawDiagram(mermaidCodeSnippet, chatData, setChatData, setOpen)
      }
  }, [mermaidCodeSnippet]) 

  // console.log(session);

  return (
    <>
    <div className={styles.bg_image}/>
    { !data ? 
      <div className={styles.signin}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          flexDirection: 'column'
        }}>
          <Header size={'h1'}/>
          <SignIn />
        </div>
      </div>
     : 
      <div className={styles.main}> 
        <div className={styles.chat_container}>
          <div className={styles.chat_container_header}>
              <Header size={'h4'} />
              <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1vw',
              }}>
                <Typography variant='body' style={{
                  color: 'white'
                }}>
                  {data?.user?.name}
                </Typography>
                <Avatar 
                  alt="user-avatar" 
                  src={data?.user?.image} 
                  onClick={(e) => handlePopoverClick(e)} 
                  style={{
                    cursor: 'pointer'
                  }}
                />
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={popoverOpen}
                  onClose={handlePopoverClose}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}>
                    <MenuItem 
                      onClick={() => {
                        setAnchorEl(null);
                        signOut();
                      }}
                    >
                      Logout
                    </MenuItem>
                  </Menu>
                </div>
          </div>
          <div id='chat' className={styles.chat_container_body}>
            {
              chatData?.map((d,i) => {
                return <Chat 
                  key={i}
                  prompt={d.prompt}
                  isLoading={d.status}
                  id={d.id}
                />
              })
            }
          </div>
        </div>
        <div className={styles.input_container}>
          <Input 
            prompt={prompt}
            handleChange={handleChange}
            getDataFromOpenApi={getData}
            chatData={chatData}
          />
        </div>
      <div className={styles.diagram}>
        <div className={styles.diagram_header}>
          <span style={{ color: 'white'}}>Preview</span>
          <DownloadButton />
        </div>
        <div 
          className={styles.diagram_drawing}
          onMouseMove={(e) => handleMagnify(e)}
        >
          { chatData[chatData.length-1]?.status === "working" &&
            <div className={styles.loader}>
              <CircularProgress />
            </div>
          }
          <div className='mermaidDiv' id={styles.mermaid_content}/>
          <div id="magnify" className={styles.magnify} />
        </div>
      </div>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center'}}
      >
        <Alert  
          severity='error'
          action = {
            <Button color='inherit' size='small' onClick={handleClose}>
              CLOSE
            </Button>
          }  
        >
          <AlertTitle>
            Success
          </AlertTitle> 
          Request failed due to internal server error or providing <strong>too many request</strong>
        </Alert>
      </Snackbar>
    </div>}
    </>
  )
}
