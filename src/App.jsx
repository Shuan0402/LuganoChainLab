import { useState } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { getEthrDID } from './didUtils';
import IssueVC from './IssueVC';
import VerifyVC from './VerifyVC';
import { uploadToPinata } from './pinataUtils';
import { QRCodeSVG } from 'qrcode.react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import VerifyVCFromQR from './VerifyVCFromQR';

function App() {
  const [account, setAccount] = useState(null);
  const [did, setDid] = useState(null);
  const [vc, setVc] = useState(null);
  const [role, setRole] = useState(null);
  const [ipfsUrl, setIpfsUrl] = useState(null);
  const [showQRCode, setShowQRCode] = useState(false); // 控制 QR Code 顯示狀態

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
      setAccount(address);
      const did = getEthrDID(address, network.chainId);
      setDid(did);
    } catch (err) {
      console.error('連接失敗:', err);
    }
  };

  const handleUploadVC = async () => {
    try {
      const { url, cid } = await uploadToPinata(vc, `vc_${did.slice(-10)}.json`);
      alert(`VC 已上傳 Pinata！\nCID: ${cid}\n網址: ${url}`);
      setIpfsUrl(url);
    } catch (error) {
      alert("上傳失敗： " + error);
    }
  };

  const toggleQRCode = () => {
    setShowQRCode(!showQRCode);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div style={{ padding: 20 }}>
            <h1>LuganoChainLab - VC Demo</h1>

            {account ? (
              <>
                <p><strong>錢包地址：</strong> {account}</p>
                <p><strong>DID：</strong> {did}</p>

                {!role ? (
                  <>
                    <h3>選擇你的角色：</h3>
                    <button onClick={() => setRole('teacher')}>我是老師</button>
                    <button onClick={() => setRole('student')}>我是學生</button>
                  </>
                ) : (
                  <>
                    <p><strong>角色：</strong> {role === 'teacher' ? '老師' : '學生'}</p>

                    {role === 'teacher' && (
                      <>
                        <IssueVC account={account} did={did} setVc={setVc} />
                        <button onClick={handleUploadVC} disabled={!vc}>
                          上傳 VC 到 IPFS
                        </button>
                        
                        {ipfsUrl && (
                          <div style={{ marginTop: '20px' }}>
                            <button onClick={toggleQRCode}>
                              {showQRCode ? '隱藏 QR Code' : '顯示 QR Code 驗證'}
                            </button>
                            {showQRCode && (
                              <div style={{ 
                                marginTop: '10px',
                                padding: '15px',
                                border: '1px solid #ddd',
                                borderRadius: '5px',
                                display: 'inline-block',
                                background: 'white'
                              }}>
                                <h4>證書驗證 QR Code</h4>
                                <QRCodeSVG
                                  value={`${window.location.origin}/verify?vc=${encodeURIComponent(ipfsUrl)}`}
                                  size={200}
                                  level="H"
                                  includeMargin={true}
                                />
                                <p style={{ 
                                  marginTop: '10px',
                                  fontSize: '12px',
                                  wordBreak: 'break-all'
                                }}>
                                  {ipfsUrl}
                                </p>
                                <button
                                  style={{ marginTop: '10px' }}
                                  onClick={() => window.open(`${window.location.origin}/verify?vc=${encodeURIComponent(ipfsUrl)}`, '_blank')}
                                >
                                  🔗 開啟驗證頁面
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}

                    {role === 'student' && (
                      <p>你目前為學生身份，無法簽發證書。</p>
                    )}
                  </>
                )}

                <VerifyVC />
              </>
            ) : (
              <button onClick={connectWallet}>使用 MetaMask 登入</button>
            )}
          </div>
        } />
        <Route path="/verify" element={<VerifyVCFromQR />} />
      </Routes>
    </Router>
  );
}

export default App;