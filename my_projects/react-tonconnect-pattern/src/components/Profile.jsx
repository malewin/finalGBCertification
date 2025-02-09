import React, { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useTonAddress, useTonWallet } from "@tonconnect/ui-react";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import { DomainChoiser } from "./DomainChoiser.jsx";
import { useSelector, useDispatch } from "react-redux";
import { fetchNfts, updateProfile } from "../reducers/actions.jsx";
import AvatarFetcher from "./AvatarFetcher.jsx";
import { fetchUsers } from '../reducers/actions.jsx'; // Добавляем импорт action для fetchUsers
import { NomisComponent } from "./NomisComponent.jsx";
import { GiftComponent } from "./GiftComponent.jsx";
import { UsernameComponent } from "./UsernameComponent.jsx";
import { SubscriptionInfo } from "./SubscriptionInfo.jsx";
import punycode from 'punycode';


const Profile = ({ userName, onAvatarChange }) => {
    const [loading, setLoading] = useState(true);
    const [selectedNft, setSelectedNft] = useState("");
    const [selectedNomisNft, setSelectedNomisNft] = useState(null); // Состояние для выбранного Diamond NFT
    const [selectedGiftNft, setSelectedGiftNft] = useState(null); // Состояние для выбранного Gift NFT
    const [selectedUsernameNft, setSelectedUsernameNft] = useState(null); 
    const [domainRarity, setDomainRarity] = useState(0);
    const [diamondRarity, setDiamondRarity] = useState(0);
    const [giftRarity, setGiftRarity] = useState(0);
    const [totalRarity, setTotalRarity] = useState(0);
    const [domainName, setDomainName] = useState("");
    
    const walletAddress = useTonAddress();
    const wallet = useTonWallet();
    const { language, translations } = useLanguage();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const users = useSelector((state) => state.users);
    const [isHasContactsSubs, setIsHasContactsSubs] = useState(false);
    const [contactsSubsTimestamp, setContactsSubsTimestamp] = useState(null);
    const [usernameTelegram, setUsernameTelegram] = useState(null);
    const [userIndex, setUserIndex] = useState(0);

    const [editMode, setEditMode] = useState(false);

    

    useEffect(() => {
        dispatch(fetchUsers()); // Получаем пользователей при загрузке компонента
    }, [dispatch]);

    useEffect(() => {
        const user = users.find(user => user.address === walletAddress);
        const userIndex = users.findIndex((u) => u.id === user.id) + 1;
        console.log(`Подключенный юзер: ${JSON.stringify(user)}`);
        if (user) {
            setIsHasContactsSubs(user.isHasContactsSubs || false);
            setContactsSubsTimestamp(user.contactsSubsTimestamp || null);
            setSelectedNft(user.avatarAddress);
            setDomainName(user.newDomainName);
            setSelectedNomisNft({ image: user.nomisAddress || null });
            setSelectedGiftNft({ urlImg: user.giftAddress || null, animation: user.giftLottie || null});
            setSelectedUsernameNft({ image: user.usernameImgAddress || null});
            setTotalRarity(user.rarity || 0);
            setUsernameTelegram(user.usernameTelegram || null);
            setUserIndex(userIndex);
           
        }

    }, [users, walletAddress]);
   
    useEffect(() => {
        if (walletAddress && wallet) {
            setLoading(true); // Установка загрузки в true перед началом фетча
            dispatch(fetchNfts(walletAddress)).then(() => setLoading(false)); // Установка загрузки в false после завершения фетча
        }
    }, [wallet, walletAddress, dispatch]);

    const calculateRarity = (name) => {
        if (!name) return 0;
        const length = name.length;
        switch (length) {
            case 4: return 100;
            case 5: return 50;
            case 6: return 40;
            case 7: return 30;
            case 8: return 20;
            case 9: return 10;
            case 10: return 5;
            default: return 1;
        }
    };

    const calculateRarityNomis = (value) => {
        if (!value) return 0;
        const percents= value.toFixed(2);
        return percents;
    };

    const updateProfileData = () => {
        const profileData = {
            address: walletAddress,
            newDomainName: domainName || user.newDomainName,
            avatarAddress: selectedNft,
            nomisAddress: selectedNomisNft?.image,
            giftAddress: selectedGiftNft?.urlImg,
            giftLottie: selectedGiftNft?.animation,
            usernameImgAddress: selectedUsernameNft?.image, // Ссылка на картинку
            usernameAddress: selectedUsernameNft?.address, // Значение извлеченное из NFT
            rarity: totalRarity,
            score: user.score || 0 ,
            usernameTelegram: selectedUsernameNft?.name
        };
    
        dispatch(updateProfile(profileData));
        dispatch(fetchUsers());
        setEditMode(false);
        alert(`${translations[language].profileUpdated}`);
    };
    

    const handleDomainChange = (domain) => {
        setDomainName(domain); // Сохранение имени домена
        if (domain) {
            const punycodeDomain = punycode.toASCII(domain); 
            const rarity = calculateRarity(punycodeDomain);
            setDomainRarity(rarity);
        } else {
            setDomainRarity(0); // Если домен не выбран, устанавливаем rarity в 0
        }
        updateTotalRarity();
    };

    const handleDiamondRarityChange = (rarity) => {
        setDiamondRarity(rarity); // Устанавливаем rarity при выборе Diamond NFT
        updateTotalRarity(); // Обновляем общую rarity
    };

    const updateTotalRarity = () => {
        const subscriptionBonus = isHasContactsSubs ? 50 : 0; 
        setTotalRarity((Number(domainRarity) + Number(diamondRarity) + Number(giftRarity)+ subscriptionBonus).toFixed(2));
    };

    const handleAvatarSelect = (event) => {
        setSelectedNft(event.target.value);
        onAvatarChange(event.target.value);
    };

    useEffect(() => {
        updateTotalRarity(); // Пересчет общей rarity каждый раз при изменении
    }, [domainName, domainRarity, diamondRarity, giftRarity, isHasContactsSubs]);

    const getFontSize = (length) => {
        if (length <= 8) return '30px'; // Начальный размер шрифта
        if (length <= 12) return '24px'; // Начальный размер шрифта
        if (length <= 24) return '22px'; // Уменьшение для 21-31 символов
        if (length <= 42) return '18px'; // Уменьшение для 32-42 символов
        if (length <= 53) return '10px'; // Уменьшение для 43-53 символов
        if (length <= 64) return '8px'; // Уменьшение для 54-64 символов
        if (length <= 128) return '6px'; // Уменьшение для 65-75 символов
        return '6px'; // Минимальный размер шрифта
    };

    // const usernameWithotDog = usernameTelegram ? usernameTelegram.replace('@', '') : '';

    return (
        <Box textAlign="center" mb={4} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px'}}>
            {loading && (
                <Box mt={4} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", color: 'white' }}>
                    <img src='/searchDog.gif' alt="Preview" style={{ width: "200px", borderRadius: "25px" }} />
                    <Typography style={{ color: 'white' }}>{translations[language].loadingNFTS}</Typography>
                </Box>
            )}
            {!loading && (
                <>
                {!editMode ? 
                    (
                        domainName ? (
                            <>
                                <h3 style={{ color: 'white', fontSize: '36px' }}>{translations[language].profile}</h3>
                                <div style={{ position: 'relative', display: 'inline-block' }}>
                                    {selectedNft && <img 
                                        src={selectedNft} 
                                        alt="Avatar" 
                                        style={{ width: "240px", height: "240px", border: '2px solid white', borderRadius: '25px' }} 
                                    />}
                                    {selectedNomisNft && selectedNomisNft.image && (
                                        <img 
                                            src={selectedNomisNft.image} 
                                            alt="Diamond NFT" 
                                            style={{ position: 'absolute', top: '0', left: '0', width: '80px', height: '80px', borderRadius: '10px', border: '2px solid white' }} 
                                        />
                                    )}
                                    {selectedGiftNft && selectedGiftNft.urlImg && (
                                        <img 
                                            src={selectedGiftNft.urlImg} 
                                            alt="Gift NFT" 
                                            style={{ position: 'absolute', bottom: '3px', right: '0', width: '80px', height: '80px', borderRadius: '10px', border: '2px solid white' }} 
                                        />
                                    )}
                                    {selectedUsernameNft && selectedUsernameNft.image && (
                                        <img 
                                            src={selectedUsernameNft.image} 
                                            alt="Username NFT" 
                                            style={{ position: 'absolute', bottom: '3px', left: '0', width: '80px', height: '80px', borderRadius: '10px', border: '2px solid white' }} 
                                        />
                                    )}
                                    {domainName && (
                                        <Typography style={{ 
                                            position: 'absolute', 
                                            top: '10px', 
                                            right: '20px', 
                                            fontSize: getFontSize(domainName.length), 
                                            color: 'white', 
                                            textShadow: '2px 2px 2px black',
                                            width: '135px',
                                            wordBreak: 'break-word' 
                                        }}>
                                           {domainName}
                                        </Typography>
                                    )}
                                </div>
                                <a href={`https://tonviewer.com/${user.newDomainName}`} style={{display: 'flex', justifyContent: 'center'}}>
                                    <Typography variant="h5" style={{ color: 'white', maxWidth: '280px', wordBreak: 'break-word' }}>
                                        {domainName}.ton
                                    </Typography>
                                </a>

                                <div style={{display: 'flex', justifyContent: 'center'}}>
                                <tbody>
                                    
                                    <tr>
                                        <td><Typography style={{ color: 'white' , width: '80px'}}>{translations[language].ratingPlaceHeader}</Typography></td>
                                        <td><Typography style={{ color: 'white' , width: '140px', wordBreak: 'break-word'}}>{userIndex}</Typography></td>
                                    </tr>
                                    <tr>
                                        <td><Typography style={{ color: 'white' }}>{translations[language].avatar}</Typography></td>
                                        <td><img src={selectedNft} alt='no NFT' style={{width: '100px', height: '100px', border: '1px solid white', borderRadius:    '25px'}}/></td>
                                    </tr>
                                    <tr>
                                        <td><Typography style={{ color: 'white' }}>{translations[language].nomisscore}</Typography></td>
                                        <td>{selectedNomisNft.image && (<img src={selectedNomisNft.image} alt='no NFT' style={{width: '100px', height: '100px', border: '1px solid white', borderRadius:     '25px'}}/>)}</td>
                                    </tr>
                                    <tr>
                                        <td><Typography style={{ color: 'white' }}>{translations[language].gift}</Typography></td>
                                        <td style={{display: 'flex', justifyContent: 'center'}}> {selectedGiftNft.animation && (
                                            <div style={{ width: '100px', height: '100px', border: '1px solid white', borderRadius: '25px', overflow: 'hidden', boxSizing: 'border-box' }}>
                                                {selectedGiftNft.animation ? <lottie-player
                                                    autoplay
                                                    loop
                                                    mode="normal"
                                                    src={selectedGiftNft.animation}
                                                    style={{ width: '100%', height: '100%' }}
                                                ></lottie-player> : 'No NFT'}
                                            
                                            </div>
                                        )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><Typography style={{ color: 'white' , width: '80px'}}>{translations[language].username}</Typography></td>
                                        <td><a href={`https://t.me/${usernameTelegram}`}><img src={selectedUsernameNft.image} alt='no NFT' style={{width: '100px', height: '100px', border: '1px solid white', borderRadius:  '25px'}}/></a></td>
                                    </tr>

                                    <SubscriptionInfo isHasContactsSubs={isHasContactsSubs} contactsSubsTimestamp={contactsSubsTimestamp}/>
                                    
                                </tbody>
                            </div>
            
                               
            
                                <Button variant="contained" className="sendBtn" style={{border: '2px solid white', borderRadius: '25px' }} onClick={() => setEditMode(true)}>
                                    {translations[language].editBtn}
                                </Button>
                            </>
                        ) : (<>
                            <h3 style={{ color: 'white', fontSize: '36px' }}>{translations[language].profile}</h3>
                            <Button variant="contained" className="sendBtnActive" style={{border: '2px solid white', borderRadius: '25px' }} onClick={() => setEditMode(true)}>
                                {translations[language].editBtn}
                            </Button></>
                        )
                    ) : 
                    (
                        <> 
                            <h3 style={{ color: 'white', fontSize: '36px' }}>{translations[language].profile}</h3>
                            <div style={{ position: 'relative', display: 'inline-block' }}>
                                {selectedNft && <img 
                                    src={selectedNft} 
                                    alt="Selected NFT" 
                                    style={{ width: "240px", height: "240px", border: '2px solid white', borderRadius: '25px' }} 
                                />}

                                {selectedNft && selectedNomisNft && selectedNomisNft.image &&(
                                    <img 
                                        src={selectedNomisNft.image} 
                                        alt="Diamond NFT" 
                                        style={{ position: 'absolute', top: '0', left: '0', width: '80px', height: '80px', borderRadius: '10px',border: '2px solid              white' }} 
                                    />
                                )}
                                {selectedNft && selectedGiftNft && selectedGiftNft.urlImg && (
                                    <img 
                                        src={selectedGiftNft.urlImg} 
                                        alt="Gift NFT" 
                                        style={{ position: 'absolute', bottom: '3px', right: '0', width: '80px', height: '80px', borderRadius: '10px', border: '2px             solid   white' }} 
                                    />
                                )}
                                {selectedNft && selectedUsernameNft && selectedUsernameNft.image && (
                                    <img 
                                        src={selectedUsernameNft.image} 
                                        alt="Gift NFT" 
                                        style={{ position: 'absolute', bottom: '3px', left: '0', width: '80px', height: '80px', borderRadius: '10px', border: '2px          solid    white' }} 
                                    />
                                )}
                                {selectedNft && domainName && (
                                    <Typography style={{ 
                                        position: 'absolute', 
                                        top: '0', 
                                        right: '20px', 
                                        fontSize: getFontSize(domainName.length), 
                                        color: 'white', 
                                        textShadow: '2px 2px 2px black',
                                        width: '135px',
                                        wordBreak: 'break-word' 
                                    }}>
                                       {domainName}
                                    </Typography>
                                )}
                            </div>
                            <Typography variant="h5" style={{ color: 'white' }}>{userName}</Typography>
                            
                            <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', alignItems: 'center'}}>
                                <p style={{ color: 'white', width: '80px' }}>{translations[language].domainName}</p>
                                <DomainChoiser onDomainChange={handleDomainChange} />
                                <p style={{color: 'white'}}>+{domainRarity}</p>
                            </div>
                            
                            <AvatarFetcher 
                                walletAddress={walletAddress} 
                                selectedNft={selectedNft} 
                                onAvatarSelect={handleAvatarSelect} 
                                translations={translations}
                                // onDiamondNftsChange={setDiamondNfts} 
                            />

                            <NomisComponent 
                                walletAddress={walletAddress} 
                                onRarityChange={handleDiamondRarityChange} 
                                calculateRarityNomis={calculateRarityNomis} 
                                setSelectedNomisNft={setSelectedNomisNft} // Передаём функцию для установки выбранного Diamond NFT
                                rarity={diamondRarity}
                            
                            />
                            <GiftComponent 
                                walletAddress={walletAddress} 
                                onRarityChange={setGiftRarity} 
                                calculateRarity={calculateRarity} 
                                setSelectedGiftNft={setSelectedGiftNft} // Передаём функцию для установки выбранного Gift NFT
                                rarity={giftRarity}
                            />
                            <UsernameComponent 
                                walletAddress={walletAddress} 
                                // onRarityChange={setGiftRarity} 
                                // calculateRarity={calculateRarity} 
                                setSelectedUsernameNft={setSelectedUsernameNft} // Передаём функцию для установки выбранного Gift NFT
                            />

                            <SubscriptionInfo isHasContactsSubs={isHasContactsSubs} contactsSubsTimestamp={contactsSubsTimestamp}/>
                            
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                                <h3 style={{ color: 'white' }}>{translations[language].rarity} {totalRarity}</h3>
                                <Button variant="contained" className="sendBtn" style={{border: '2px solid white', borderRadius: '25px' }} onClick={updateProfileData}>{translations[language].updateProfileBtn}</Button>
                            </div>
                        </>
                    )
                }
                </>
            )}
        </Box>
    );
};

export default Profile;







