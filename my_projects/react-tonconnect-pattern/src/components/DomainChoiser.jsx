import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useSelector } from 'react-redux';
import { useTonWallet } from '@tonconnect/ui-react';
import punycode from 'punycode';

export const DomainChoiser = ({ onDomainChange }) => {

    const nfts = useSelector((state) => state.nfts);
    const [domains, setDomains] = useState([]);
    const [domainName, setDomainName] = useState('');
    const wallet = useTonWallet();

    useEffect(() => {
        const uniqueDomains = new Set();
        if (wallet) {
            nfts.forEach(item => {
                if (item.collection && item.collection.name === 'TON DNS Domains') {
                    let name = item.dns;
                    if (name && name.endsWith('.ton')) {
                        name = name.slice(0, -4);
                        uniqueDomains.add(name);
                    }
                }
            });

            const sortedDomains = Array.from(uniqueDomains).map(domain => {
                const punycodeDomain = domain.startsWith('xn--') ? punycode.toUnicode(domain) : domain;
                return { punycode: punycodeDomain, unicode: domain };
            });

            sortedDomains.sort((a, b) => a.punycode.length - b.punycode.length);
            setDomains(sortedDomains);
        }
    }, [wallet, nfts]);

    return (
        <main style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ color: 'white' }}>
                <Box
                    component="form"
                    sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' }, display: 'flex', alignItems: 'flex-end' }}
                    noValidate
                    autoComplete="off"
                >
                    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <TextField
                            id="outlined-select-currency"
                            select
                            label="Domain"
                            style={{ width: '150px' }}
                            value={domainName}
                            onChange={(e) => {
                                const selectedDomain = e.target.value;
                                setDomainName(selectedDomain);
                                onDomainChange(selectedDomain);
                            }}
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
                            {domains.map((domain, index) => (
                                <MenuItem key={index} value={domain.punycode}>
                                    {domain.punycode}
                                </MenuItem>
                            ))}
                        </TextField>
                        <span>.ton</span>
                    </div>
                </Box>
            </div>
        </main>
    );
};
