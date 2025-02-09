import {useLanguage} from '../contexts/LanguageContext.jsx'

export const Footer = () => {
    const { language, translations } = useLanguage(); // Извлечение данных из контекста
    return (
        <div style={{color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <div style={{display: 'flex', gap: '5px', alignItems: 'center'}}>
                <h3>{translations[language].totalSum}......0.05</h3>
                <img src="/toncoin_ton_logo.png" alt="ton" style={{width: '30px', height: '30px'}}/>
            </div>
            {/* <p>* - optionary (for connect with owner)</p> */}
            <p style={{width: '300px', textWrap: 'wrap'}}>{translations[language].disclamer}</p>
	    <p style={{width: '300px', textWrap: 'wrap'}}>{translations[language].support}<a href='https://t.me/ifyes'> @ifyes</a></p>
        </div>
    )
}
