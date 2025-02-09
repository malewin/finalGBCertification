// import { LOG_ACTION } from "./actions";

// const initialState = {
//   logs: [],
// };

// const rootReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case LOG_ACTION:
//       return {
//         ...state,
//         logs: [...state.logs, action.payload],
//       };
//     default:
//       return state;
//   }
// };

// export default rootReducer;

// reducers.js
// import { LOG_ACTION, UPDATE_PROFILE } from "./actions";

// const initialState = {
//   logs: [],
//   user: {}, // Состояние для хранения данных пользователя
// };

// const rootReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case LOG_ACTION:
//       return {
//         ...state,
//         logs: [...state.logs, action.payload],
//       };
//     case UPDATE_PROFILE:
//       return {
//         ...state,
//         user: action.payload, // Обновляем информацию о пользователе
//       };
//     default:
//       return state;
//   }
// };

// export default rootReducer;

// import { FETCH_NFTS, LOG_ACTION, UPDATE_PROFILE } from "./actions";

// const initialState = {
//   logs: [],
//   user: {},
//   nfts: [], // Добавьте состояние для NFTs
// };

// const rootReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case LOG_ACTION:
//       return {
//         ...state,
//         logs: [...state.logs, action.payload],
//       };
//     case UPDATE_PROFILE:
//       return {
//         ...state,
//         user: action.payload,
//       };
//     case FETCH_NFTS:
//       return {
//         ...state,
//         nfts: action.payload, // Сохраняем NFT в store
//       };
//     default:
//       return state;
//   }
// };

// export default rootReducer;

import { FETCH_NFTS, LOG_ACTION, UPDATE_PROFILE, FETCH_USERS } from "./actions";

const initialState = {
  logs: [],
  user: {},
  nfts: [],
  users: [], // Добавляем состояние для пользователей
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOG_ACTION:
      return {
        ...state,
        logs: [...state.logs, action.payload],
      };
    case UPDATE_PROFILE:
      return {
        ...state,
        user: action.payload,
      };
    case FETCH_NFTS:
      return {
        ...state,
        nfts: action.payload,
      };
    case FETCH_USERS:
      return {
        ...state,
        users: action.payload, // Сохраняем пользователей в store
      };
    default:
      return state;
  }
};

export default rootReducer;
