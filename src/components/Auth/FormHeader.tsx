
interface FormHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export const FormHeader = ({ title, subtitle, icon }: FormHeaderProps) => {
  return (
    <div className="text-center space-y-4 mb-8">
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-purple-500 rounded-sm transform rotate-45"></div>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-gray-800">
          {title}
        </h1>
        {subtitle && (
          <p className="text-gray-600 text-sm">{subtitle}</p>
        )}
      </div>
    </div>
  );
};
