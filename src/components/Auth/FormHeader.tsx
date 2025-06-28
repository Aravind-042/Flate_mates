interface FormHeaderProps {
  title: string;
  subtitle?: string;
}

export const FormHeader = ({ title, subtitle }: FormHeaderProps) => {
  return (
    <div className="text-center space-y-4 mb-8">
      {/* Brand Logo */}
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-sm transform rotate-45"></div>
          </div>
        </div>
      </div>
      
      {/* Title and Subtitle */}
      <div className="space-y-2">
        <h1 className="text-heading-2 text-slate-800">
          {title}
        </h1>
        {subtitle && (
          <p className="text-body text-slate-600">{subtitle}</p>
        )}
      </div>
    </div>
  );
};