export const BrowseHeader = () => {
  return (
    <div className="text-center space-y-6">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
          Discover Your Perfect Home
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Browse through thousands of verified flat listings and find your ideal living space with compatible flatmates.
        </p>
      </div>
      
      {/* Quick Stats */}
      <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-center">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg">
          <div className="text-2xl font-bold text-blue-600">10K+</div>
          <div className="text-sm text-slate-600">Active Listings</div>
        </div>
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg">
          <div className="text-2xl font-bold text-purple-600">50+</div>
          <div className="text-sm text-slate-600">Cities</div>
        </div>
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg">
          <div className="text-2xl font-bold text-pink-600">95%</div>
          <div className="text-sm text-slate-600">Verified</div>
        </div>
      </div>
    </div>
  );
};