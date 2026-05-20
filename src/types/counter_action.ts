enum CounterActionType {
    INCREMENT = 'INCREMENT',
    DECREMENT = 'DECREMENT',
    INCREMENT_BY_TWO = 'INCREMENT_BY_TWO',
    FETCH_COUNTER_REQUEST = 'FETCH_COUNTER_REQUEST',
    FETCH_COUNTER_SUCCESS = 'FETCH_COUNTER_SUCCESS',
    FETCH_COUNTER_FAILURE = 'FETCH_COUNTER_FAILURE',
}

export type CounterAction = {
    type: CounterActionType;
    payload?: number | string;
}

export { CounterActionType };