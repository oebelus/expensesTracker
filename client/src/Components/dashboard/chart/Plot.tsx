import { Line } from "react-chartjs-2";
import { chartOptions, chartData } from './chartUtils';

export default function Plot() {
    return (
        <div className="w-large h-96 md:h-120 lg:h-144 xl:h-160 p-6 flex flex-col justify-center items-center">
            <Line
                width={"500px"}
                height={"250px"}
                options={chartOptions}
                data={chartData}
            />
        </div>
    );
}
