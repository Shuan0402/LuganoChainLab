# LuganoChainLab 🔗🎓

LuganoChainLab 是一套基於區塊鏈的學習認證與教育記錄平台，致力於為參與 **Plan B Summer School** 及未來歐洲教育機構的學生，提供 **可驗證、可持久、具國際認可** 的學習證書與技能履歷。

> 🔐 核心理念：透過 DID + VC 技術，打造去中心化的數位學習證明。

---

## 📌 簡述

本平台結合去中心化身份識別（**DID**）與可驗證憑證（**Verifiable Credentials, VC**）標準，讓教育機構能夠為學生簽發可信的數位證書，並由學生自主儲存、展示與分享。

---

## 🏗️ 核心技術架構

| 模組         | 技術選型                         | 功能簡述                                 |
|--------------|----------------------------------|------------------------------------------|
| 使用者登入   | MetaMask / WalletConnect         | 以錢包登入，作為 DID 基礎識別           |
| DID 管理     | `did:ethr`, SpruceID             | 建立去中心化身份憑證                     |
| 證書簽發     | W3C VC JSON-LD + Ethereum/Polygon| 教育機構簽章 VC 或 NFT 發證              |
| 證書驗證     | 前端 + QR Code + JWS 驗章         | 支援 HR 或第三方機構即時掃描驗證         |
| 證書儲存     | IPFS / Arweave                   | 永久存證，不依賴中心伺服器               |

---

## 🔧 開發流程

### 1. 學員註冊與登入（DID 建立）

- 使用者透過錢包（如 MetaMask）登入，即可產生唯一的 `DID` 身份。

### 2. 證書簽發（教師端）

- 教職員於平台輸入學生修課資料。
- 平台簽發 **VC 證書（JSON-LD 格式）**，並使用錢包完成簽章。

### 3. 證書儲存與發送

- VC 上傳至 IPFS / Arweave。
- 可透過鏈上訊息、DID 通訊或 NFT Token Gate 發送至學生個人儲存空間。

### 4. 第三方驗證（HR / 招聘方）

- 掃描證書 QR Code，驗證 VC 簽章與來源是否可信。
- 不依賴中心伺服器，確保資料未遭竄改。

---

## 🎯 預期成果

### ✅ 技術成果

- 支援 VC / NFT 格式的鏈上學習證書。
- 整合 DID 身份系統與區塊鏈錢包登入流程。
- 提供企業端 / HR 的 VC 驗證介面與掃碼工具。

### 📚 報告佐證

- DID / VC 國際規範介紹。
- 與 Blockcerts（MIT Media Lab）等既有專案比較。
- 歐洲教育機構對區塊鏈學習證明的接受度分析。

### 📈 可行性資料

- 使用開源工具與標準規範，開發成本低。
- 三方受益者：學生、教育機構、雇主。
- 瑞士與歐洲區域具法規友善環境。

---

## 🌐 延伸應用

- 整合 LinkedIn、Behance、GitHub 等展示平台。
- 搭配 AI 模型提供履歷評分與詐欺分析。
- 作為 DAO 教育單位之學歷發證模組。

---

## 📂 專案結構（摘要）

```bash
LuganoChainLab/
├── App.jsx                 # React 主應用
├── IssueVC.jsx             # 教師端 VC 簽發介面
├── VerifyVC.jsx            # 學生端 VC 驗證介面
├── VerifyVCFromQR.jsx      # 掃 QR 進入的驗證頁面
├── pinataUtils.js          # 上傳至 IPFS（Pinata）
├── didUtils.js             # DID 建立與格式化
└── ...其他模組


🚀 快速開始
# 安裝依賴
npm install

# 啟動開發伺服器
npm start
