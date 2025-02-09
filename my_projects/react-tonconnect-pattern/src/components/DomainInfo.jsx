import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Container, Typography, CircularProgress } from "@mui/material";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import ContactFetcher from "./ContactFetcher.jsx";
import DomainExpirationTimer from "./ExpiredBet.jsx";

import { useDispatch } from 'react-redux';
import { logAction as reduxLogAction } from '../reducers/actions.jsx'; // Импортируем redux action
import { useTonAddress } from "@tonconnect/ui-react";
import punycode from 'punycode';

export const DomainInfo = ({ setOwnerAddress }) => {
    const [domainName, setDomainName] = useState("");
    const [domainData, setDomainData] = useState(null);
    const [domainWithTon, setDomainWithTon] = useState('');
    const [loading, setLoading] = useState(false);
    const [noResult, setNoResult] = useState('');
    const [punycodeDomain, setPunycodeDomain] = useState('');
    const [walletUser] = useTonAddress();
    const dispatch = useDispatch();
    const { language, translations } = useLanguage();

    useEffect(() => {
        if (domainName) {
            // Приведение к нижнему регистру и удаление пробелов
            const normalizedDomain = domainName.toLowerCase().trim();

            // Валидация домена: только буквы, цифры и дефис
            const isValidDomain = /^[a-zA-Z0-9а-яёА-ЯЁ0-9-]+$/.test(normalizedDomain);

            if (isValidDomain) {
                // Преобразование в Panicode
                const punycodeResult = punycode.toASCII(normalizedDomain);
                setPunycodeDomain(punycodeResult);
                setDomainWithTon(`${punycodeResult}.ton`);
                setNoResult(''); // Обнуляем сообщение об отсутствии результата
            } else {
                alert(translations[language].invalidDomain); // Сообщение о невалидном домене
                setPunycodeDomain('');
                setDomainWithTon('');
            }
        } else {
            setPunycodeDomain('');
            setDomainWithTon('');
            setNoResult('');
        }
    }, [domainName]);

    const handleSearch = async () => {
        if (!domainName) {
            alert(translations[language].enterDomain);
            return;
        }

        setLoading(true);
        setDomainData(null);
        setNoResult('');

        try {
            const response = await fetch(`https://tonapi.io/v2/dns/${domainWithTon}`);
            if (!response.ok) throw new Error(translations[language].errorFetching);

            const data = await response.json();
            setDomainData(data.item);
            const owner = data.item?.sale?.owner?.address || data.item?.owner?.address;

            // Логирование
            dispatch(reduxLogAction(walletUser, 'Searched for', domainWithTon));
            setOwnerAddress(owner);
        } catch (error) {
            setNoResult('no result');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <Box textAlign="center" mt={4} style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                color: "white",
                fontSize: "55px",
                fontWeight: "600",
                gap: '20px'
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    2.
                    <p style={{ fontSize: "28px", width: "250px" }}>
                        {translations[language].header}
                    </p>
                </div>

                <TextField
                    label={translations[language].placeholder}
                    variant="outlined"
                    value={domainName}
                    onChange={(e) => setDomainName(e.target.value)}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'white',
                            },
                            '&:hover fieldset': {
                                borderColor: 'white',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: 'white',
                            },
                        },
                        '& .MuiInputLabel-root': {
                            color: 'white',
                        },
                        '& .MuiInputBase-input': {
                            color: 'white',
                        },
                        width: '240px',
                    }}
                />
                <Button
                    onClick={handleSearch}
                    variant="contained"
                    color="primary"
                    sx={{ ml: 2, border: '2px solid white', borderRadius: '25px' }}
                    className="sendBtn"
                >
                    {translations[language].searchButton}
                </Button>
            </Box>
            
            {!domainData && noResult && (
                <Box mt={4} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", color: 'white' }}>
                    <img src='/noresult.gif' alt="Preview" style={{ width: "200px", borderRadius: "25px" }} />
                    {translations[language].alertText}
                    <a href={`https://dns.ton.org/#${punycodeDomain}`}>
                        <Button variant="contained" color="primary" sx={{ ml: 2, border: '2px solid white', borderRadius: '25px' }} className="sendBtn">
                            {translations[language].alertCreate}
                        </Button>
                    </a>
                </Box>
            )}

            {loading && (
                <Box mt={4} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", color: 'white' }}>
                    <img src='/searchDog.gif' alt="Preview" style={{ width: "200px", borderRadius: "25px" }} />
                </Box>
            )}

            {domainData && !loading && (
                <div>
                    <Box mt={4} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", color: 'white' }}>
                        <img src={domainData.previews[3].url} alt="Preview" style={{ width: "200px", borderRadius: "25px" }} />
                        <div style={{ width: '300px', textAlign: 'left', wordWrap: 'break-word' }}>
                            {domainData?.owner ? (
                                <Typography style={{ display: 'flex', justifyContent: 'space-around' }}>
                                    {`${translations[language].owner}`}
                                    <a href={`https://tonviewer.com/${domainData.sale?.owner?.address || domainData.owner.address}`}>
                                        {(domainData.sale?.owner?.address ? 'Sale Owner' : domainData.owner.name) || 'wallet'}
                                    </a>
                                </Typography>
                            ) : (
                                <Typography style={{ display: 'flex', justifyContent: 'space-around' }}>
                                    {`${translations[language].owner}`}
                                    <a href="https://tonviewer.com/auctions">
                                        {translations[language].onauction}
                                    </a>
                                </Typography>
                            )}
                            <Typography style={{ display: 'flex', justifyContent: 'space-around' }}>
                                {`${translations[language].site}`}
                                <a href={`tonsite://${domainData.dns}`}>{`${domainData.dns}`}</a>
                            </Typography>
                            <Typography style={{ display: 'flex', justifyContent: 'space-around' }}>
                                {`${translations[language].marketplace}`}
                                <a href={`https://marketapp.ws/nft/${domainData.address}`}>
                                    {translations[language].marketLinkText}
                                </a>
                            </Typography>
                            <Typography style={{ display: 'flex', justifyContent: 'space-around' }}>
                                {`${translations[language].moredetails}`}
                                <a href={`https://tonviewer.com/${domainData.address}`}>
                                    {translations[language].tonviewer}
                                </a>
                            </Typography>
                        </div>
                    </Box>
                    {domainData?.owner && (
                        <>
                            <DomainExpirationTimer domainName={domainData.dns} />
                            <ContactFetcher walletAddress={domainData.sale?.owner?.address || domainData.owner.address} />
                        </>
                    )}
                </div>
            )}
        </Container>
    );
};

