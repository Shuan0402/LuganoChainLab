import { useState } from 'react';

function IssueVC({ account, did, setVc }) {
  const [form, setForm] = useState({
    name: '',
    course: '',
    grade: '',
    school: 'Plan B Summer School',
  });

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const issueVC = async () => {
    if (!did || !account) {
      alert("尚未登入或 DID 未建立");
      return;
    }

    if (!form.name || !form.course || !form.grade) {
      alert("請填寫所有欄位");
      return;
    }

    const vcPayload = {
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      type: ["VerifiableCredential", "CourseCredential"],
      issuer: did,
      issuanceDate: new Date().toISOString(),
      credentialSubject: {
        id: did,
        name: form.name,
        course: form.course,
        grade: form.grade,
        school: form.school,
      },
    };

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
      alert("✅ VC 已簽章成功！");
    } catch (err) {
      console.error("簽章失敗:", err);
      alert("❌ 簽章失敗，請查看 console");
    }
  };

  return (
    <div style={{ margin: "20px 0" }}>
      <h3>簽發 VC</h3>
      <div>
        <label>
          學生姓名：
          <input type="text" name="name" value={form.name} onChange={handleChange} />
        </label>
      </div>
      <div>
        <label>
          課程名稱：
          <input type="text" name="course" value={form.course} onChange={handleChange} />
        </label>
      </div>
      <div>
        <label>
          分數：
          <input type="text" name="grade" value={form.grade} onChange={handleChange} />
        </label>
      </div>
      <div>
        <label>
          學校名稱：
          <input type="text" name="school" value={form.school} onChange={handleChange} />
        </label>
      </div>
      <button onClick={issueVC}>簽發 VC</button>
    </div>
  );
}

export default IssueVC;
