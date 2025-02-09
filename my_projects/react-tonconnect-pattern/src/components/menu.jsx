import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useTonWallet } from '@tonconnect/ui-react';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export default function FullWidthTabs() {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const wallet = useTonWallet();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const { language, translations } = useLanguage();

  return (
    <Box sx={{ bgcolor: 'background.paper', width: 300 , borderRadius: '15px', marginTop: '20px'}}>
      <AppBar position="static" style={{background: 'none', borderRadius: '15px'}}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          
          variant="fullWidth"
          aria-label="full width tabs example"
          style={{ backgroundColor: '#b861fb', border: '2px solid white', borderRadius: '15px'}}
        >
          <Tab component={Link} to="/" label={translations[language].menuH1Profile} style={{fontWeight: '600', fontSize: '16px'}}/>
          <Tab component={Link} to="/ratings" style={{fontWeight: '600', fontSize: '16px'}} label={translations[language].menuH1Ratings} />
          <Tab label={translations[language].menuH1Chat} style={{fontWeight: '600', fontSize: '16px'}} />
        </Tabs>
      </AppBar>
      {!wallet ? (<TabPanel value={value} index={0} dir={theme.direction} style={{background: 'black', color: 'white', borderRadius: '15px', border: '1px solid white'}}>
        <Typography variant="h6" style={{height: '320px', overflow: 'scroll'}}>
            <h5 style={{fontWeight: '600'}}>{translations[language].p1}</h5>
            <p style={{fontSize: '16px'}}>{translations[language].p2}
            </p>
            <p style={{fontSize: '16px'}}>
            <span style={{fontWeight: 'bolder', color: 'plum'}}>NFT Domain .ton</span> - {translations[language].p3}</p>
            <p style={{fontSize: '16px'}}>
            <span style={{fontWeight: 'bolder', color: 'plum'}}>Avatar</span> - {translations[language].p4}</p>
            <p style={{fontSize: '16px'}}>
            <span style={{fontWeight: 'bolder', color: 'plum'}}>Nomis Score</span> - {translations[language].p5}</p>
            <p style={{fontSize: '16px'}}>
            <span style={{fontWeight: 'bolder', color: 'plum'}}>Gift</span> - {translations[language].p6}</p>
            <p style={{fontSize: '16px'}}>
            <span style={{fontWeight: 'bolder', color: 'plum'}}>Username Telegram </span> - {translations[language].p7}</p>
        </Typography>
      </TabPanel>) : ''}
      {!wallet ? (<TabPanel value={value} index={1} dir={theme.direction} style={{background: 'black', color: 'white', borderRadius: '15px', border: '1px solid white'}}>
        <Typography variant="h6"><p style={{fontWeight: '600', fontSize: '18px'}}>{translations[language].usersInfoHeader}</p><p style={{fontSize: '16px'}}><span style={{fontWeight: 'bolder', color: 'plum'}}>NFT Score</span> {translations[language].usersInfoHeader2}</p></Typography>
      </TabPanel>) : ''}
      {!wallet ? (<TabPanel value={value} index={2} dir={theme.direction} style={{background: 'black', color: 'white', borderRadius: '15px', border: '1px solid white'}}>
        <Typography variant="h6"><p style={{fontWeight: '600', fontSize: '18px'}}>{translations[language].usersInfoHeader4}</p><p style={{fontSize: '16px'}}>{translations[language].usersInfoHeader3}</p></Typography>
      </TabPanel>) : ''}
    </Box>
  );
}

