import { Button, Typography } from "@mui/material";
import { signIn } from "next-auth/react";
import GOOGLEIMG from "../google.png";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";

export async function SignIn() {
    const handleClick = async () => {
        signIn("google");
        // const s = await getServerSession(authConfig);
        console.log('s');
        // setSession(null);
    }
    return (
        <Button onClick={handleClick} variant="contained" style={{
            backgroundColor: 'white',
            color: 'black',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1vw'
        }}>
            <Image src={GOOGLEIMG} alt="google-logo" width={20} height={20} />
            <Typography variant="body">Continue with google</Typography>
        </Button>
    )
}