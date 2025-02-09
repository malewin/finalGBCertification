// subscriptionUtils.js
import { getJettonWalletAddress, waitForTx } from "./tonapi.jsx"; // Импортируйте зависимости
import { WEB3 } from "../constants/constants.jsx";
import { Address, beginCell, Cell } from "@ton/core";
import { useLanguage } from "../contexts/LanguageContext.jsx";
// import { useTonAddress, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";

export const updateContactSubscriptionStatus = async (wallet, tonConnectUI, payerAddressFriendly) => {

    if (!wallet) {
        tonConnectUI.openModal();
        return;
    }
    
    // Получаем адрес кошелька жетонов через API
    const walletAddress = wallet.account.address;
    const jettonMasterAddress = WEB3.toRawString().replace(':', '%3A'); // Заменяем ":" на "%3A"
    const encodedWalletAddress = walletAddress.replace(':', '%3A'); // Заменяем ":" на "%3A"

    const apiUrl = `https://tonapi.io/v2/blockchain/accounts/${jettonMasterAddress}/methods/get_wallet_address?args=${encodedWalletAddress}&fix_order=true`;
    
    let jwAddress;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Ошибка API: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        jwAddress = data.decoded.jetton_wallet_address; // Обновите путь, если структура ответа отличается

        console.log(`Адрес жетона на кошельке оплачивающего: ${jwAddress}`);
    } catch (error) {
        console.error("Ошибка при получении адреса жетона:", error);
        return;
    }

    // Проверяем, есть ли адрес жетона
    if (!jwAddress) {
        console.error("Не удалось получить адрес жетона.");
        return;
    }

    const payload = beginCell()
        .storeUint(0x0f8a7ea5, 32)
        .storeUint(0, 64)
        .storeCoins(50000)
        .storeAddress(Address.parse("UQDZmg4lBYBhTQslgJ-MWg9RKYa2Pjf07ul60OYLrtnfYLHx"))
        .storeAddress(null)
        .storeMaybeRef()
        .storeCoins(0)
        .storeMaybeRef()
        .endCell()
        .toBoc()
        .toString("base64");

    const tx = {
        validUntil: Math.round(Date.now() / 1000) + 60 * 5,
        messages: [{ address: jwAddress, amount: "37000000", payload }],
    };

    const result = await tonConnectUI.sendTransaction(tx, {
        modals: "all",
        notifications: ["error"],
    });

    const imMsgCell = Cell.fromBase64(result.boc);
    const inMsgHash = imMsgCell.hash().toString("hex");

    try {
        await waitForTx(inMsgHash);

        const response = await fetch("https://informer.ton.sc/api/update-contacts-subs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                address: payerAddressFriendly,
                isHasContactsSubs: true,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log(`Подписка на контакты изменена: ${data.user.isHasContactsSubs}`);
            alert(`Подписка на месяц успешна куплена`);
        } else {
            console.error("Ошибка при обновлении подписки на контакты", response.statusText);
        }
    } catch (e) {
        console.error("Ошибка при ожидании транзакции:", e);
    }
};
