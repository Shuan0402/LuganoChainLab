import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import VerifyVCFromQR from './VerifyVCFromQR';
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import { AppContextProvider } from './AppContext';

function App() {
    return (
        <AppContextProvider>
            <Router basename='/LuganoChainLab'>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/verify" element={<VerifyVCFromQR />} />
                    <Route path="/" element={<HomePage />} />
                </Routes>
            </Router>
        </AppContextProvider>
    );
}

export default App;