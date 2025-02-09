import React, { useEffect, useState } from "react";
import { Typography} from "@mui/material";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import { useSelector } from "react-redux";
import { Select, MenuItem } from '@mui/material';
import { Address } from "@ton/core";


export const UsernameComponent = ({ walletAddress,  setSelectedUsernameNft }) => {
    const [selectedNft, setSelectedNft] = useState('');
    const [nftImages, setNftImages] = useState([]);
    const { language, translations } = useLanguage();
    const nfts = useSelector((state) => state.nfts); // Получаем NFTs из store

    const fetchUsernamesNFTs = () => {

        let allUsernamesNfts = [];

        nfts.forEach(nft => {
            if (nft.collection?.name === 'Telegram Usernames') {
                console.log(`Поля Юзернейма: ${JSON.stringify(nft, null, 2)}`)
                const previews = nft.previews.find(preview => preview.resolution === "100x100");
                
                const item = {
                    name: nft.metadata.name,
                    image: previews ? previews.url : nft.metadata.image,
                    address: Address.normalize(nft.address),
                    telegram: nft.name
                };
                
                allUsernamesNfts.push(item);
                console.log(`Поля Итема: ${item}`)
            }
        });

        setNftImages(allUsernamesNfts);
    };

    useEffect(() => {
        if (walletAddress) {
            fetchUsernamesNFTs();
        }
    }, [walletAddress, nfts]);

    const onUsernameSelect = (e) => {
        const selectedNFT = nftImages.find(item => item.name === e.target.value);
        setSelectedNft(e.target.value);
        setSelectedUsernameNft(selectedNFT); // Установка выбранного NFT в родительский компонент
    };

    return (
        <div className="gift_box" style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
            <p style={{ color: 'white', width: '100px' }}>{translations[language].username}</p>
            <Select
                value={selectedNft}
                onChange={onUsernameSelect}
                displayEmpty
                inputProps={{ 'aria-label': 'Select NFT' }}
                style={{ width: '240px', height: '80px', display: 'flex', gap: '10px' }}
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
                }}
            >
                {nftImages && nftImages.length > 0 ? (nftImages.map((nft, index) => (
                    <MenuItem key={index} value={nft.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgb(227, 107, 211)' }}>
                        <div style={{ display: 'flex', gap: '15px' , justifyContent: 'flex-start'}}>
                            <img 
                                src={nft.image} 
                                alt={nft.name} 
                                style={{ width: '40px', marginRight: '10px' }} 
                            />
                            <Typography style={{ color: 'white' }}>{nft.name}</Typography>
                        </div>
                    </MenuItem>
                ))
                ) : ( <MenuItem disabled>No NFTs available</MenuItem> )
            }
            </Select>
        </div>
    );
};