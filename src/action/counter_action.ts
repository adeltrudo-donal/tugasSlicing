import { CounterActionType } from "../types/counter_action";

const increment = (payload: number) => {
    return {
        type: CounterActionType.INCREMENT,
        payload,
    };
};

const decrement = (payload: number) => {
    return {
        type: CounterActionType.DECREMENT,
        payload,
    };
};

const incrementByTwo = (payload: number) => {
    return {
        type: CounterActionType.INCREMENT_BY_TWO,
        payload,
    };
};

const fetchData = (errorTest= false) => {
    return async (dispatch: any) => {
        dispatch({ type: 'FETCH_COUNTER_REQUEST' });
        let url = "https://mock-api.ahmadfaisal.space/cafes";
        if (errorTest) {
            dispatch({ type: 'FETCH_COUNTER_FAILURE', error: 'Test error' });
        } else {
            try {
                const response = await fetch(url);
                const data = await response.json();
                dispatch({ type: 'FETCH_COUNTER_SUCCESS', payload: data.data.length });
            } catch (error) {
                dispatch({ type: 'FETCH_COUNTER_FAILURE', error: JSON.stringify(error) });
            }
        }
    };
};

export { increment, decrement, incrementByTwo, fetchData };