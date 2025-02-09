import React, { useEffect, useState } from "react";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import { Box } from "@mui/material";
import { useTonAddress, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { fetchUsers } from '../reducers/actions.jsx'; // Добавляем импорт action для fetchUsers
import { useDispatch, useSelector } from "react-redux";
import CheckIcon from '@mui/icons-material/Check';
import { updateContactSubscriptionStatus } from "./SubscriptionPaying.jsx";

const ContactFetcher = ({ walletAddress }) => {
    const [validContacts, setValidContacts] = useState([]);
    const { language, translations } = useLanguage();
    const [loading, setLoading] = useState(false);
    const wallet = useTonWallet();
    const [tonConnectUI] = useTonConnectUI();
    const payerAddressFriendly = useTonAddress();
    const anonNumbersCollectionAddress = "EQAOQdwdw8kGftJCSFgOErM1mBjYPe4DBPq8-AhF6vr9si5N"; 
    const usernamesCollectionAddress = "EQCA14o1-VWhS2efqoh_9M1b_A9DtKTuoqfmkn83AbJzwnPi";
    const dispatch = useDispatch();
    const users = useSelector(state => state.users); 

    const [subscriptionStatus, setSubscriptionStatus] = useState(null);
    const [subscriptionUpdated, setSubscriptionUpdated] = useState(false);

    const fetchNFTs = async (collectionAddress, collectionName) => {
        const limit = 100;
        let offset = 0;
        const filteredNFTs = [];

        while (true) {
            const response = await fetch(
                `https://tonapi.io/v2/accounts/${walletAddress}/nfts?collection=${collectionAddress}&indirect_ownership=true&offset=${offset}&limit=${limit}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                console.error("Ошибка при получении данных:", response.statusText);
                break;
            }

            const data = await response.json();
            if (!data.nft_items.length) break;

            const matchingNFTs = data.nft_items.filter(nft =>
                nft.collection && nft.collection.name === collectionName
            );
            filteredNFTs.push(...matchingNFTs);
            offset += limit;
        }

        return filteredNFTs;
    };

    const checkContacts = async () => {
        setLoading(true);
        try {
            const anonNumbers = await fetchNFTs(anonNumbersCollectionAddress, "Anonymous Telegram Numbers");
            const usernames = await fetchNFTs(usernamesCollectionAddress, "Telegram Usernames");

            const contacts = [];
            anonNumbers.forEach(nft => {
                const number = nft.metadata.name.replace(/\s+/g, '');
                const telegramLink = `https://t.me/${number}`;
                contacts.push(telegramLink);
            });
            usernames.forEach(nft => {
                const username = nft.metadata.name.replace('@', '');
                const telegramLink = `https://t.me/${username}`;
                contacts.push(telegramLink);
            });

            setValidContacts(contacts);
        } catch (error) {
            console.error("Произошла ошибка:", error);
        } finally {
            setLoading(false);
        }
    };

    const checkUserStatus = () => {
        const user = users.find(user => user.address === payerAddressFriendly);
        if (user) {
            setSubscriptionStatus(user.isHasContactsSubs);
        }
    };

    const handlePurchaseClick = async () => {
        await updateContactSubscriptionStatus(wallet, tonConnectUI, payerAddressFriendly);
        dispatch(fetchUsers());
        setSubscriptionUpdated(true); // Устанавливаем статус обновления
    };

    useEffect(() => {   
        checkUserStatus();
    }, [users]);

    useEffect(() => {
        if (walletAddress) {
            checkContacts();
        }
    }, [walletAddress]);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    useEffect(() => {
        // Обновление статуса подписки при изменении wallet
        if (wallet) {
            checkUserStatus(); // Проверить статус подписки при каждом изменении состояния wallet
        } else {
            setSubscriptionStatus(null); // Если wallet отключен, сбросить статус подписки
        }
    }, [wallet, subscriptionUpdated]);

    return (
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', width: '120px',height: '50px'}}>
                            <div style={{ display: 'flex',alignItems: 'center'}}><h2 style={{color: 'white', fontSize: '18px', fontWeight: 600}}>{translations[language].mounthsubscription}</h2></div>
                            
                            {!subscriptionStatus ? (
                        <div onClick={handlePurchaseClick} className="pay_icon" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', borderTopRightRadius: '15px',borderTopLeftRadius: '15px',border: '2px solid white', padding: '5px',borderBottom: 'none'}}><img style={{width: '40px'}} src="./web3_icon.png" alt="web3icon" /><p>50 WEB3</p></div>
                    ) : (
                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', borderTopRightRadius: '15px',borderTopLeftRadius: '15px',border: '2px solid white', padding: '10px',borderBottom: 'none'}}>
                            <CheckIcon  style={{width: '40px', height: '40px', backgroundColor: 'rgb(227, 107, 211)', borderRadius: '50%', border: '1px solid purple', color: 'white'}}/>
                            <p style={{ color: 'white' , fontSize: '14px'}}>{translations[language].availableUntil} {new Date(users.find(user => user.address === payerAddressFriendly)?.contactsSubsTimestamp).toLocaleDateString()}</p>
                        </div>
                    )}
                            {/* <div onClick={() => updateContactSubscriptionStatus()} className="pay_icon" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', borderTopRightRadius: '15px',borderTopLeftRadius: '15px',border: '2px solid white', padding: '5px',borderBottom: 'none'}}><img style={{width: '40px'}} src="./web3_icon.png" alt="web3icon" /><p>50 WEB3</p></div> */}
                            {/* <div onClick={() => updateContactSubscriptionStatus(true)} className="pay_icon" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', borderTopRightRadius: '15px',borderTopLeftRadius: '15px',border: '2px solid white', padding: '5px',borderBottom: 'none'}}><img style={{width: '40px', borderRadius: '50%'}} src="./toncoin_icon.png" alt="web3icon" /></div>
                            <div onClick={() => updateContactSubscriptionStatus(true)} className="pay_icon" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', borderTopRightRadius: '15px',borderTopLeftRadius: '15px',border: '2px solid white', padding: '5px',borderBottom: 'none'}}><img style={{width: '40px', borderRadius: '50%'}} src="./usdt_icon.png" alt="usdticon" /></div> */}
                        </div>
                    </div>
                   
                    <div className="contactsParser" style={{ color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', position: 'relative',
                pointerEvents: !subscriptionStatus ? 'none' : 'all'}}>
                        <div style={{display: "flex", color: "white", flexDirection: 'column', alignItems: 'center', gap: '10px', width: '320px', border: '5px solid white', borderRadius: '25px'}}>
                            <h2>{translations[language]?.contactslist || "Нет валидных ссылок"}</h2>
                            {loading ? (
                                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', color: 'white'}}>
                                    <Box mt={4} style={{display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", color: 'white'}}>
                                        <img src='/searchDog.gif' alt="Preview" style={{ width: "200px", borderRadius: "25px" }} />
                                    </Box>
                                    <p>{translations[language].loading}</p>
                                </div>
                            ) : validContacts.length === 0 ? (
                                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', color: 'white'}}>
                                    <Box mt={4} style={{display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", color: 'white'}}>
                                        <img src='/noresult.gif' alt="Preview" style={{ width: "200px", borderRadius: '25px' }} />
                                    </Box>
                                    <p>{translations[language].notgcontacts}</p> 
                                </div>
                            ) : (
                                <div>
                                    <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', alignItems: 'center' }}>
                                        <h3 style={{ width: '100px' }}>{translations[language]?.followthem}</h3>
                                        <img src="/oktgresult.gif" style={{ width: '100px', height: '100px', borderRadius: '25px' }} alt="Loading" />
                                    </div>
                                    <ul style={{ width: '300px', height: '200px', overflow: 'scroll' }}>
                                        {validContacts.map((contact, index) => (
                                            <li key={index}>
                                                <a href={contact} target="_blank" rel="noopener noreferrer">
                                                    {contact}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                        {!subscriptionStatus && (
                            <div style={{
                                position: 'absolute',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '98%'
                                }}>
                                <div style={{ top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'linear-gradient(to bottom,rgba(128, 128, 128, 0.7) 50%, rgba(61, 147, 203, 0.99) 50%)', // Полупрозрачный серый
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'column',
                                borderRadius: '25px',
                                color: 'white',
                                width: '320px' ,
                                height: '100%',
                                marginTop: '5px',
                                }}>
                                    <span style={{fontSize: '30px', fontWeight: '600'}}>{translations[language].subscriptionPayHeader}</span>
                                    <img src="/WebDuck.gif" style={{width: '150px', height: '150px'}}/>
                                    <div onClick={handlePurchaseClick} className="pay_icon" style={{display: 'flex', justifyContent: 'center', alignItems: 'center',borderRadius: '15px',border: '2px solid white', padding: '5px',borderBottom: 'none', marginTop: '30px'}}><img style={{width: '40px'}} src="./web3_icon.png" alt="web3icon" /><p style={{color: 'black'}}>50 WEB3</p></div>
                                </div>
                            </div>
                    
                )}
                    </div>
                </div>
            );
};

export default ContactFetcher;

