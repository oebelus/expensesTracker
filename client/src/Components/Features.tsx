export default function Features() {
  return (
        <section id="features" className="text-gray-400 bg-gray-900 body-font">
  <div className="container px-5 py-24 mx-auto flex flex-wrap">
    <div className="flex flex-col text-center w-full mb-20">
      <h2 className="text-xs text-indigo-400 tracking-widest font-medium title-font mb-1">Expense Tracker App</h2>
      <h1 className="sm:text-3xl text-2xl font-medium title-font text-white">OUR FEATURES</h1>
    </div>
    <div className="flex flex-wrap -m-4">
      <div className="p-4 md:w-1/3">
        <div className="flex rounded-lg h-full bg-gray-800 bg-opacity-60 p-8 flex-col">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full bg-indigo-500 text-white flex-shrink-0">
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
            </div>
            <h2 className="text-white text-lg title-font font-medium">Dashboard Overview</h2>
          </div>
          <div className="flex-grow">
            <p className="leading-relaxed text-base">Get a bird's eye view of your finances with our intuitive dashboard. Track your spending habits, monitor budget allocations, and stay on top of your financial health effortlessly.</p>
          </div>
        </div>
      </div>
      <div className="p-4 md:w-1/3">
        <div className="flex rounded-lg h-full bg-gray-800 bg-opacity-60 p-8 flex-col">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full bg-indigo-500 text-white flex-shrink-0">
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <h2 className="text-white text-lg title-font font-medium">Saving Plans Management</h2>
          </div>
          <div className="flex-grow">
            <p className="leading-relaxed text-base">Plan for the future with ease using our saving plans feature. Set achievable goals, allocate funds accordingly, and watch your savings grow over time. Stay motivated and accountable on your journey towards financial stability.</p>
          </div>
        </div>
      </div>
      <div className="p-4 md:w-1/3">
        <div className="flex rounded-lg h-full bg-gray-800 bg-opacity-60 p-8 flex-col">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full bg-indigo-500 text-white flex-shrink-0">
              <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-5 h-5" viewBox="0 0 24 24">
                <circle cx="6" cy="6" r="3"></circle>
                <circle cx="6" cy="18" r="3"></circle>
                <path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"></path>
              </svg>
            </div>
            <h2 className="text-white text-lg title-font font-medium">Transactions</h2>
          </div>
          <div className="flex-grow">
            <p className="leading-relaxed text-base">Keep a detailed record of your transactions. Easily categorize expenses, view transaction history, and gain insights into your spending habits to make informed financial decisions.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
  )
}
