import DownloadIcon from '@mui/icons-material/Download';
import { Button } from '@mui/material';

export const DownloadButton = () => {
    const handleDownload = () => {
        console.log("download button");
        const ele = document.querySelector(".mermaidDiv");
        if(ele.firstChild) {
            const svgEle = ele.childNodes[0];
            console.log('svg', svgEle);
            
            const svgString = new XMLSerializer().serializeToString(svgEle);
            const data_Url = 'data:image/svg+xml;charset=utf-8;base64,'+window.btoa(unescape(encodeURIComponent(svgString)))
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            const img = new Image();
            img.src = data_Url;

            img.onload = function() {
                console.log('inside');
                canvas.setAttribute('width', img.width*4);
                canvas.setAttribute('height', img.height*4);
                context.drawImage(img, 0, 0);

                const pngUrl = canvas.toDataURL('image/png');
                console.log(pngUrl);

                const a = document.createElement("a");
                a.download = Date.now()+".png";
                a.href = pngUrl;
                document.body.appendChild(a);
                a.click();
            }
        }
    }
    return (
        <Button
            variant='contained'
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
        >
            Download
        </Button>
    )
}