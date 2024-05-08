import { IconDefinition, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { ApiError } from '../types/ApiError'

export const getError = (error: ApiError) => {
    return error.response && error.response.data.message
    ? error.response.data.message
    : error.message
}

export function format(date: Date): string {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const arr = date.toDateString().split(" ").splice(1, 4);
    const day = arr[1];
    arr[0] = day;
    arr[1] = months[date.getMonth()];
    return arr.join(" ");
}

export function day(date: Date): string {
    const days: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
} 

export const dictionary: Record<string, boolean> = {
    "true": true,
    "false": false,
}

export const recurringDictionary: Record<string, IconDefinition> = {
    "true": faCheck,
    "false": faXmark
}

export function getImageUrl(image:string):string {
    if (image.includes("http")) {
        console.log("EDITED", image)
        return image}
    else{
        console.log("EDITED", `/profile/${image}`)
        return `/profile/${image}`
    } 
}
