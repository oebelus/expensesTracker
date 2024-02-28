type CardProps = {
    percent: string,
    name: string,
    money: number,
    color: string,
    text: string
}

export default function Card({percent, name, money, color, text}: CardProps) {
    
    return (
        <div className={`w-full max-w-sm px-4 py-3 bg-dark rounded-md shadow-md ${color}`}>
            <p className={`bg-white-500 rounded-lg ${text} font-bold inline-block px-2`}>{percent}</p>
            <h5 className="text-gray-900">{name}</h5>
            <h3 className="text-gray-900">{money}$</h3>
        </div>
    )
}
