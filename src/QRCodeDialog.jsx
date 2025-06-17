import { Button, Dialog, DialogContent, DialogTitle, IconButton, Stack } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import LinkIcon from '@mui/icons-material/Link';
import { QRCodeSVG } from 'qrcode.react';

export default function QRCodeModal(props) {
    const { ipfsUrl, open, onClose } = props;

    return (
        <Dialog
            open={open}
            onClose={onClose}
        >
            <DialogTitle>
                證書驗證 QR Code
            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={onClose}
                sx={(theme) => ({
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: theme.palette.grey[500],
                })}
                >
                <CloseIcon />
            </IconButton>
            <DialogContent dividers>
                <Stack>
                    <QRCodeSVG
                        value={`${window.location.origin}/LuganoChainLab#verify?vc=${encodeURIComponent(ipfsUrl)}`}
                        size={200}
                        level="H"
                        includeMargin={true}
                    />
                    {/* <p style={{ 
                        marginTop: '10px',
                        fontSize: '12px',
                        wordBreak: 'break-all'
                    }}>
                        {ipfsUrl}
                    </p> */}
                    <Button
                        variant='outlined'
                        style={{ marginTop: '10px' }}
                        onClick={() => window.open(`${window.location.origin}/LuganoChainLab#verify?vc=${encodeURIComponent(ipfsUrl)}`, '_blank')}
                    >
                        <LinkIcon sx={{ marginRight: "5px" }} />開啟驗證頁面
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    );
}