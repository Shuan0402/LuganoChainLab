import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Button, Container, Stack, Typography } from '@mui/material';
import { SnackbarProvider, useSnackbar } from 'notistack';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function VerifyVCContent({ vc }) {
    const { enqueueSnackbar } = useSnackbar();

    // 複製 VC 到剪貼簿
    const handleCopy = async () => {
        if (!vc) return;
        try {
            await navigator.clipboard.writeText(JSON.stringify(vc, null, 2));
            enqueueSnackbar("已複製到剪貼簿", { variant: "success" });
            setTimeout(() => setCopySuccess(''), 2000);
        } catch (err) {
            enqueueSnackbar("複製失敗", { variant: "error" });
        }
    };

    // 下載 VC JSON 檔案
    const handleDownload = () => {
        if (!vc) return;
        const blob = new Blob([JSON.stringify(vc, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'verified_vc.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    if (vc) {
        return (
            <Stack spacing={1}>
                <Stack direction='row' spacing={1}>
                    <Button variant='contained' onClick={handleCopy} startIcon={<ContentCopyIcon />}>複製 VC</Button>
                    <Button variant='contained' onClick={handleDownload} startIcon={<FileDownloadIcon />}>下載 VC</Button>
                </Stack>
                <pre style={{ background: '#f0f0f0', padding: 10 }}>
                    {JSON.stringify(vc, null, 2)}
                </pre>
            </Stack>
        );
    }
    return (
        <p>正在載入 VC...</p>
    );
}

export default function VerifyVCFromQR() {
    const query = useQuery();
    const vcUrl = query.get('vc');
    const [vc, setVc] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!vcUrl) return;

        fetch(vcUrl)
            .then(res => res.json())
            .then(data => {
                setVc(data);
            })
            .catch(err => {
                setError('無法載入 VC：' + err.message);
            });
    }, [vcUrl]);

    return (
        <SnackbarProvider anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
            <Container maxWidth="xl" sx={{ marginTop: "15px" }}>
                <Stack spacing={1}>
                    <Stack direction='row' spacing={1} alignItems='center'>
                        <SearchIcon />
                        <Typography variant='h5'><strong>VC 驗證頁</strong></Typography>
                    </Stack>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <VerifyVCContent vc={vc} />
                </Stack>
            </Container>
        </SnackbarProvider>
    );
}
