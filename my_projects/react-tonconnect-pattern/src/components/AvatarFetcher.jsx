import React, { useEffect, useState } from 'react';
import { Select, MenuItem } from '@mui/material';
import { useLanguage } from "../contexts/LanguageContext.jsx";
import { useSelector } from 'react-redux';

const AvatarFetcher = ({ walletAddress, selectedNft, onAvatarSelect}) => {
    const [nftImages, setNftImages] = useState([]);
    const { language, translations } = useLanguage();
    const nfts = useSelector((state) => state.nfts); // Получаем NFTs из store

    useEffect(() => {

        const fetchNFTs = () => {    
            let allNfts = [];
            nfts.forEach(nft => {
                const previews = nft.previews.find(preview => preview.resolution === "500x500");
                const item = {
                    name: nft.metadata.name,
                    image: previews ? previews.url : nft.metadata.image,
                    collectionName: nft.collection?.name, // Получаем имя коллекции
                    address: nft.address
                };
                allNfts.push(item);

            });
            setNftImages(allNfts); // Устанавливаем все загруженные NFT
        };

        if (walletAddress) {
            fetchNFTs();
        }
    }, [walletAddress, nfts]);

    return (
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
            <p style={{ color: 'white', width: '80px' }}>{translations[language].avatar}</p>
            <Select
                value={selectedNft}
                onChange={onAvatarSelect}
                displayEmpty
                inputProps={{ 'aria-label': 'Select NFT' }}
                style={{ width: '180px', height: '80px', display: 'flex', gap: '10px' }}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: 'white',
                            border: '2px solid white'  // Цвет рамки
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
                    '& .MuiInputBase-input': {
                        color: 'white',
                    },
                }}
            >
                {nftImages.map((nft, index) => (
                    <MenuItem key={index} value={nft.image} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgb(227, 107, 211)' }}>
                        <div style={{ display: 'flex', gap: '15px' , alignItems: 'center'}}>
                            <img style={{ width: '40px' , height: '40px'}} src={nft.image} alt="" />
                            <p style={{ color: 'white', width: '100px' , textWrap:'wrap'}}>{nft.name}</p>
                        </div>
                    </MenuItem>
                ))}
            </Select>
            <p style={{color: 'white', width: '60px'}}>+ {translations[language].styleNFT}</p>
        </div>
    );
};

export default AvatarFetcher;

