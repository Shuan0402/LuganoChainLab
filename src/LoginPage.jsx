import { Web3Provider } from '@ethersproject/providers';
import { getEthrDID } from './didUtils';
import { Button, Container, Grid, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useAppState } from './AppContext';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
    const { appState, setAppState } = useAppState();
    const navigate = useNavigate();

    const connectWallet = async () => {
        if (!window.ethereum) {
            alert('請安裝 MetaMask');
            return;
        }

        try {
            const provider = new Web3Provider(window.ethereum);
            await provider.send('eth_requestAccounts', []);
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            const network = await provider.getNetwork();
            const did = getEthrDID(address, network.chainId);
            setAppState(prev => ({
                ...prev,
                account: address,
                did: did
            }));
        } catch (err) {
            console.error('連接失敗:', err);
        }
    };

    useEffect(() => {
        if (appState.account) {
            navigate("/", { replace: true });
        }
    }, [appState]);

    return (
        <Container maxWidth="xl" sx={{ marginTop: "15px" }}>
            <Grid container spacing={2} alignItems='center' justifyContent='center' sx={{ width: "100%" }}>
                <Grid item size={12}>
                    <Typography variant='h4' gutterBottom sx={{ textAlign: 'center' }}>
                        LuganoChainLab - VC Demo
                    </Typography>
                </Grid>
                <Grid item size={12} height='10vh'></Grid>
                <Grid item size={12} justifyContent='center' display='flex'>
                    <Button
                        variant='contained'
                        onClick={connectWallet}>
                        使用 MetaMask 登入
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
}