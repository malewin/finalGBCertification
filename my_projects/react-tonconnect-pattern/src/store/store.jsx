import { createStore, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";
import rootReducer from "../reducers/reducers"; // Замените на ваш файл с редюсерами

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
