import React, { useEffect, useState } from "react";
import { Typography, Button } from "@mui/material";
import { useTonAddress, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { updateContactSubscriptionStatus } from "./SubscriptionPaying.jsx";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../reducers/actions.jsx";

export const SubscriptionInfo = ({ firstIsHasContactsSubs, firstContactsSubsTimestamp }) => {
    const wallet = useTonWallet();
    const [tonConnectUI] = useTonConnectUI();
    const payerAddressFriendly = useTonAddress();
    const { language, translations } = useLanguage();
    const dispatch = useDispatch();
    const users = useSelector(state => state.users);

    const [isHasContactsSubs, setIsHasContactsSubs] = useState(firstIsHasContactsSubs);
    const [contactsSubsTimestamp, setContactsSubsTimestamp] = useState(firstContactsSubsTimestamp);

    const handleClickBuy = async () => {
        
        const alertMessage = `${translations[language].alertPayWeb3}`;
        const buyWeb3Link = "https://app.ston.fi/swap?utm_source=tonkeeper&utm_medium=organic&utm_campaign=defi&utm_content=EQDCJL0iQHofcBBvFBHdVG233Ri2V4kCNFgfRT-gqAd3Oc86&chartVisible=false&ft=TON&tt=WEB3";
        
            // Выводим алерт с информацией
        alert(alertMessage);
        alert(buyWeb3Link);
        await updateContactSubscriptionStatus(wallet, tonConnectUI, payerAddressFriendly);
        dispatch(fetchUsers()); // Запускаем fetchUsers после покупки
    };

    useEffect(() => {
        const user = users.find(user => user.address === payerAddressFriendly);
        if (user) {
            setIsHasContactsSubs(user.isHasContactsSubs || false);
            setContactsSubsTimestamp(user.contactsSubsTimestamp || null);
        }
    }, [users, payerAddressFriendly]);

    return (
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="body1" style={{ color: 'white' }}>
                Подписка: {isHasContactsSubs ? "Активна, " : ""}
                {contactsSubsTimestamp ? `до ${new Date(contactsSubsTimestamp).toLocaleDateString()}` : 
                <Button variant="contained" className="sendBtn" style={{border: '2px solid white', borderRadius: '25px' }} onClick={handleClickBuy}>
                    {translations[language].buySubscriptionContacts}
                </Button>}
            </Typography>
            <p style={{ color: 'white' }}>{isHasContactsSubs ? '+ 50' : '(+50 NFT Score)'}</p>
        </div>
    );
};
