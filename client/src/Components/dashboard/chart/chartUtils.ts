import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

import { faker } from '@faker-js/faker';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
);

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const chartOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
            labels: {
                usePointStyle: true
            }
        },
        title: {
            display: true,
            text: 'Analysis'
        }
    }
};

export const chartData = {
    labels,
    datasets: [
        {
            label: 'Income',
            data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
            borderColor: '#A78BFA',
            backgroundColor: '#A78BFA',
        },
        {
            label: 'Expense',
            data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
            borderColor: '#E5659F',
            backgroundColor: '#E5659F',
        },
        {
            label: 'Saving',
            data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
            borderColor: '#D0E9DC',
            backgroundColor: '#D0E9DC',
        },
    ]
};
