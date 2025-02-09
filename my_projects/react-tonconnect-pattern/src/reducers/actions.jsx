export const LOG_ACTION = "LOG_ACTION";
export const UPDATE_PROFILE = "UPDATE_PROFILE";
export const FETCH_NFTS = "FETCH_NFTS";
export const FETCH_USERS = "FETCH_USERS";

export const logAction = (address, action, domain) => {
  console.log(address, action, domain);
  return async (dispatch) => {
    try {
      await fetch("http://localhost:3000/api/log", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address, action, domain }),
      });

      dispatch({
        type: LOG_ACTION,
        payload: { address, action, domain },
      });
    } catch (error) {
      console.error("Error logging action:", error);
    }
  };
};

// Action creator для обновления профиля
export const updateProfile = (profileData) => {
  return async (dispatch) => {
    try {
      const response = await fetch("http://localhost:3000/api/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        dispatch({
          type: UPDATE_PROFILE,
          payload: updatedUser.user,
        });
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile: ", error);
    }
  };
};

export const fetchNfts = (walletAddress) => {
  return async (dispatch) => {
    let offset = 0;
    let allNfts = [];
    const limit = 100;
    const API_DELAY = 1000; // Задержка

    while (true) {
      const response = await fetch(
        `https://tonapi.io/v2/accounts/${walletAddress}/nfts?limit=${limit}&offset=${offset}&indirect_ownership=false`
      );
      const data = await response.json();

      if (!data.nft_items || data.nft_items.length === 0) {
        break; // Выход из цикла, если больше нет NFT
      }
      // if (data.nft_items.length === 0) {
      //   break; // Выход из цикла, если больше нет NFT
      // }

      // Добавляем полученные NFT в общий массив
      allNfts = allNfts.concat(data.nft_items);
      // Добавляем задержку
      offset += 100; // Увеличиваем смещение
      await new Promise((resolve) => setTimeout(resolve, API_DELAY));
    }
    console.log(
      `Масив всех НФТ кошелька помещаемые в store :${JSON.stringify(
        allNfts,
        null,
        2
      )}`
    );
    // Диспатчим полный массив NFT в store
    dispatch({
      type: FETCH_NFTS,
      payload: allNfts,
    });
  };
};

export const fetchUsers = () => {
  return async (dispatch) => {
    try {
      const response = await fetch("http://localhost:3000/api/users");
      let users = await response.json();

      // Убедитесь, что у всех пользователей есть поле rarity
      users = users.map(user => ({
          ...user,
          rarity: user.rarity !== undefined ? user.rarity : 0 // Устанавливаем значение rarity по умолчанию
      }));

      // Сортируем пользователей по rarity
      users.sort((a, b) => b.rarity - a.rarity);

      console.log(`Отсортированный список юзеров перед отправкой в store: ${JSON.stringify(users, null, 2)}`);

      dispatch({
        type: FETCH_USERS,
        payload: users,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
};
