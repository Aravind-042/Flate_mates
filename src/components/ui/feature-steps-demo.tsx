
import { FeatureSteps } from "@/components/ui/feature-section"

const features = [
  { 
    step: 'Step 1', 
    title: 'No Brokerage',
    content: 'Connect directly with flat owners and save thousands on brokerage fees. Our platform enables direct communication between tenants and landlords.', 
    image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=1368&auto=format&fit=crop&ixlib=rb-4.0.3' 
  },
  { 
    step: 'Step 2',
    title: 'Verified Profiles',
    content: 'All users go through our verification process to ensure safety and authenticity. Connect with genuine people for a secure flatmate experience.',
    image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?q=80&w=1368&auto=format&fit=crop&ixlib=rb-4.0.3'
  },
  { 
    step: 'Step 3',
    title: 'Vibe Match Partners',
    content: 'Our smart matching algorithm connects you with flatmates who share similar lifestyles, interests, and living preferences for perfect compatibility.',
    image: 'https://images.unsplash.com/photo-1466721591366-2d5fba72006d?q=80&w=1368&auto=format&fit=crop&ixlib=rb-4.0.3'
  },
]

export function FeatureStepsDemo() {
  return (
    <div className="bg-gradient-to-br from-cool-gray to-white">
      <FeatureSteps 
        features={features}
        title="Why Choose FlatMate?"
        autoPlayInterval={4000}
        imageHeight="h-[500px]"
      />
    </div>
  )
}
