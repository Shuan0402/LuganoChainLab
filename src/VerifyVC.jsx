import { useState } from 'react';
import { ethers } from 'ethers';
import SearchIcon from '@mui/icons-material/Search';
import ArrowRight from '@mui/icons-material/KeyboardArrowRight';
import ArrowDown from '@mui/icons-material/KeyboardArrowDown';
import { Button, Collapse, Stack, TextField, Typography } from '@mui/material';

export default function VerifyVC() {
    const [vcText, setVcText] = useState('');
    const [verifyResult, setVerifyResult] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const handleVerify = () => {
        try {
            const vc = JSON.parse(vcText);
            const jws = vc.proof?.jws;
            const unsignedVC = { ...vc };
            delete unsignedVC.proof;

            const recoveredAddress = ethers.utils.verifyMessage(
                JSON.stringify(unsignedVC),
                jws
            );

            const expectedAddress = vc.issuer.split(':').pop(); // 從 did:ethr:1:0x... 中取出地址

            if (recoveredAddress.toLowerCase() === expectedAddress.toLowerCase()) {
                setVerifyResult({ success: true, signer: recoveredAddress });
            } else {
                setVerifyResult({ success: false, signer: recoveredAddress });
            }
        } catch (err) {
            console.error("驗證失敗", err);
            setVerifyResult({ error: true });
        }
    };

    const showVerify = () => {
        setIsOpen(true);
    };

    const hideVerify = () => {
        setIsOpen(false);
    }

    return (
        <Stack alignItems='baseline' spacing={1}>
            <Stack direction='row' alignItems='center' spacing={1}>
                {isOpen ? <ArrowDown onClick={hideVerify} /> : <ArrowRight onClick={showVerify} />}
                <SearchIcon />
                <Typography variant='h6'>VC 驗證</Typography>
            </Stack>
            <Collapse in={isOpen} sx={{ width: "100%" }}>
                <Stack alignItems='baseline' spacing={1}>
                    <TextField multiline label="VC JSON" rows={12} fullWidth={true} onChange={(e) => setVcText(e.target.value)} />
                    <Stack direction='row' alignItems='center' spacing={1}>
                        <Button variant='contained' onClick={handleVerify}>驗證 VC 簽章</Button>
                        {verifyResult && (
                            <div>
                                {
                                    verifyResult.success ?
                                        <span style={{ color: 'green' }}>
                                            ✅ 驗證成功！由 <code>{verifyResult.signer}</code> 簽發
                                        </span>
                                    : verifyResult.error ?
                                        <span style={{ color: 'red' }}>
                                            ❌ 驗證失敗，格式錯誤或 JSON 無效
                                        </span>
                                    :
                                        <span style={{ color: 'red' }}>
                                            ❌ 驗證失敗，實際簽署人是 <code>{verifyResult.signer}</code>
                                        </span>
                                }
                            </div>
                        )}
                    </Stack>
                </Stack>
            </Collapse>
        </Stack>
    );
}
