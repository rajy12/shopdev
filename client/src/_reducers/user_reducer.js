import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER,
    LOGOUT_USER,
    ADD_TO_CART,
    GET_CART_ITEMS,
    REMOVE_CART_ITEM,
} from '../_actions/types';
 

export default function (state={},action){
    switch (action.type) {
        case REGISTER_USER:
            return { ...state, register: action.payload }
        case LOGIN_USER:
            return { ...state, loginSucces: action.payload }
        case AUTH_USER:
            return { ...state, userData: action.payload }
        case LOGOUT_USER:
            return { ...state }
        case ADD_TO_CART:
            return { ...state,
                     userData: {
                         // 먼저 있는 유저 데이터를 입력한다.
                         ...state.userData,
                         cart: action.payload,
                     }
            }
        case GET_CART_ITEMS:
            return { ...state, cartDetail: action.payload }
        case REMOVE_CART_ITEM:
            return { 
                ...state, cartDetail: action.payload.productInfo,
                userData: {
                    ...state.userData,
                    cart: action.payload.cart
                }
            }
        default:
            return state;
    }
}