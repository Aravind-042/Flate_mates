
interface CreateListingHeaderProps {
  currentStep: 'form' | 'preview';
}

export const CreateListingHeader = ({ currentStep }: CreateListingHeaderProps) => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 hero-text-gradient">
        Create New Listing
      </h1>
      <p className="text-xl text-gray-600">
        {currentStep === 'form' ? 'Fill in your property details' : 'Review and publish your listing'}
      </p>
    </div>
  );
};
