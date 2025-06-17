import { Box, Button, Container, Grid, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useAppState } from './AppContext';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
    const { appState, setAppState } = useAppState();
    const navigate = useNavigate();

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
            // 強制讓 MetaMask 彈出帳號選擇視窗
            await window.ethereum.request({
                method: 'wallet_requestPermissions',
                params: [{ eth_accounts: {} }],
            });

            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            const selectedAccount = accounts[0];
            // 根據你的流程儲存帳號
            setAppState({
                account: selectedAccount,
                did: `did:ethr:1:${selectedAccount}`
            });

            navigate('/');
            } catch (error) {
            console.error('Wallet connect error:', error);
            }
        } else {
            alert('請安裝 MetaMask 錢包');
        }
    };


    useEffect(() => {
        if (appState.account) {
        navigate("/", { replace: true });
        }
    }, [appState]);

    return (
        <Container maxWidth="md" sx={{ marginTop: "40px" }}>
        <Grid container direction="column" alignItems="center" spacing={3}>
            {/* 標題 */}
            <Grid item>
            <Typography variant="h4" component="h1" align="center">
                LuganoChainLab - VC Demo
            </Typography>
            </Grid>

            {/* 圖片 */}
            <Grid item>
            <Box
                component="img"
                src={`/LuganoChainLab/homepage.png`}
                alt="封面圖片"
                sx={{
                maxHeight: 300,
                objectFit: "contain",
                }}
            />
            </Grid>

            {/* 登入按鈕 */}
            <Grid item>
            <Button variant="contained" onClick={connectWallet}>
                使用 MetaMask 登入
            </Button>
            </Grid>
        </Grid>
        </Container>
    );
}
