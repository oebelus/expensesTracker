export default function HeroSection() {
  return (
  <div>
    <section id='hero' className="dark:bg-gray-800 dark:text-gray-100">
      <div className="container flex flex-col justify-center p-6 mx-auto sm:py-12 lg:py-24 lg:flex-row lg:justify-between">
        <div className="flex flex-col justify-center p-6 text-center rounded-sm lg:max-w-md xl:max-w-lg lg:text-left">
          <h1 className="text-5xl font-bold leadi sm:text-6xl">Track Your
            <span className="dark:text-violet-400"> Expenses </span>Effortlessly
          </h1>
          <p className="mt-6 mb-8 text-lg sm:mb-12">Manage your finances smarter<br></br>and achieve your financial goals
          </p>
          <div className="flex flex-col space-y-4 sm:items-center sm:justify-center sm:flex-row sm:space-y-0 sm:space-x-4 lg:justify-start">
            <a rel="noopener noreferrer" href="/signup" className="px-8 py-3 text-lg font-semibold rounded dark:bg-violet-400 dark:text-gray-900">Get Started</a>
            <a rel="noopener noreferrer" href="#features" className="px-8 py-3 text-lg font-semibold border rounded dark:border-gray-100">Learn More</a>
          </div>
        </div>
        <div className="flex items-center justify-center p-6 mt-8 lg:mt-0 h-72 sm:h-80 lg:h-96 xl:h-112 2xl:h-128">
          <img src="hero.png" alt="" className="object-contain h-72 sm:h-80 lg:h-96 xl:h-112 2xl:h-128" />
        </div>
      </div>
    </section>
  </div>
  );
}