import { Cafe } from '../models/Cafe';
import { CafeAction, CafeActionType } from '../types/cafe_action';

type CafeState = {
    cafes: Cafe[];
    favorites: Cafe[];
    loading: boolean;
    loadingMore: boolean;
    error: string | null;
    page: number;
    hasMore: boolean;
    searchKeyword: string;
};

const initialState: CafeState = {
    cafes: [],
    favorites: [],
    loading: false,
    loadingMore: false,
    error: null,
    page: 1,
    hasMore: true,
    searchKeyword: '',
};

const cafeReducer = (state = initialState, action: CafeAction): CafeState => {
    switch (action.type) {
        case CafeActionType.FETCH_CAFE_REQUEST:
            return { ...state, loading: true, error: null, page: 1, hasMore: true, cafes: [] };
        case CafeActionType.FETCH_CAFE_SUCCESS:
            return {
                ...state,
                loading: false,
                cafes: action.payload as Cafe[],
                page: 2,
                hasMore: (action.payload as Cafe[]).length === 10,
            };
        case CafeActionType.FETCH_CAFE_FAILURE:
            return { ...state, loading: false, loadingMore: false, error: action.payload as string };
        
        case CafeActionType.FETCH_CAFE_MORE_REQUEST:
            return { ...state, loadingMore: true, error: null };
        case CafeActionType.FETCH_CAFE_MORE_SUCCESS:
            return {
                ...state,
                loadingMore: false,
                cafes: [...state.cafes, ...(action.payload as Cafe[])],
                page: state.page + 1,
                hasMore: (action.payload as Cafe[]).length === 10,
            };
        case CafeActionType.FETCH_CAFE_MORE_FAILURE:
            return { ...state, loadingMore: false, error: action.payload as string };
        case CafeActionType.LOAD_FAVORITES:
            return { ...state, favorites: action.payload as Cafe[] };
        case CafeActionType.LOAD_FAVORITES_FAILURE:
            return { ...state };
        case CafeActionType.TOGGLE_FAVORITE_CAFE: {
            const cafe = action.payload as Cafe;
            const isExist = state.favorites.some((fav) => fav.id === cafe.id);

            return {
                ...state,
                favorites: isExist
                    ? state.favorites.filter((fav) => fav.id !== cafe.id)
                    : [...state.favorites, cafe],
            };
        }
        case CafeActionType.SET_SEARCH_KEYWORD:
            return { ...state, searchKeyword: action.payload as string };
        default:
            return state;
    }
};

export default cafeReducer;