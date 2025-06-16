import axios from 'axios';

const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;

export async function uploadToPinata(data, fileName = 'vc.json') {
  try {
    // 準備 FormData
    const formData = new FormData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: 'application/json' 
    });
    formData.append('file', blob, fileName);

    // 設定 Pinata 的 metadata（可選）
    const metadata = JSON.stringify({
      name: fileName,
      keyvalues: {
        type: 'verifiable-credential',
        issuer: 'PlanB-SummerSchool'
      }
    });
    formData.append('pinataMetadata', metadata);

    // 發送請求
    const res = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        headers: {
          'Authorization': `Bearer ${PINATA_JWT}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    // 返回 IPFS CID 和網址
    const cid = res.data.IpfsHash;
    return {
      cid,
      url: `https://gateway.pinata.cloud/ipfs/${cid}`,
      explorer: `https://ipfs.io/ipfs/${cid}`
    };
  } catch (error) {
    console.error('Pinata 上傳錯誤:', error.response?.data || error.message);
    throw new Error(`Pinata 上傳失敗: ${error.message}`);
  }
}