import { useState } from 'react';
import { ethers } from 'ethers';

export default function VerifyVC() {
  const [vcText, setVcText] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);

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

  return (
    <div style={{ padding: 20, border: '1px solid #ccc', marginTop: 40 }}>
      <h2>🔍 VC 驗證</h2>
      <textarea
        rows="12"
        cols="80"
        placeholder="貼上 VC JSON..."
        onChange={(e) => setVcText(e.target.value)}
      />
      <br />
      <button onClick={handleVerify}>驗證 VC 簽章</button>

      {verifyResult && (
        <div style={{ marginTop: 20 }}>
          {verifyResult.success ? (
            <p style={{ color: 'green' }}>
              ✅ 驗證成功！由 <code>{verifyResult.signer}</code> 簽發
            </p>
          ) : verifyResult.error ? (
            <p style={{ color: 'red' }}>❌ 驗證失敗，格式錯誤或 JSON 無效</p>
          ) : (
            <p style={{ color: 'red' }}>
              ❌ 驗證失敗，實際簽署人是 <code>{verifyResult.signer}</code>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
