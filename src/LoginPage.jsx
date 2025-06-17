import { Web3Provider } from '@ethersproject/providers';
import { getEthrDID } from './didUtils';
import { Box, Button, Container, Grid, Typography } from '@mui/material';
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
