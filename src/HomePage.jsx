import { useEffect, useState } from 'react';
import VerifyVC from './VerifyVC';
import { Button, Container, Divider, Grid, Stack, Typography } from '@mui/material';
import { useAppState } from './AppContext';
import { useNavigate } from 'react-router-dom';
import SignVC from './SignVC';
import { SnackbarProvider } from 'notistack';

export default function HomePage() {
    const { appState } = useAppState();
    const { account, did } = appState;
    const navigate = useNavigate();
    
    const [role, setRole] = useState(null);

    useEffect(() => {
        if (!account) {
            navigate('/login', { replace: true });
        }
    }, []);

    if (account) {
        return (
            <SnackbarProvider anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                <Container maxWidth="xl" sx={{ marginTop: "15px" }}>
                    <Grid container spacing={2} alignItems='center' justifyContent='center' sx={{ width: "100%" }}>
                        <Grid item size={12}>
                            <Typography variant='h4' gutterBottom sx={{ textAlign: 'center' }}>
                                LuganoChainLab - VC Demo
                            </Typography>
                        </Grid>
                        <Grid item size={12}>
                            <strong>錢包地址：</strong> {account}
                        </Grid>
                        <Grid item size={12}>
                            <strong>DID：</strong> {did}
                        </Grid>
                    </Grid>
                    <Divider sx={{ margin: "15px 0", borderWidth: "1.5px", borderColor: "#b0b0b0" }} />
                    {
                        !role ?
                            <Stack direction='row' spacing={1}>
                                <Typography variant='h6'>選擇你的角色：</Typography>
                                <Button variant='contained' onClick={() => setRole('teacher')}>我是老師</Button>
                                <Button variant='contained' onClick={() => setRole('student')}>我是學生</Button>
                            </Stack>
                        :
                        <Stack direction='row' spacing={1}>
                            <Typography variant='h6'><strong>角色：</strong> {role === 'teacher' ? '老師' : '學生'}</Typography>
                        </Stack>
                    }

                    {role === 'teacher' && <SignVC />}

                    {role === 'student' && (
                        <p>你目前為學生身份，無法簽發證書。</p>
                    )}

                    <VerifyVC />
                </Container>
            </SnackbarProvider>
        );
    }
    return (<></>);
}