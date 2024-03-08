import { User } from "./types/User";

type AppState = {
    user: User;
    currency: string;
}

export const initialState: AppState = {
    user: localStorage.getItem('userInfo')
        ? JSON.parse(localStorage.getItem('userInfo')!)
        : "null",
    currency: localStorage.getItem('currency')
        ? localStorage.getItem("currency")!
        : "$"
}

type Action = 
    | { type: 'USER_SIGNIN'; payload: User }
    | { type: 'USER_SIGNOUT' }
    | { type: 'SET_CURRENCY', payload: string }

export function reducer(state: AppState, action: Action): AppState {
    switch (action.type) {
        case 'USER_SIGNIN': 
            return { ...state, user: action.payload };
        case 'USER_SIGNOUT': 
            return { ...state, currency: "$" }
        case 'SET_CURRENCY':
            return { ...state, currency: action.payload }
        default:
            return state
    }
}