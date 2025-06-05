const Loader = ({ size = 'md', color = 'border-blue-500' }) => {
  const sizeClasses = {
    sm: 'h-5 w-5', // Slightly smaller for inline use
    md: 'h-10 w-10', // Adjusted for better visual balance
    lg: 'h-20 w-20', // Adjusted
  };
  return (
    <div className="flex justify-center items-center py-4"> {/* Added some padding */}
      <div className={`animate-spin rounded-full ${sizeClasses[size]} border-t-2 border-b-2 ${color}`}></div>
    </div>
  );
};

export default Loader;
