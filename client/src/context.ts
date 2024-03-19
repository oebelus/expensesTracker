import { Budget } from "./types/Budget";
import { Transaction } from "./types/Transaction";
import { User } from "./types/User";

type AppState = {
    user: User;
    currency: string;
    transactions: Transaction[];
    budgets: Budget[];
    savings: Budget[];
}

export const initialState: AppState = {
    user: localStorage.getItem('userInfo')
        ? JSON.parse(localStorage.getItem('userInfo')!)
        : "null",
    currency: localStorage.getItem('currency')
        ? localStorage.getItem("currency")!
        : "$",
    transactions: [],
    budgets: [],
    savings: [],
}

export type Action = 
    | { type: 'USER_SIGNIN'; payload: User }
    | { type: 'USER_SIGNOUT' }
    | { type: 'SET_CURRENCY', payload: string }
    | { type: 'EDIT_NAME', payload: { firstName: string, familyName: string } }
    | { type: 'EDIT_EMAIL', payload: string }
    | { type: 'EDIT_IMAGE', payload: string }
    | { type: 'FETCH_TX', payload: Transaction[] }
    | { type: 'ADD_TX', payload: Transaction }
    | { type: 'DELETE_TX', payload: string }
    | { type: 'UPDATE_TX', payload: Transaction }
    | { type: 'FETCH_BUDGET', payload: Budget[] }
    | { type: 'ADD_BUDGET', payload: Budget }
    | { type: 'DELETE_BUDGET', payload: string }
    | { type: 'UPDATE_BUDGET', payload: Budget }
    | { type: 'FETCH_SAVING', payload: Budget[] }
    | { type: 'ADD_SAVING', payload: Budget }
    | { type: 'DELETE_SAVING', payload: string }
    | { type: 'UPDATE_SAVING', payload: Budget }

export function reducer(state: AppState, action: Action): AppState {
    switch (action.type) {
        case 'USER_SIGNIN': 
            return { ...state, user: action.payload };
        case 'USER_SIGNOUT': 
            return { ...state, currency: "$" }
        case 'EDIT_NAME':
            return { ...state, user: { ...state.user, firstName: action.payload.firstName, familyName: action.payload.familyName } };
        case 'EDIT_EMAIL':
            return { ...state, user: { ...state.user, email: action.payload } };
        case 'EDIT_IMAGE':
            return { ...state, user: { ...state.user, image: action.payload } };
        case 'SET_CURRENCY':
            return { ...state, currency: action.payload }
        case 'FETCH_TX':
            return { ...state, transactions: action.payload }
        case 'ADD_TX': 
            return { 
                ...state,
                transactions: [...state.transactions, action.payload]    
            }
        case 'DELETE_TX': 
            return { 
                ...state, 
                transactions: state.transactions.filter(tx => tx._id != action.payload) 
            }
        case 'UPDATE_TX':
            return {
                ...state, 
                transactions: state.transactions.map(tx => 
                    tx._id === action.payload._id ? action.payload : tx 
                )
            }
        case 'FETCH_BUDGET':
            return { ...state, budgets: action.payload }
        case 'ADD_BUDGET': 
            return { 
                ...state,
                budgets: [...state.budgets, action.payload]    
            }
        case 'DELETE_BUDGET': 
            return { 
                ...state, 
                budgets: state.budgets.filter(budget => budget._id != action.payload) 
            }
        case 'UPDATE_BUDGET': {
            const budgets = state.budgets.filter(budget => budget._id != action.payload._id)
            return {
                ...state, 
                budgets: [...budgets, action.payload]
            }
        }
        case 'FETCH_SAVING':
            return { ...state, savings: action.payload }
        case 'ADD_SAVING': 
            return { 
                ...state,
                savings: [...state.savings, action.payload]    
            }
        case 'DELETE_SAVING': 
            return { 
                ...state, 
                savings: state.savings.filter(saving => saving._id != action.payload) 
            }
        case 'UPDATE_SAVING': {
            const savings = state.savings.filter(saving => saving._id != action.payload._id)
            return {
                ...state, 
                savings: [...savings, action.payload]
            }
        }
        default:
            return state
    }
}

