import { useEffect, useState } from 'react';
import VerifyVC from './VerifyVC';
import { Button, Container, Divider, Grid, Stack, Typography } from '@mui/material';
import { useAppState } from './AppContext';
import { useNavigate } from 'react-router-dom';
import SignVC from './SignVC';
import { SnackbarProvider } from 'notistack';
import { TEACHER_WALLETS } from './teacherWallets';

export default function HomePage() {
    const { appState, setAppState } = useAppState();
    const { account, did } = appState;
    const navigate = useNavigate();

    const [role, setRole] = useState(null);

    useEffect(() => {
        if (!account) {
            navigate('/login', { replace: true });
        } else {
            const normalizedAccount = account.toLowerCase();
            if (TEACHER_WALLETS.includes(normalizedAccount)) {
                setRole('teacher');
            } else {
                setRole('student');
            }
        }
    }, [account]);

    const handleLogout = () => {
        setAppState({ account: null, did: null });
        navigate('/login', { replace: true });
    };



    if (!account || !role) return null;

    return (
        <SnackbarProvider anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
            <Container maxWidth="xl" sx={{ marginTop: "15px" }}>
                <Grid container spacing={2} direction="column" alignItems='center' justifyContent='center' sx={{ width: "100%" }}>
                    <Grid item xs={12}>
                        <Typography variant='h4' gutterBottom sx={{ textAlign: 'center' }}>
                            LuganoChainLab - VC Demo
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item>
                                <Typography>
                                    <strong>錢包地址：</strong> {account}
                                </Typography>
                                <Typography>
                                    <strong>DID：</strong> {did}
                                </Typography>
                            </Grid>
                            <Grid item sx={{ ml: 4 }}>
                                <Button variant="outlined" color="error" onClick={handleLogout}>
                                    登出錢包
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Divider sx={{ margin: "15px 0", borderWidth: "1.5px", borderColor: "#b0b0b0" }} />

                <Stack direction='row' spacing={1}>
                    <Typography variant='h6'>
                        <strong>角色：</strong> {role === 'teacher' ? '老師' : '學生'}
                    </Typography>
                </Stack>

                {role === 'teacher' && <SignVC />}
                {role === 'student' && (
                    <p>你目前為學生身份，無法簽發證書。</p>
                )}

                <Divider sx={{ margin: "15px 0", borderWidth: "1.5px", borderColor: "#b0b0b0" }} />

                <VerifyVC />
            </Container>
        </SnackbarProvider>
    );
}
