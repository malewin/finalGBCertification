import { useLanguage } from "../contexts/LanguageContext.jsx";
import { TonConnectButton } from "@tonconnect/ui-react";
import { Settings } from "./Settings.jsx";

export const Header = ({handleThemeChange, isDarkTheme}) => {

    const { language, translations } = useLanguage();

    return (
        <header className="App-header">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h1
            style={{
              margin: "0",
              fontSize: "100px",
              fontWeight: "900",
              width: "375px",
              fontStretch: "ultra-condensed",
            }}
          >
            {translations[language].nameCollection}
          </h1>
          <div
            style={{
              display: "flex",
              gap: "20px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src="/dogLogo.png"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "25px",
              }}
              alt="resistanceDogLogo"
            />
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <div style={{display: 'flex', margin: 0, padding: 0, alignItems: 'flex-end', justifyContent: 'flex-end',gap: "30px",width: '180px'}}>
              <img style={{width: '50px', height: '50px', borderRadius: '15px', marginLeft: '-100px', background: 'white'}} src="/questionsIcons.png" />
              <img style={{width: '80px', marginBottom: '-20px', marginRight: '10px'}} src="/beta_label.png"/>
              </div>
              
              <h2
                style={{
                  display: "flex",
                  flexDirection: "column",
                  margin: "0",
                }}
              >
                <span>{translations[language].nameApp1}</span>
                {translations[language].nameApp2}
              </h2>
            </div>
            
          </div>
        </div>
        <div
          style={{
            width: "100vw",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        ></div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <Settings
            handleThemeChange={handleThemeChange}
            isDarkTheme={isDarkTheme}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              color: "white",
              fontSize: "55px",
              fontWeight: "600",
            }}
          >
            <div>
              {" "}
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                1.
                <p style={{ fontSize: "28px", width: "150px" }}>
                  {translations[language].walletLinkHeader}
                </p>
              </div>
            </div>
            <TonConnectButton />
          </div>
        </div>
      </header>
    )
}