import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Cafe } from '../models/Cafe';
import { CafeActionType } from '../types/cafe_action';

const BASE_URL = 'https://mock-api.ahmadfaisal.space';
const FAVORITES_KEY = '@favorite_cafes';

const fetchCafes = () => {
    return async (dispatch: any) => {
        dispatch({ type: CafeActionType.FETCH_CAFE_REQUEST });

        try {
            const response = await axios.get(`${BASE_URL}/cafes?page=1&limit=10`);
            const responseData = response.data?.data || response.data;

            if (Array.isArray(responseData)) {
                dispatch({ type: CafeActionType.FETCH_CAFE_SUCCESS, payload: responseData });
            } else {
                dispatch({ type: CafeActionType.FETCH_CAFE_FAILURE, payload: 'Invalid cafe response' });
            }
        } catch (error) {
            dispatch({ type: CafeActionType.FETCH_CAFE_FAILURE, payload: JSON.stringify(error) });
        }
    };
};

const fetchMoreCafes = (page: number) => {
    return async (dispatch: any) => {
        dispatch({ type: CafeActionType.FETCH_CAFE_MORE_REQUEST });

        try {
            const response = await axios.get(`${BASE_URL}/cafes?page=${page}&limit=10`);
            const responseData = response.data?.data || response.data;

            if (Array.isArray(responseData)) {
                dispatch({ type: CafeActionType.FETCH_CAFE_MORE_SUCCESS, payload: responseData });
            } else {
                dispatch({ type: CafeActionType.FETCH_CAFE_MORE_FAILURE, payload: 'Invalid cafe response' });
            }
        } catch (error) {
            dispatch({ type: CafeActionType.FETCH_CAFE_MORE_FAILURE, payload: JSON.stringify(error) });
        }
    };
};

const loadFavorites = () => {
    return async (dispatch: any) => {
        try {
            const storedFavorites = await AsyncStorage.getItem(FAVORITES_KEY);

            if (storedFavorites) {
                dispatch({ type: CafeActionType.LOAD_FAVORITES, payload: JSON.parse(storedFavorites) });
            }
        } catch (error) {
            dispatch({ type: CafeActionType.LOAD_FAVORITES_FAILURE, payload: JSON.stringify(error) });
        }
    };
};

const toggleFavoriteCafe = (cafe: Cafe) => {
    return async (dispatch: any, getState: any) => {
        const currentFavorites = getState().cafes.favorites;
        const isExist = currentFavorites.some((fav: Cafe) => fav.id === cafe.id);
        let newFavorites;

        if (isExist) {
            newFavorites = currentFavorites.filter((fav: Cafe) => fav.id !== cafe.id);
        } else {
            newFavorites = [...currentFavorites, cafe];
        }

        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
        dispatch({ type: CafeActionType.TOGGLE_FAVORITE_CAFE, payload: cafe });
    };
};

const setSearchKeyword = (keyword: string) => {
    return {
        type: CafeActionType.SET_SEARCH_KEYWORD,
        payload: keyword,
    };
};

export { fetchCafes, fetchMoreCafes, loadFavorites, toggleFavoriteCafe, setSearchKeyword };