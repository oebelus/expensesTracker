type CardProps = {
    percent: string,
    name: string,
    money: number,
    color: string,
    text: string,
    shadow: string
}

export default function Card({percent, name, money, color, text, shadow}: CardProps) {
    
    return (
        <div style={{"width": "85%"}} className="relative group">
            <div className={`absolute inset-0.5 opacity-50 group-hover:opacity-100 transition duration-200 rounded-lg rounded-md ${shadow} blur`}></div>
            <div className={`w-full max-w-sm relative px-4 py-3 bg-dark rounded-md rounded-lg shadow-md ${color}`}>    
                <p className={`bg-white-500 rounded-lg ${text} font-bold inline-block px-2`}>{percent}</p>
                <h5 className="text-gray-900">{name}</h5>
                <h3 className="text-gray-900">{money}$</h3>
            </div>
        </div>
            
    )
}
