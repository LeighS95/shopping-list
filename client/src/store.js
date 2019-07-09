import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const initState = {};

const middleware = [thunk];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE_ ||  compose;
const store = createStore(rootReducer, initState, composeEnhancers(applyMiddleware(...middleware)));

/*const store = createStore(
    rootReducer,
    initState,
    compose(
        applyMiddleware(...middleware),
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX__DEVTOOLS_EXTENSION__()
    )
);*/

export default store;