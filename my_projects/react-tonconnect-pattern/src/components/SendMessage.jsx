import React, { useState } from "react";
import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import TonWeb from "tonweb";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useLanguage } from "../contexts/LanguageContext.jsx"; // Импортируйте контекст



export const SendMessage = ({ ownerAddress }) => {
    const [message, setMessage] = useState("");
    const wallet = useTonWallet();
    const [tonConnectUI] = useTonConnectUI();
    const tonWeb = new TonWeb();
    
    const { language, translations } = useLanguage(); // Извлечение данных из контекста

    const handleSend = async () => {
        if (!message) return alert(translations[language].enterMessage);

        const priceForPay = 0.025;
        const feeServicePrice = 0.025;
        const feeBurnAddress = "UQDZmg4lBYBhTQslgJ-MWg9RKYa2Pjf07ul60OYLrtnfYLHx";
        const textOf2msg = "Service fee";

        const pay = Math.floor(priceForPay * 1000000000).toString(); // Перевод суммы в нано-тонны
        const fee = Math.floor(feeServicePrice * 1000000000).toString();

        const cell1 = new tonWeb.boc.Cell();
        cell1.bits.writeUint(0, 32);
        cell1.bits.writeString(message);

        const cell2 = new tonWeb.boc.Cell();
        cell2.bits.writeUint(0, 32);
        cell2.bits.writeString(textOf2msg);

        const payload1 = TonWeb.utils.bytesToBase64(await cell1.toBoc());
        const payload2 = TonWeb.utils.bytesToBase64(await cell2.toBoc());

        if (!wallet) {
            tonConnectUI.openModal();
        } else {

            try {
                console.log("tonConnectUI:", tonConnectUI); // Выводим объект tonConnectUI в консоль

                // if (!tonConnectUI || typeof tonConnectUI.sendTransaction !== 'function') {
                //   console.error("sendTransaction is not a function. Make sure you are plugged into a wallet.");
                //   return null; // Или отображаем предупреждение пользователю
                // }
                console.log(`Адрес адресата: ${ownerAddress}`);
                await tonConnectUI.sendTransaction({
                    validUntil: Math.floor(Date.now() / 1000) + 360,
                    messages: [
                        {
                            amount: pay,
                            address: ownerAddress,
                            payload: payload1,
                        },
                        {
                            amount: fee,
                            address: feeBurnAddress,
                            payload: payload2,
                        }
                    ],
                });
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" , gap: '20px', color: "white",
            fontSize: "55px", fontWeight: '600', marginTop: '20px',marginBottom: '30px'}}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                3.
                <p style={{ fontSize: "28px", width: "200px" }}>
                  {translations[language]?.headerstep2 ||
                    translations["en"].headerstep2}
                </p>
            </div>
           
            <TextField
                label={translations[language].placeholder2}
                variant="outlined"
                multiline
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{ width: "300px" }}
                sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'white',
                        border: '2px solid white' // Цвет рамки
                      },
                      '&:hover fieldset': {
                        borderColor: 'white', // Цвет рамки при наведении
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'white', // Цвет рамки при фокусе
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'white', // Цвет текста лейбла
                    },
                    // Белый цвет текста в поле ввода
                    '& .MuiInputBase-input': {
                      color: 'white',
                    },
                  }}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleSend}
                style={{ marginTop: "16px" , border: '2px solid white', borderRadius: '25px'}}
                className="sendBtn"
            >
                {translations[language].textsendbtn}
            </Button>
        </div>
    );
};
