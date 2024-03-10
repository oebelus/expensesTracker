interface totalProps {
    firstName: string,
    familyName: string,
    budget: number,
}

export default function TotalBalance({ firstName, familyName, budget }: totalProps) {
    return (
      <div className="lg:h-[50%] md:lg-content md:w-[50%] sm:w-[50%] lg:w-content mb-6 rounded-xl text-white shadow-2xl transition-transform transform lg:hover:scale-110">
        <img className="relative object-cover w-full h-full rounded-xl" src="https://cdn.pixabay.com/photo/2014/06/16/23/39/black-370118_640.png" alt="Background" />
        <div className="w-full px-8 absolute top-3">
          <div className="flex justify-between mb-4">
            <div className="">
              <p className="font-bold lg:text-xl">Name</p>
              <p className="font-medium tracking-widest">{firstName} {familyName}</p>
            </div>
          </div>
          <div className="pt-1">
            <p className="lg:text-xl font-bold">Total Balance</p>
            <p className="lg:font-medium tracking-more-wider">{budget}$</p>
          </div>
        </div>
      </div>
    );
  }
  