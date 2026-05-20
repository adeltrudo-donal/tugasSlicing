import { applyMiddleware, combineReducers, createStore } from 'redux';
import { thunk } from 'redux-thunk';

import counterReducer from '../reducer/counter_reduser';
import cafeReducer from '../reducer/cafe_reducer';

const rootReducer = combineReducers({
	counter: counterReducer,
	cafes: cafeReducer,
});

const store = createStore(rootReducer as any, applyMiddleware(thunk));

export type RootState = ReturnType<typeof rootReducer>;

export default store;
