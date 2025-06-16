import { useState } from 'react';
import SignVCForm from './SignVCForm';
import { useAppState } from './AppContext';
import QRCodeModal from './QRCodeDialog';
import { Button, Stack } from '@mui/material';

export default function SignVC() {
    const { appState, setAppState } = useAppState();
    const { account, did, ipfsUrl } = appState;

    const [showQRCode, setShowQRCode] = useState(false); // 控制 QR Code 顯示狀態

    const showQRCodeDialog = () => {
        setShowQRCode(true);
    };

    const hideQRCodeDialog = () => {
        setShowQRCode(false);
    };

    return (
        <Stack spacing={2} alignItems='baseline' sx={{ marginTop: "20px" }}>
            <SignVCForm account={account} did={did} setVc={(vc) => {
                setAppState(prev => ({
                    ...prev,
                    vc
                }))
            }} />
            
            {ipfsUrl && (
                <>
                    <Button variant='contained' onClick={showQRCodeDialog}>顯示 QR Code 驗證</Button>
                    <QRCodeModal ipfsUrl={ipfsUrl} open={showQRCode} onClose={hideQRCodeDialog} />
                </>
            )}
        </Stack>
    );
}