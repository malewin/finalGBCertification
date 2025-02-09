import React, { useState } from 'react';
import { Box, Typography } from "@mui/material";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import * as LottiePlayer from "@lottiefiles/lottie-player";
import { useSelector } from 'react-redux';

const ProfileUser = ({ user }) => {
    const { language, translations } = useLanguage();
    console.log(`Ссылка на lottie для подарка ${user.giftLottie}`);

    const users = useSelector((state) => state.users);


    const username = user && user.usernameTelegram ? user.usernameTelegram.replace('@', '') : '';


    const userIndex = users.findIndex((u) => u.id === user.id) + 1;

    const getFontSize = (length) => {
        if (length <= 7) return '20px'; // Начальный размер шрифта
        if (length <= 12) return '16px'; // Начальный размер шрифта
        if (length <= 24) return '14px'; // Уменьшение для 21-31 символов

        return '12px'; // Минимальный размер шрифта
    };

    return (
        <Box textAlign="center" style={{ marginTop: '20px', padding: '10px', backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: '25px' , display: 'flex', flexDirection: 'column', gap: '10px'}}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
            {user.avatarAddress ? (<img
                                                src={user.avatarAddress}
                                                alt="Avatar"
                                                style={{ width: "120px", height: "120px", borderRadius: '25px', border: '2px solid white' }}
                                            />) : (<img
                                                src='/noname.jpg'
                                                alt="Avatar"
                                                style={{ width: "120px", height: "120px", borderRadius: '25px', border: '2px solid white' }}
                                            />)}
                {user.nomisAddress && (
                <img
                    src={user.nomisAddress}
                    alt="Nomis NFT"
                    style={{ position: 'absolute', top: '0', left: '0', width: '40px', height: '40px', borderRadius:'10px', border: '2px solid white' }}
                />
                )}
                {user.giftAddress && (
                    <img
                        src={user.giftAddress}
                        alt="Gift NFT"
                        style={{ position: 'absolute', bottom: '3px', right: '0', width: '40px', height: '40px', borderRadius: '10px', border: '2px solid white' }}
                    />
                )}
                {user.usernameImgAddress && (
                    <img
                        src={user.usernameImgAddress}
                        alt="Username NFT"
                        style={{ position: 'absolute', bottom: '3px', left: '0', width: '40px', height: '40px', borderRadius: '10px', border: '2px solid white' }}
                    />
                )}
                {user.newDomainName && (
                    <Typography style={{
                        position: 'absolute',
                        top: '0',
                        right: '5px',
                        fontSize: getFontSize(user.newDomainName.length),
                        color: 'white',
                        textShadow: '1px 1px 1px black',
                        maxWidth: '80px',
                        wordBreak: 'break-word'
                    }}>
                        {user.newDomainName}
                    </Typography>
                )}
            </div>
            
            <a href={`https://tonviewer.com/${user.address}`} style={{display: 'flex', justifyContent: 'center'}}><Typography variant="h5" style={{ color: 'white' , maxWidth: '280px', wordBreak: 'break-word'}}>{user.newDomainName ? `${user.newDomainName}.ton` : `${user.address}`}</Typography></a>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <tbody>
                    <tr>
                        <td><Typography style={{ color: 'white' , width: '80px'}}>{translations[language].ratingPlaceHeader}</Typography></td>
                        <td><Typography style={{ color: 'white' , width: '140px', wordBreak: 'break-word'}}>{userIndex}</Typography></td>
                    </tr>
                    <tr>
                        <td><Typography style={{ color: 'white' }}>{translations[language].avatar}</Typography></td>
                        <td>{user.avatarAddress && (<img src={user.avatarAddress} alt='no NFT' style={{width: '100px', height: '100px', border: '1px solid white', borderRadius:    '25px'}}/>)}</td>
                    </tr>
                    <tr>
                        <td><Typography style={{ color: 'white' }}>{translations[language].nomisscore}</Typography></td>
                        <td>{user.nomisAddress && (<img src={user.nomisAddress} alt='no NFT' style={{width: '100px', height: '100px', border: '1px solid white', borderRadius:     '25px'}}/>)}</td>
                    </tr>
                    <tr>
                        <td><Typography style={{ color: 'white' }}>{translations[language].gift}</Typography></td>
                        <td style={{display: 'flex', justifyContent: 'center'}}>
                            {user.giftAddress && (
                            <div style={{ width: '100px', height: '100px', border: '1px solid white', borderRadius: '25px', overflow: 'hidden', boxSizing: 'border-box' }}>
                                {user.giftLottie ? <lottie-player
                                    autoplay
                                    loop
                                    mode="normal"
                                    src={user.giftLottie}
                                    style={{ width: '100%', height: '100%' }}
                                ></lottie-player> : 'No NFT'}
                            
                            </div>
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td><Typography style={{ color: 'white' , width: '80px'}}>{translations[language].username}</Typography></td>
                        <td>{user.usernameAddress && (<a href={`https://t.me/${username}`}> <img src={user.usernameImgAddress} alt='no NFT' style={{width: '100px', height: '100px', border: '1px solid white', borderRadius:  '25px'}}/> </a>)}</td>
                    </tr>

                </tbody>
            </div>
            
            <Typography style={{ color: 'white' }}>{translations[language].userRarity} {user.rarity}</Typography>
            
        </Box>
    );
};

export default ProfileUser;
