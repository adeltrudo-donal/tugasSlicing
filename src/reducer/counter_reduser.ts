import { CounterActionType } from "../types/counter_action";
import { CounterAction } from "../types/counter_action";

const initialState = {
    counter: 0,
    loading: false,
    error: null,
};

const counterReducer = (state = initialState, action: CounterAction) => {
    switch (action.type) {
        case CounterActionType.INCREMENT:
            return { ...state, counter: state.counter + (action.payload as number ?? 0) };
        case CounterActionType.DECREMENT:
            return { ...state, counter: state.counter - (action.payload as number ?? 0) };
        case CounterActionType.INCREMENT_BY_TWO:
            return { ...state, counter: state.counter + (action.payload as number ?? 0) };
        case CounterActionType.FETCH_COUNTER_REQUEST:
            return { ...state, loading: true, error: null };
        case CounterActionType.FETCH_COUNTER_SUCCESS:
            return { ...state, loading: false, counter: action.payload as number };
        case CounterActionType.FETCH_COUNTER_FAILURE:
            return { ...state, loading: false, error: action.payload as string };
        default:
            return state;
    }
};

export default counterReducer;