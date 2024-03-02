import { Transaction } from '../../types/Transaction'
import TotalBalance from './TotalBalance'
import TxHistory from './TxHistory'
import UpcomingPayments from './UpcomingPayments'

interface RightProps {
    budget: number,
    firstName: string,
    familyName: string,
    history: Array<Transaction>
}

export default function Right({budget, firstName, familyName, history}: RightProps) {
    return (
        <div className="md:mt-20 flex justify-between md:w-[35%] bg-gray-400 min-h-[45%]">
            <TotalBalance  budget={budget} firstName={firstName} familyName={familyName}/>
            <TxHistory history={history}/>
            <UpcomingPayments />
        </div>
  )
}
