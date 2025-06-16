import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function VerifyVCFromQR() {
  const query = useQuery();
  const vcUrl = query.get('vc');
  const [vc, setVc] = useState(null);
  const [error, setError] = useState(null);
  const [copySuccess, setCopySuccess] = useState('');

  useEffect(() => {
    if (!vcUrl) return;

    fetch(vcUrl)
      .then(res => res.json())
      .then(data => {
        setVc(data);
      })
      .catch(err => {
        setError('無法載入 VC：' + err.message);
      });
  }, [vcUrl]);

  // 複製 VC 到剪貼簿
  const handleCopy = async () => {
    if (!vc) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(vc, null, 2));
      setCopySuccess('✅ 已複製到剪貼簿');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      setCopySuccess('❌ 複製失敗');
    }
  };

  // 下載 VC JSON 檔案
  const handleDownload = () => {
    if (!vc) return;
    const blob = new Blob([JSON.stringify(vc, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'verified_vc.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🔍 VC 驗證頁</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {vc ? (
        <>
          <div style={{ marginBottom: 10 }}>
            <button onClick={handleCopy}>📋 複製 VC</button>{' '}
            <button onClick={handleDownload}>📥 下載 VC</button>
            {copySuccess && <span style={{ marginLeft: 10 }}>{copySuccess}</span>}
          </div>
          <pre style={{ background: '#f0f0f0', padding: 10 }}>
            {JSON.stringify(vc, null, 2)}
          </pre>
        </>
      ) : (
        <p>正在載入 VC...</p>
      )}
    </div>
  );
}

export default VerifyVCFromQR;
