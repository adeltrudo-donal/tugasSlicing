import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Cafe } from '../models/Cafe';
import { CafeActionType } from '../types/cafe_action';

const BASE_URL = 'https://mock-api.ahmadfaisal.space';
const FAVORITES_KEY = '@favorite_cafes';
const CURRENT_LOCATION = {
    latitude: -7.330878,
    longitude: 112.761956,
};

const toRad = (value: number) => {
    return (value * Math.PI) / 180;
};

const calculateDistance = (cafeLatLong: string) => {
    if (!cafeLatLong) {
        return null;
    }

    const [latitudeString, longitudeString] = cafeLatLong.split(';');
    const latitude = parseFloat(latitudeString);
    const longitude = parseFloat(longitudeString);

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
        return null;
    }

    const earthRadius = 6371;
    const deltaLatitude = toRad(latitude - CURRENT_LOCATION.latitude);
    const deltaLongitude = toRad(longitude - CURRENT_LOCATION.longitude);
    const startLatitude = toRad(CURRENT_LOCATION.latitude);
    const endLatitude = toRad(latitude);

    const haversineA =
        Math.sin(deltaLatitude / 2) * Math.sin(deltaLatitude / 2) +
        Math.sin(deltaLongitude / 2) * Math.sin(deltaLongitude / 2) * Math.cos(startLatitude) * Math.cos(endLatitude);

    const haversineC = 2 * Math.atan2(Math.sqrt(haversineA), Math.sqrt(1 - haversineA));
    const distanceKm = earthRadius * haversineC;

    return `${distanceKm.toFixed(1)} km away`;
};

const withDistance = (cafes: Cafe[]) => {
    return cafes.map((cafe) => ({
        ...cafe,
        distance: calculateDistance(cafe.latlong) || cafe.distance,
    }));
};

const fetchCafes = () => {
    return async (dispatch: any) => {
        dispatch({ type: CafeActionType.FETCH_CAFE_REQUEST });

        try {
            const response = await axios.get(`${BASE_URL}/cafes?page=1&limit=10`);
            const responseData = response.data?.data || response.data;

            if (Array.isArray(responseData)) {
                dispatch({ type: CafeActionType.FETCH_CAFE_SUCCESS, payload: withDistance(responseData) });
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
                dispatch({ type: CafeActionType.FETCH_CAFE_MORE_SUCCESS, payload: withDistance(responseData) });
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