import React, { useEffect, useState } from "react";
import { Typography} from "@mui/material";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import { useSelector } from "react-redux";
import { Select, MenuItem } from '@mui/material';


export const NomisComponent = ({ walletAddress, onRarityChange, calculateRarityNomis, setSelectedNomisNft , rarity}) => {
    const [selectedNft, setSelectedNft] = useState('');
    const [nftImages, setNftImages] = useState([]);
    const { language, translations } = useLanguage();
    const nfts = useSelector((state) => state.nfts); // Получаем NFTs из store

    const fetchNomisNFTs = () => {
        
        let allNomisNfts = [];

        nfts.forEach(nft => {
            if (nft.collection?.name === 'Nomis TON Score') {
                const previews = nft.previews.find(preview => preview.resolution === "100x100");
                const attributes = nft.metadata.attributes.find(attribute => attribute.trait_type === 'Score');
                allNomisNfts.push({
                    name: nft.metadata.name,
                    image: previews ? previews.url : nft.metadata.image, // Используйте URL из previews, если он существует
                    value: parseFloat(attributes.value) || 0
                });
                // console.log(JSON.stringify(nft, null, 2));
            }
        });

        setNftImages(allNomisNfts);
        console.log(allNomisNfts);
    };

    useEffect(() => {
        if (walletAddress) {
            fetchNomisNFTs();
        }
    }, [walletAddress, nfts]);

    useEffect(() => {
        if (nftImages.length > 0) {
            const rarity = nftImages.reduce((acc, item) => acc + calculateRarityNomis(item.value), 0);
            onRarityChange(rarity);
        } else {
            onRarityChange(0);
        }
    }, [nftImages, onRarityChange, calculateRarityNomis]);

    
    const onNomisSelect = (e) => {
        const selectedNFT = nftImages.find(item => item.name === e.target.value);
        setSelectedNft(e.target.value);
        setSelectedNomisNft(selectedNFT);
    
        // Вычисляем rarity при выборе
        const rarity = calculateRarityNomis(selectedNFT.value);
        onRarityChange(rarity); // Устанавливаем rarity в родительском компоненте
    };

    return (
        <div className="tondiamond_box" style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
            <p style={{ color: 'white', width: '80px' }}>{translations[language].nomisscore}</p>
            <Select
                value={selectedNft}
                onChange={onNomisSelect}
                displayEmpty
                inputProps={{ 'aria-label': 'Select NFT' }}
                style={{ width: '160px', height: '80px', display: 'flex', gap: '10px' }}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: 'white',
                            border: '2px solid white'  
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
                {nftImages.map((nft, index) => (
                    <MenuItem key={index} value={nft.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgb(227, 107, 211)' }}>
                        <div style={{ display: 'flex', gap: '15px' , justifyContent: 'flex-start' , alignItems: 'center'}}>
                            <img 
                                src={nft.image} 
                                alt={nft.name} 
                                style={{ width: '40px', height: '40px', marginRight: '10px' }} 
                            />
                            <Typography style={{ color: 'white', width: '60px' , textWrap: 'wrap'}}>{nft.name}</Typography>
                        </div>
                    </MenuItem>
                ))}
            </Select>
            <p style={{color: 'white'}}>+ {rarity}</p>
        </div>
    );
};