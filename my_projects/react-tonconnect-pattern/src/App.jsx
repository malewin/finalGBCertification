import "./App.css";
import { useState } from "react";
import { useTonAddress, useTonWallet } from "@tonconnect/ui-react";

import { LanguageProvider } from "./contexts/LanguageContext.jsx";
import { DomainInfo } from "./components/DomainInfo.jsx";
import { SendMessage } from "./components/SendMessage.jsx";
import { Footer } from "./components/Footer.jsx";

import { Buffer } from "buffer/"; // Импортируем Buffer
import { Provider } from "react-redux";
import store from "./store/store.jsx";
import Profile from "./components/Profile.jsx";
import RatingList from "./components/RatingList.jsx"; // Добавьте этот импорт
import { Header } from "./components/Header.jsx";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import FullWidthTabs from "./components/menu.jsx";

if (typeof window !== "undefined") {
  window.Buffer = Buffer;
}

function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const wallet = useTonWallet();
  const address = useTonAddress();
  const [defaultDomainName, setDefaultDomainName] = useState("NONAME");

  const handleDomainParse = async (address) => {
    try {
      const response = await fetch(`https://tonapi.io/v2/accounts/${address}`);
      if (!response.ok)
        throw new Error(
          "Проблемы с поиском данных по адресу для штатного домена"
        );

      const data = await response.json();
      // console.log(JSON.stringify(data, null, 2));
      setDefaultDomainName(data.name);
    } catch (error) {
      console.error(error);
    }
  };

  const handleThemeChange = () => {
    setIsDarkTheme((prevTheme) => !prevTheme);
  };

  const handleWalletConnect = async (walletAddress, userName) => {
    try {
      const response = await fetch("http://localhost:3000/api/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: walletAddress,
          name: defaultDomainName,
          isHasContactsSubs: false,
        }),
      });

      const data = await response.json();
      console.log("Connected user:", data);
    } catch (error) {
      console.error("Error connecting user:", error);
    }
  };
  if (wallet) {
    handleDomainParse(address);
    handleWalletConnect(address, defaultDomainName);
  }

  const background = isDarkTheme
    ? "linear-gradient(rgb(0, 0, 0), rgb(160, 109, 255))"
    : "linear-gradient(-45deg, rgb(107, 161, 255), rgb(227, 107, 211))";

  return (
    <LanguageProvider>
      <Provider store={store}>
        <AppContent
          background={background}
          handleThemeChange={handleThemeChange}
          isDarkTheme={isDarkTheme}
        />
      </Provider>
    </LanguageProvider>
  );
}

const AppContent = ({ background, handleThemeChange, isDarkTheme }) => {
  const [ownerAddress, setOwnerAddress] = useState("");
  const [userName, setUserName] = useState("User"); // Имя пользователя
  const [selectedAvatar, setSelectedAvatar] = useState(""); // Для хранения аватара
  const wallet = useTonWallet();

  const handleAvatarChange = (avatar) => {
    setSelectedAvatar(avatar);
  };

  return (
    <Router>

    <div className="App" style={{ overflow: "scroll", background }}>
      <Header handleThemeChange={handleThemeChange} isDarkTheme={isDarkTheme} />
      <FullWidthTabs />
      <Routes>
        <Route path="/" element={wallet ? <Profile userName={userName} onAvatarChange={handleAvatarChange} /> : <div style={{color: 'white', marginTop: '20px'}}>Please connect your wallet.</div>}  />
        <Route path="/ratings" element={<RatingList />} />
      </Routes>
      <DomainInfo setOwnerAddress={setOwnerAddress} />
      <SendMessage ownerAddress={ownerAddress} />
      <Footer />
    </div>
    </Router>
  );
};

export default App;
