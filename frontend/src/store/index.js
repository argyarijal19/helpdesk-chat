import { createStore, compose, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { authReaducers } from './reducers/authReducer'; 

const rootReducer = combineReducers({
    auth: authReaducers

})

const middleware = [thunkMiddleware]
const store = createStore(rootReducer, compose(applyMiddleware(...middleware), 
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__ 
() ));
export default store;