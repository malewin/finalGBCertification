import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../reducers/actions.jsx'; 
import { Typography, CircularProgress } from '@mui/material';
import { useLanguage } from "../contexts/LanguageContext.jsx";
import ProfileUser from './ProfileUser.jsx'; // Импортируйте компонент ProfileUser

const RatingList = () => {
    const dispatch = useDispatch();
    const users = useSelector((state) => state.users);
    const [loading, setLoading] = useState(true); // Состояние загрузки
    const [selectedUser, setSelectedUser] = useState(null); // Добавлено состояние для выбранного пользователя
    const { language, translations } = useLanguage();

    useEffect(() => {
        const loadUsers = async () => {
            await dispatch(fetchUsers());
            setLoading(false); // Установить загрузку в false после загрузки
        };
        loadUsers();
    }, [dispatch]);

    const handleRowClick = (user) => {
        if (selectedUser === user) {
            setSelectedUser(null); // Сбрасываем выбор пользователя при повторном клике
        } else {
            setSelectedUser(user); // Устанавливаем выбранного пользователя
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <CircularProgress /> {/* Лоадер */}
            </div>
        );
    }

    const getPositionStyle = (index) => {
        switch (index) {
            case 0:
                return { 
                    backgroundColor: 'gold', 
                    borderRadius: '50%', 
                    padding: '10px', 
                    display: 'inline-block',
                    paddingRight: '15px',
                    paddingLeft: '15px',
                    paddingTop: '10px',
                    paddingBottom: '10px',
                    fontWeight: '900', };
            case 1:
                return { 
                    backgroundColor: 'silver', 
                    borderRadius: '50%', 
                    padding: '10px', 
                    display: 'inline-block',
                    paddingRight: '15px',
                    paddingLeft: '15px',
                    paddingTop: '10px',
                    paddingBottom: '10px',
                    fontWeight: '900', };
            case 2:
                return { 
                    backgroundColor: '#cd7f32', 
                    borderRadius: '50%', 
                    padding: '10px', 
                    display: 'inline-block',
                    paddingRight: '15px',
                    paddingLeft: '15px',
                    paddingTop: '10px',
                    paddingBottom: '10px',
                    fontWeight: '900', };
            default:
                return {}; // Для остальных пользователей
        }
    };

    const getFontSize = (length) => {
        if (length <= 7) return '20px'; // Начальный размер шрифта
        if (length <= 12) return '16px'; // Начальный размер шрифта
        if (length <= 24) return '14px'; // Уменьшение для 21-31 символов

        return '12px'; // Минимальный размер шрифта
    };

    return (
        <div>
            <div style={{ marginTop: '20px', textAlign: 'center', color: 'white', border: '2px solid white', borderRadius: '25px', width: '320px'}}>
                <Typography variant="h4" style={{margin: '0', fontWeight: '600'}}>{translations[language].ratingHeader}</Typography>
                <div style={{ height: '450px', overflowY: 'scroll', border: '1px solid white', borderBottomRightRadius: '25px',borderBottomLeftRadius: '25px'}}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ position: 'sticky', top: 0, background: 'rgb(227, 107, 211)', zIndex: 1 }}>
                            <tr>
                                <th style={{ borderRight: '1px solid white' }}>{translations[language].ratingPlaceHeader}</th>
                                <th style={{ borderRight: '1px solid white' }}>{translations[language].ratingUserHeader}</th>
                                <th style={{ borderRight: '1px solid white' }}>{translations[language].ratingNFTScore}</th>
                                <th>{translations[language].ownerField}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={user.id} style={{ borderBottom: '1px solid white' }} onClick={() => handleRowClick(user)}> {/* Добавление обработчика клика */}
                                    <td style={{ borderRight: '1px solid white' }}>
                                        <div style={getPositionStyle(index)}>
                                            {index + 1}
                                        </div>
                                    </td>
                                    <td style={{ borderRight: '1px solid white' }}>
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
                                            {/* Вставьте свои дополнительные изображения */}
                                            {user.nomisAddress && (
                                    <img
                                        src={user.nomisAddress}
                                        alt="Nomis NFT"
                                        style={{ position: 'absolute', top: '0', left: '0', width: '40px', height: '40px', borderRadius: '10px', border: '2px solid white' }}
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
                                                top: '5px',
                                                right: '10px',
                                                fontSize: getFontSize(user.newDomainName.length),
                                                color: 'white',
                                                textShadow: '1px 1px 1px black',
                                                maxWidth: '70px',
                                                wordBreak: 'break-word'
                                            }}>
                                                {user.newDomainName}
                                            </Typography>
                                )}
                                        </div>
                                    </td>
                                    <td>{user.rarity}</td>
                                    <td style={{width: '80px',wordBreak: 'break-word', borderLeft: '1px solid white'}}><a href={`https://tonviewer.com/${user.address}`}>
                                    {user.newDomainName  ? (`${user.newDomainName}.ton`) : ('wallet')}
                                   
                                    </a></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {selectedUser && <ProfileUser user={selectedUser} />} {/* Условный рендеринг ProfileUser */}
        </div>
    );
};

export default RatingList;


