import { Action } from '../context';
import axios from 'axios';

export async function useFetchTransactionsAndUpdateState(userId: string, dispatch: React.Dispatch<Action>) {
    const response = await axios.get(`localhost:4000/transactions/${userId}`);
            if (!response) {
                throw new Error("Failed to fetch transactions");
            }
            const data = response.data;
            dispatch({ type: 'FETCH_TX', payload: data.transactions });
        }
