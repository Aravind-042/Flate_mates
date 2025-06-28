import { ArrowLeft } from "lucide-react";

interface CreateListingHeaderProps {
  currentStep: 'form' | 'preview' | 'signup';
}

export const CreateListingHeader = ({ currentStep }: CreateListingHeaderProps) => {
  const getStepInfo = () => {
    switch (currentStep) {
      case 'form':
        return {
          title: "Create Your Listing",
          subtitle: "Fill in the details about your flat and preferences"
        };
      case 'preview':
        return {
          title: "Preview Your Listing",
          subtitle: "Review your listing before publishing"
        };
      case 'signup':
        return {
          title: "Almost There!",
          subtitle: "Sign up to publish your listing and connect with flatmates"
        };
      default:
        return {
          title: "Create Your Listing",
          subtitle: "Fill in the details about your flat and preferences"
        };
    }
  };

  const { title, subtitle } = getStepInfo();

  return (
    <div className="text-center mb-8">
      <h1 className="text-heading-1 font-secondary font-bold text-charcoal mb-4">
        {title}
      </h1>
      <p className="text-body-large font-primary text-gray-600 max-w-2xl mx-auto">
        {subtitle}
      </p>
      
      {/* Progress indicator */}
      <div className="flex justify-center mt-6">
        <div className="flex items-center space-x-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium font-accent ${
            currentStep === 'form' ? 'bg-deep-blue text-white' : 'bg-green-500 text-white'
          }`}>
            1
          </div>
          <div className={`w-12 h-0.5 ${
            currentStep === 'form' ? 'bg-gray-300' : 'bg-green-500'
          }`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium font-accent ${
            currentStep === 'form' ? 'bg-gray-300 text-gray-600' : 
            currentStep === 'preview' ? 'bg-deep-blue text-white' : 'bg-green-500 text-white'
          }`}>
            2
          </div>
          <div className={`w-12 h-0.5 ${
            currentStep === 'signup' ? 'bg-green-500' : 'bg-gray-300'
          }`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium font-accent ${
            currentStep === 'signup' ? 'bg-deep-blue text-white' : 'bg-gray-300 text-gray-600'
          }`}>
            3
          </div>
        </div>
      </div>
    </div>
  );
};