import { Button, Grid, TextField, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { uploadToPinata } from './pinataUtils';
import { useAppState } from './AppContext';

export default function SignVCForm({ account, did, setVc }) {
	const { appState, setAppState } = useAppState();
	const { vc } = appState;

	const { enqueueSnackbar } = useSnackbar();

	const [formData, setFormData] = useState({
		name: '',
		course: '',
		grade: '',
		school: 'Plan B Summer School',
	});
	const [issueVCLoading, setIssueVCLoading] = useState(false);
    const [uploadVCLoading, setUploadVCLoading] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value,
		}));
	};

	const issueVC = async () => {
		if (!did || !account) {
			enqueueSnackbar("尚未登入或 DID 未建立", { variant: "error" });
			return;
		}

		if (!formData.name || !formData.course || !formData.grade) {
			enqueueSnackbar("請填寫所有欄位", { variant: "error" })
			return;
		}

		const vcPayload = {
			"@context": ["https://www.w3.org/2018/credentials/v1"],
			type: ["VerifiableCredential", "CourseCredential"],
			issuer: did,
			issuanceDate: new Date().toISOString(),
			credentialSubject: {
				id: did,
				name: formData.name,
				course: formData.course,
				grade: formData.grade,
				school: formData.school,
			},
		};

		
		setIssueVCLoading(true);
		try {
			const signature = await window.ethereum.request({
				method: 'personal_sign',
				params: [JSON.stringify(vcPayload), account],
			});

			const signedVC = {
				...vcPayload,
				proof: {
					jws: signature,
				},
			};

			setVc(signedVC);
			enqueueSnackbar("VC 已簽章成功！", { variant: "success" });
		} catch (err) {
			console.error("簽章失敗:", err);
			enqueueSnackbar("簽章失敗", { variant: "error" });
		} finally {
			setIssueVCLoading(false);
		}
	};

    const handleUploadVC = async () => {
        setUploadVCLoading(true);
        try {
            const { url } = await uploadToPinata(vc, `vc_${did.slice(-10)}.json`);
            enqueueSnackbar(`VC 已上傳 Pinata！`, { variant: "success" });
			setAppState(prev => ({
				...prev,
				ipfsUrl: url
			}));
        } catch (error) {
            enqueueSnackbar("上傳失敗", { variant: "error" });
        } finally {
            setUploadVCLoading(false);
        }
    };

	return (
		<Grid
			container
			component='form'
			onSubmit={issueVC}
			columnSpacing={3}
			rowSpacing={1}
		>
			<Grid item size={12}>
				<Typography variant='h6'>成績資訊</Typography>
			</Grid>
			<Grid item size={3}>
				<TextField
					variant='standard'
					label="學生姓名"
					name="name"
					value={formData.name}
					onChange={handleChange}
					fullWidth={true}
				/>
			</Grid>
			<Grid item size={3}>
				<TextField
					variant='standard'
					label="分數"
					name="grade"
					type="number"
					value={formData.grade}
					onChange={handleChange}
					fullWidth={true}
				/>
			</Grid>
			<Grid item size={6} />
			<Grid item size={3}>
				<TextField
					variant='standard'
					label="課程名稱"
					name="course"
					value={formData.course}
					onChange={handleChange}
					fullWidth={true}
				/>
			</Grid>
			<Grid item size={3}>
				<TextField
					variant='standard'
					label="學校名稱"
					name="school"
					value={formData.school}
					onChange={handleChange}
					fullWidth={true}
				/>
			</Grid>
			<Grid item size={6} />

			<Grid item size='auto'>
				<Button variant='contained' onClick={issueVC} loading={issueVCLoading}>簽發 VC</Button>
			</Grid>
			<Grid item size='auto'>
				<Button variant='contained' onClick={handleUploadVC} disabled={!vc} loading={uploadVCLoading}>
					上傳 VC 到 IPFS
				</Button>
			</Grid>
		</Grid>
	);
}
