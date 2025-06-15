
export const BackgroundPattern = () => {
  return (
    <div className="absolute inset-0 opacity-40">
      <div className="absolute top-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-br from-coral-400 to-pink-400 rounded-full blur-3xl opacity-20 animate-bounce"></div>
      <div className="absolute top-1/2 right-0 w-48 h-48 sm:w-80 sm:h-80 bg-gradient-to-br from-violet-400 to-purple-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 left-1/2 w-40 h-40 sm:w-72 sm:h-72 bg-gradient-to-br from-mint-400 to-blue-400 rounded-full blur-3xl opacity-20 animate-bounce"></div>
    </div>
  );
};
