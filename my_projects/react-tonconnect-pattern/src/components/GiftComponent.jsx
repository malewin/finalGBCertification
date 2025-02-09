import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { useLanguage } from "../contexts/LanguageContext.jsx";
import { useSelector } from "react-redux";
import { Select, MenuItem } from '@mui/material';
import { Address } from "@ton/core";


//api toncenter for details GiftComponent
export const GiftComponent = ({ walletAddress, onRarityChange, calculateRarity, setSelectedGiftNft, rarity }) => {
    const [selectedNft, setSelectedNft] = useState('');
    const [nftImages, setNftImages] = useState([]);
    const { language, translations } = useLanguage();
    const [giftAddresses, setGiftAddresses] = useState([]); // Состояние для адресов подарков
    const nfts = useSelector((state) => state.nfts); // Получаем NFTs из store

    

    const giftCollectionValues = {
    	"Plush Pepes": 100,
    	"Durov’s Caps": 60,
    	"Perfume Bottles": 30,
    	"Spy Agarics": 3,
    	"Vintage Cigars": 6,
    	"Evil Eyes": 2.5,
    	"Hex Pots": 2.5,
    	"Santa Hats": 2,
    	"Homemade Cakes": 0.6,
    	"Trapped Hearts": 10,
    	"Sharp Tongues": 30,
    	"Spiced Wines": 0.75,
    	"Eternal Roses": 6,
    	"Berry Boxes": 3,
    	"Precious Peaches": 60,
    	"Magic Potions": 60,
    	"Scared Cats": 15,
    	"Jelly Bunnies": 1.5,
    	"Skull Flowers": 10,
    	"Signet Rings": 10,
    	"Kissed Frogs": 20
    };

    // Функция расчета редкости по имени
    const calculateGiftRarity = (collectionName) => {
        return giftCollectionValues[collectionName] || 0; // Возвращаем редкость или 0, если не найдено
    };

    useEffect(() => {
        if (walletAddress) {
            fetchGiftNFTs();
        }
    }, [walletAddress, nfts]);

    const fetchGiftNFTs = () => {
        let allGiftNfts = [];
        let addresses = [];

        nfts.forEach(nft => {
            if (Object.keys(giftCollectionValues).includes(nft.collection?.name)) {
                const previews = nft.previews.find(preview => preview.resolution === "100x100");
                const giftNft = {
                    address: nft.address,
                    name: nft.metadata.name,
                    image: previews ? previews.url : nft.metadata.image,
                    collectionName: nft.collection.name // Сохраняем название коллекции
                };
                allGiftNfts.push(giftNft);
                addresses.push(Address.normalize(nft.address)); // Сохраняем адреса подарков
            }
        });

        setNftImages(allGiftNfts);
        console.log(`Список всех подарков: ${JSON.stringify(allGiftNfts)}`);
        setGiftAddresses(addresses); // Сохраняем адреса
    };

   

    const fetchGiftDetails = async (addresses) => {
        const response = await fetch(`https://toncenter.com/api/v3/nft/items?limit=${addresses.length}&offset=0&address=${addresses.join(',')}`);
        const data = await response.json();
        console.log(`Ответ от тонцентра: ${JSON.stringify(data, null, 2)}`);

        const detailedItems = await Promise.all(data.nft_items.map(async (item) => {
	    console.log(`URL JSON файла для gift:${item.content.uri}`)         
            const response = await fetch(`https://informer.ton.sc/api/proxy?url=${encodeURIComponent(item.content.uri)}`);
            const contentData = await response.json();
	    console.log(`Ответ от прокси-фетча картинки подарка:${JSON.stringify(contentData)}`);

            const matchingGift = nftImages.find(gift => gift.name === contentData.name);
            const collectionName = matchingGift ? matchingGift.collectionName : 'Unknown'; // Получаем название коллекции

            console.log(`Item: ${contentData.name}, Collection Name: ${collectionName}`); // Лог для отладки

            console.log(JSON.stringify(contentData));
            return {
                name: contentData.name,
                urlImg: contentData.image,
                collectionName: collectionName,
                animation: contentData.lottie,
                ...item // Сохраняем всю информацию об item
            };
        }));

        setNftImages(detailedItems);
        console.log(`Список всех подарков после фетча: ${JSON.stringify(detailedItems, null, 2)}`);

    };

    const onGiftSelect = (e) => {
        const selectedNFT = nftImages.find(item => item.name === e.target.value);
        setSelectedNft(selectedNFT.name);
        setSelectedGiftNft(selectedNFT); // Установка выбранного NFT в родительский компонент

        // // Вычисляем rarity при выборе
        console.log(selectedNFT.collectionName);
        const rarity = calculateGiftRarity(selectedNFT.collectionName || 'Unknown')
        console.log(`Рарити во время селекта для подарка: ${rarity}`);
        onRarityChange(rarity);
    };
    
    useEffect(() => {
        console.log("giftAddresses изменился:", giftAddresses);
        if (giftAddresses.length > 0) {
            fetchGiftDetails(giftAddresses);
        }
    }, [giftAddresses]);


    return (
        <div className="gift_box" style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
            <p style={{ color: 'white', width: '100px' }}>{translations[language].gift}</p>
            <Select
                value={selectedNft}
                onChange={onGiftSelect}
                displayEmpty
                inputProps={{ 'aria-label': 'Select NFT' }}
                style={{ width: '220px', height: '80px', display: 'flex', gap: '10px' }}
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
                        <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-start' }}>
                            <img
                                src={nft.urlImg}
                                alt={nft.name}
                                style={{ width: '40px', marginRight: '10px' }}
                            />
                            <Typography style={{ color: 'white' }}>{nft.name}</Typography>
                        </div>
                    </MenuItem>
                ))
            ) : (<MenuItem disabled>No NFTs available</MenuItem>)
            }
            </Select>
            <p style={{color: 'white'}}>+ {rarity}</p>
        </div>
    );
};
