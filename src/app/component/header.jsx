import { Typography } from "@mui/material";

export function Header({size}) {
    return (
        <Typography variant={size} style={{
            fontFamily: "Brush Script MT",
            background: "linear-gradient( to right, #f32170, #ff6b08, #cf23cf, #eedd44)",
            WebkitTextFillColor: "transparent",
            WebkitBackgroundClip: "text",
      }}>
        Auto-Flow
      </Typography>
    )
}