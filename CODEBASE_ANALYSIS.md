# Codebase Analysis

## Overall Architecture Summary

This document provides a detailed analysis of the project's codebase. The application is a modern, full-stack web application for finding and listing flat rentals, built with a clear separation of concerns between the frontend and backend.

**Frontend Architecture:**
*   **Framework:** React with TypeScript, built using Vite.
*   **Component Model:** Follows a feature-based component structure (e.g., `Auth`, `Browse`, `CreateListing`) with a foundational UI library based on `shadcn/ui` and `tailwindcss`.
*   **State Management:** Utilizes a hybrid approach:
    *   **Server State:** `@tanstack/react-query` is used for all asynchronous operations (fetching, creating, updating data), providing caching, invalidation, and request lifecycle management.
    *   **Global Client State:** `Zustand` is used for managing global UI state (`uiStore`) and cross-cutting concerns like user favorites (`favoritesStore`).
    *   **Local State:** Standard React hooks (`useState`, `useEffect`) are used for component-level state.
*   **Data Access:** A dedicated `ListingService` acts as a data access layer, centralizing all direct database queries and separating them from the state management hooks. This is a robust pattern.
*   **Type Safety:** The project is fully typed with TypeScript, including auto-generated types from the Supabase schema, which ensures strong type safety for all database interactions.

**Backend Architecture:**
*   **Platform:** Supabase.
*   **Database:** A PostgreSQL database with a well-structured schema. It includes tables for core features (users, listings), monetization (credits, referrals), and platform features (messaging, analytics, moderation).
*   **Security:** Row Level Security (RLS) is enabled on all tables, ensuring users can only access their own data. The later migrations show a strong focus on security, using `SECURITY DEFINER` functions with `SET search_path = ''` to prevent common PostgreSQL vulnerabilities.
*   **Server-Side Logic:** Uses PostgreSQL functions (RPC) and triggers for critical backend logic, such as atomically decrementing user credits (`consume_credit_for_contact`) and automatically creating user profiles (`handle_new_user`).
*   **Serverless Functions:** Uses Supabase Edge Functions for tasks that require secure environment variables, such as providing the Mapbox API token to the client.

**Key Features & Patterns:**
*   **Guest User Flow:** The application has a well-thought-out flow for guest users who want to create a listing. It saves their listing data to `localStorage` and then seamlessly publishes it after they sign up.
*   **Optimistic UI:** The `useCredits` hook uses optimistic updates to provide a responsive UI when a user spends a credit.
*   **Facade Hooks:** The `useAuth` hook acts as a facade, simplifying the consumption of complex, multi-faceted authentication state for UI components.
*   **Component-Based Design:** The application is built with small, reusable, and often feature-specific components, promoting maintainability.

This document provides a detailed analysis of the project's codebase, breaking down each file's role, props, interactions, and dependencies.

## Project Configuration and Entry Point

### `README.md`
*   **Role:** The primary guide for developers, introducing the project and outlining setup, development, and deployment methods.
*   **Details:** Confirms a tech stack of Vite, TypeScript, React, shadcn-ui, and Tailwind CSS. Explains that the project is managed with `npm` and can be developed locally or through the Lovable platform.
*   **Dependencies:** Points to the existence of `package.json`.

### `package.json`
*   **Role:** The project's manifest, defining scripts, dependencies, and metadata.
*   **Details:**
    *   **Scripts:** `dev`, `build`, `lint`, `preview`.
    *   **Core Dependencies:** `react`, `react-router-dom`, `@supabase/supabase-js`.
    *   **UI:** `radix-ui`, `lucide-react`, `tailwindcss`, `framer-motion` (indicating a `shadcn-ui` setup).
    *   **Data & State:** `@tanstack/react-query` for server state, `zustand` for client state.
    *   **Forms:** `react-hook-form` and `zod`.
    *   **Specialized:** `mapbox-gl` for maps.
*   **Relationships:** Central to the entire project, dictating the available technologies.

### `vite.config.ts`
*   **Role:** Configures the Vite build tool.
*   **Details:** Sets up the dev server, enables the React plugin, and configures a path alias (`@`) to point to the `src` directory. Includes a `lovable-tagger` plugin for development mode.
*   **Relationships:** Governs the build and development process.

### `index.html`
*   **Role:** The main HTML document and entry point for the Single Page Application (SPA).
*   **Details:** Contains metadata, social media tags, the root `<div>` (`<div id="root">`), and the script tag that loads `src/main.tsx`.
*   **Relationships:** The root of the DOM, loads the entire React application.

### `src/main.tsx`
*   **Role:** The JavaScript entry point of the application.
*   **Details:** Imports the main `App` component and the global stylesheet (`index.css`), and uses `ReactDOM.createRoot` to render the `App` component into the `<div id="root">` from `index.html`.
*   **Relationships:** The bridge between the static HTML and the dynamic React application.

### `src/App.tsx`
*   **Role:** The root component of the application's UI.
*   **Details:**
    *   **Providers:** Sets up global providers: `ErrorBoundary` for safety, `QueryClientProvider` for data fetching, `TooltipProvider` and `Toaster` for UI elements, and `BrowserRouter` for routing.
    *   **Routing:** Defines all application routes using `react-router-dom`, including a main `Layout`, a `ProtectedRoute` for the profile page, and a `NotFound` page.
*   **Relationships:** The central hub of the application's UI, orchestrating all pages and global contexts.

---

## `src/pages`

### `src/pages/Index.tsx`
*   **Role:** The application's homepage.
*   **Details:** A landing page that fetches and displays featured listings (`useFeaturedListings`), testimonials, and a call-to-action section. Composed of components from `src/components/Home`.
*   **Dependencies:** `BackgroundPattern`, `HeroSection`, `CircularTestimonialsDemo`, `CircularFlatListingsDemo`, `CTASection`, `useFeaturedListings`, `ListingService`.

### `src/pages/About.tsx`
*   **Role:** A static informational page describing the platform.
*   **Details:** Contains hardcoded content about the company's mission, features, and testimonials. Aims to build user trust.
*   **Dependencies:** `Card`, `Button` (from `ui`), `lucide-react`.

### `src/pages/Browse.tsx`
*   **Role:** The main discovery page for users to find listings.
*   **Details:** A complex page that fetches all listings (`useListings`), provides multiple client-side filtering options (search, city, gender, rent), and can toggle between a grid view (`ListingCard`) and a map view (`ListingMap`).
*   **Dependencies:** `LoadingGrid`, `EmptyState`, `ListingCard`, `SearchBar`, `ListingMap`, `useListings`, `useUIStore`, `ListingService`, `rc-slider`.

### `src/pages/CreateListing.tsx`
*   **Role:** Acts as a manager or controller for the multi-step listing creation process.
*   **Details:** Manages the `currentStep` (`form`, `preview`, `signup`) and the `listingData` state object. It delegates the UI rendering for each step to child components.
*   **Dependencies:** `CreateListingHeader`, `MainListingLayout`, `BackToProfileButton`, `useAuth`, `FlatListing` type.

### `src/pages/FlatDetail.tsx`
*   **Role:** The detailed view for a single property listing.
*   **Details:** Fetches data for one specific listing using the ID from the URL (`useListing`). Composes many smaller components from `src/components/FlatDetail` to display the information. Handles loading, error, and not-found states.
*   **Dependencies:** `PropertyImageGallery`, `PropertyHeader`, `PropertyPricing`, etc., `useListing`, `ListingService`.

### `src/pages/NotFound.tsx`
*   **Role:** The "404 Not Found" error page.
*   **Details:** Displayed for any invalid URL. Provides helpful navigation links back to the main parts of the site. Logs the invalid path for developer debugging.
*   **Dependencies:** `Button`, `Card`, `useLocation`, `useNavigate`.

### `src/pages/Profile.tsx`
*   **Role:** The user's personal dashboard.
*   **Details:** A protected route that uses a tabbed interface to show different sections: Profile editing, user's listings, user's favorites, and settings. Fetches data using `useAuth` and `useProfile`.
*   **Dependencies:** `Tabs`, `OptimizedProfileHeader`, `ProfileStats`, various `ProfileTab...` components, `useAuth`, `useProfile`, `useFavoritesStore`.

---

## `src/components`

### `src/components/Auth`

#### `AuthDialog.tsx`
*   **Role:** A modal dialog for authentication, wrapping the `AuthPage` to show it in a popup.
*   **Props:** `open`, `onOpenChange`, `signupRoleIntent`.
*   **Interaction:** Closes itself on successful authentication by calling `onOpenChange(false)`.

#### `AuthLayout.tsx`
*   **Role:** A presentational component providing a consistent visual wrapper (background, centered card) for all auth forms.
*   **Props:** `children`.
*   **Interaction:** None (stateless).

#### `AuthModeSwitch.tsx`
*   **Role:** A simple link to switch between auth modes (e.g., from Sign In to Sign Up).
*   **Props:** `onSwitch`, `text`, `linkText`.
*   **Interaction:** Calls the `onSwitch` prop when clicked.

#### `ForgotPasswordForm.tsx`
*   **Role:** Provides the UI and logic for the "Forgot Password" flow.
*   **Props:** `onBack`.
*   **Interaction:** Has two internal views (form and success message). Uses `useForgotPassword` hook to send the reset email.

#### `FormField.tsx`
*   **Role:** A reusable, standardized form field with a label and input. Includes optional password visibility toggle.
*   **Props:** `id`, `label`, `placeholder`, `value`, `onChange`, `type`, `showPasswordToggle`, `showPassword`, `onTogglePassword`.
*   **Interaction:** A standard controlled component.

#### `FormHeader.tsx`
*   **Role:** A presentational component for a consistent header on auth forms, including a logo, title, and subtitle.
*   **Props:** `title`, `subtitle`.
*   **Interaction:** None (stateless).

#### `GuestModeButton.tsx`
*   **Role:** A prominent, fixed button to allow users to bypass authentication and browse as a guest.
*   **Props:** None.
*   **Interaction:** Uses `useNavigate` to redirect to `/browse`. Heavily styled with `framer-motion`.

#### `LogoutButton.tsx`
*   **Role:** A button to sign the user out.
*   **Props:** None.
*   **Interaction:** Uses `useAuth` hook to call `signOut` and then navigates to the homepage.

#### `OAuthButtons.tsx`
*   **Role:** Renders buttons for signing in with third-party OAuth providers (e.g., Google).
*   **Props:** None.
*   **Interaction:** Uses `useOAuth` hook. Includes a feature flag (`isOAuthEnabled`) to disable the functionality if not ready.

#### `ResetPasswordForm.tsx`
*   **Role:** Handles the final step of a password reset after a user clicks the link in their email.
*   **Props:** `onBack`.
*   **Interaction:** A complex component with three internal views (verifying token, invalid token, valid form). Uses `useSearchParams` to get tokens from the URL and `supabase.auth.setSession` to validate them. Uses `useForgotPassword` hook to perform the final password update.

#### `RoleSelector.tsx`
*   **Role:** A dropdown for selecting a user's role ("Flat Seeker" or "Flat Owner") during signup.
*   **Props:** `value`, `onChange`.
*   **Interaction:** A standard controlled component using the `Select` component from `ui`.

#### `SignInForm.tsx`
*   **Role:** The complete UI and logic for the user sign-in process.
*   **Props:** `onSwitchToSignUp`, `onSwitchToForgotPassword`, `onSuccess`.
*   **Interaction:** Uses `useSignin` hook to handle the sign-in logic. Composed of other reusable `Auth` components.

#### `SignUpForm.tsx`
*   **Role:** The complete UI and logic for the user sign-up process, including profile data collection.
*   **Props:** `onSwitchToSignIn`, `signupRoleIntentProp`, `onSuccess`.
*   **Interaction:** Uses `useSignup` hook. Has smart logic to default the user's role based on `localStorage`. Composed of other reusable `Auth` components.

#### `SubmitButton.tsx`
*   **Role:** A specialized button for form submissions that shows a loading state.
*   **Props:** `isLoading`, `onClick`, `children`, `loadingText`.
*   **Interaction:** Conditionally renders a `TextShimmer` or the button text based on the `isLoading` prop. Disables the button when loading.

### `src/components/Browse`

#### `EmptyState.tsx`
*   **Role:** A presentational component shown on the Browse page when no listings match the search criteria.
*   **Props:** None.
*   **Interaction:** None (stateless).

#### `ListingCard.tsx`
*   **Role:** The visual summary of a single listing in the browse grid.
*   **Props:** `listing`, `onCardClick`.
*   **Interaction:** Highly interactive and optimized with `React.memo` and `useCallback`. Includes an image carousel, favorite button, tooltips, and a "Read More" feature for the description. Prevents navigation when internal buttons are clicked.

#### `LoadingGrid.tsx`
*   **Role:** A "skeleton screen" placeholder shown on the Browse page while listings are being fetched.
*   **Props:** None.
*   **Interaction:** Renders a grid of pulsing, grayed-out shapes that mimic the final layout.

### `src/components/CreateListing` and `src/components/CreateListing/FormSections`

#### `BackToProfileButton.tsx`
*   **Role:** A simple, reusable button to navigate "back to profile".
*   **Props:** `onBack`.
*   **Interaction:** Calls the `onBack` prop when clicked.

#### `CreateListingHeader.tsx`
*   **Role:** The header for the multi-step creation page, showing a dynamic title and a visual progress indicator.
*   **Props:** `currentStep`.
*   **Interaction:** Changes its content and styling based on the current step.

#### `MainListingLayout.tsx`
*   **Role:** The main two-column layout for the "Create Listing" page.
*   **Props:** `currentStep`, `listingData`, `onDataChange`, `onNext`, `onBack`, `userId`.
*   **Interaction:** Acts as a controller, rendering the correct component (`FlatListingForm`, `PreviewSection`, `SignupPrompt`) in the main area based on `currentStep`. The right column contains a sticky, real-time `FlatPreview`.

#### `AmenitiesSection.tsx`
*   **Role:** A form section for selecting amenities.
*   **Props:** `data`, `onChange`.
*   **Interaction:** A wrapper around the `AmenitiesSelector` component.

#### `AmenitiesSelector.tsx`
*   **Role:** A reusable component for selecting multiple items from a predefined list of amenities.
*   **Props:** `selected`, `onChange`.
*   **Interaction:** A controlled component that renders a grid of checkboxes and calls `onChange` with the new array of selected items.

#### `BasicDetailsSection.tsx`
*   **Role:** A form section for the listing's `title` and `description`.
*   **Props:** `data`, `onChange`, `errors`.
*   **Interaction:** Renders an `Input` and `Textarea`. Displays validation errors if provided.

#### `ImagesContactSection.tsx`
*   **Role:** A form section for uploading images and setting contact preferences.
*   **Props:** `data`, `onChange`.
*   **Interaction:** Delegates to the `ImageUpload` component and renders checkboxes for contact preferences.

#### `LocationSection.tsx`
*   **Role:** A form section for all location information.
*   **Props:** `data`, `onChange`, `errors`.
*   **Interaction:** Uses a `Select` for a hardcoded list of cities and a specialized `AddressInput` component for area and full address, which likely provides autocomplete and returns coordinates.

#### `NavigationButtons.tsx`
*   **Role:** Renders the "Previous" and "Next" buttons for the multi-section form.
*   **Props:** `currentSection`, `totalSections`, `onNext`, `onPrevious`, `isFirstSection`, `isLastSection`.
*   **Interaction:** Disables "Previous" on the first section and changes "Next" text to "Preview Listing" on the last section.

#### `PreferencesSection.tsx`
*   **Role:** A form section for the owner's preferences for tenants (gender, profession).
*   **Props:** `data`, `onChange`, `errors`.
*   **Interaction:** Uses a `Select` for gender and `Checkbox` controls for professions.

#### `ProgressIndicator.tsx`
*   **Role:** Displays the title of the current form section and a visual progress bar.
*   **Props:** `currentSection`, `totalSections`, `sections`.
*   **Interaction:** The progress bar's width is dynamically calculated based on the current progress.

#### `PropertyDetailsSection.tsx`
*   **Role:** A form section for the physical details of the property (type, bedrooms, bathrooms, furnished, parking).
*   **Props:** `data`, `onChange`, `errors`.
*   **Interaction:** Uses `Select` for property type/bedrooms/bathrooms and `Checkbox` for booleans. All are controlled components that update the parent state.

#### `RentCostsSection.tsx`
*   **Role:** A form section for financial details (rent, deposit, included costs).
*   **Props:** `data`, `onChange`, `errors`.
*   **Interaction:** Uses `Input` for numerical values and `Checkbox` for the "rent includes" multi-select. Includes specific logic to ensure rent is always >= 1.

#### `PreviewSection.tsx`
*   **Role:** The final confirmation step, showing a full preview and the "Publish" button.
*   **Props:** `listingData`, `onBack`, `onNext`, `userId`.
*   **Interaction:** This is a critical component. It validates the data. If the user is a guest, it saves the data to `localStorage` and proceeds to the signup step. If the user is authenticated, it maps the frontend data to the database schema and performs the `supabase` insert operation.

#### `SignupPrompt.tsx`
*   **Role:** A screen shown to guest users after they complete the listing form, prompting them to sign up.
*   **Props:** `onBack`.
*   **Interaction:** It displays the benefits of signing up and renders the `AuthDialog` in a modal when the user clicks the "Sign Up" button. It intelligently passes `signupRoleIntent="flat_owner"` to the dialog to pre-select the correct role.

### `src/components/Profile`

#### `OptimizedProfileHeader.tsx`
*   **Role:** The header for the user's profile page, displaying their avatar, name, and other key details.
*   **Props:** `profile`, `isLoading`.
*   **Interaction:** It includes a skeleton loading state. It has logic to display either the user's profile picture, their first initial if no picture exists, or a generic icon if no name exists.

#### `ProfileDetailsForm.tsx`
*   **Role:** A form for editing the user's personal details (name, phone, city, bio, etc.).
*   **Props:** `profileData`, `setProfileData`, `handleUpdateProfile`, `isLoading`.
*   **Interaction:** This form is tightly coupled to its parent. Instead of a generic `onChange` callback, it receives the `setProfileData` state setter function directly and calls it from each input. The `onSubmit` is wired to the `handleUpdateProfile` prop.

#### `ProfileHeader.tsx`
*   **Role:** A stylized, presentational header for the profile page. *(Note: This component appears to be unused in favor of `OptimizedProfileHeader`, which includes a loading state.)*
*   **Props:** `fullName`, `email`, `avatarUrl`.
*   **Interaction:** A stateless component that displays the user's info and has a placeholder for a future "edit picture" feature.

#### `ProfileStats.tsx`
*   **Role:** A dashboard-like component that displays key user statistics (active listings, favorites, credits).
*   **Props:** None.
*   **Interaction:** A great example of data aggregation. It fetches the listings count directly using the `supabase` client, gets the favorites count from a `zustand` store (`useFavoritesStore`), and gets the credits count from a custom hook (`useCredits`).

#### `ProfileTabFavorites.tsx`
*   **Role:** Renders the content for the "Favorites" tab on the profile page.
*   **Props:** None.
*   **Interaction:** It gets the list of favorite IDs from the `useFavoritesStore` and then filters the master list of all listings (from `useListings`) on the client side to find the full favorite listing objects. It can display them in a grid or list view.

#### `ProfileTabListings.tsx`
*   **Role:** Renders the content for the "My Listings" tab, showing all properties created by the user.
*   **Props:** None.
*   **Interaction:** This component fetches its own data directly from Supabase, filtering listings by the current user's ID. It also contains the logic to update a listing's status (`markAsRented`) or delete a listing entirely, with corresponding direct calls to the database.

#### `ProfileTabProfile.tsx`
*   **Role:** Renders the content for the main "Profile" tab.
*   **Props:** `profileData`, `setProfileData`, `handleUpdateProfile`, `isLoading`.
*   **Interaction:** This component acts as a container. It passes all of its props down to the `ProfileDetailsForm` component, which handles the actual form rendering and logic. It also displays the `CreditsDisplay` component.

#### `ProfileTabSettings.tsx`
*   **Role:** Renders the content for the "Settings" tab, allowing users to change their email/password, log out, or delete their account.
*   **Props:** `user`.
*   **Interaction:** This component makes direct calls to Supabase for updating user attributes and invoking a serverless function to delete the user account. It uses native `prompt()` and `confirm()` dialogs for user input.

### `src/components/Home`

#### `BackgroundPattern.tsx`
*   **Role:** A purely decorative component that renders a modern, animated background with large, blurred, floating color circles.
*   **Props:** None.
*   **Interaction:** Stateless. Uses CSS for the visual effect.

#### `CTASection.tsx`
*   **Role:** A "Call to Action" section to encourage users to create a listing.
*   **Props:** None.
*   **Interaction:** The main button's behavior is conditional on authentication. If the user is logged in, it links directly to `/create-listing`. If not, it shows a `toast` notification prompting them to sign up.

#### `HeroSection.tsx`
*   **Role:** The main "hero" section of the homepage.
*   **Props:** `searchQuery`, `setSearchQuery`.
*   **Interaction:** It contains the main headline, sub-headline, and primary action buttons ("Find a Flat", "List Your Flat"). It includes the `SearchBar` and lifts the search query state up to the parent page.

### `src/components/Map`

#### `ListingMap.tsx`
*   **Role:** A specialized map view for displaying multiple property listings.
*   **Props:** `listings`, `selectedListing`, `onListingSelect`, `height`, `className`.
*   **Interaction:** This component acts as a controller for the generic `LocationMap`. It takes an array of listing objects, filters out those without coordinates, transforms the rest into a `markers` array, and calculates the appropriate center point for the map. It also handles the empty state if no listings have location data.

#### `LocationMap.tsx`
*   **Role:** A generic, low-level wrapper around the `mapbox-gl` library.
*   **Props:** `center`, `zoom`, `markers`, `onMapClick`, etc.
*   **Interaction:** This is a complex component that handles the entire map lifecycle. It securely fetches the Mapbox token from a Supabase function, initializes the map, manages adding and removing markers and popups, and handles map events. It encapsulates all direct Mapbox API calls.

### `src/components/ui`

This directory contains the base UI building blocks of the application, many of which are based on `shadcn/ui`.

#### `FavoriteButton.tsx`
*   **Role:** A self-contained "favorite" (heart) button.
*   **Props:** `listingId`, `size`, `variant`.
*   **Interaction:** This component is a great example of encapsulating logic. It connects to a global `zustand` store (`useFavoritesStore`) to get its state (`isFavorite`) and to update its state (`toggleFavorite`). Its `onClick` handler also stops event propagation to prevent unintended parent actions.

#### `ImageCarousel.tsx`
*   **Role:** A feature-rich, reusable carousel for displaying images.
*   **Props:** `images`, `title`, and various options to control UI elements like arrows and indicators.
*   **Interaction:** Manages its own `currentIndex` state. Includes logic for navigation (next, previous, go-to-index) and looping. Conditionally renders controls and has a fallback UI for when no images are provided. Stops click propagation on its controls.

---

## `src/hooks`

This directory contains all the custom React hooks for the application, separating concerns like authentication, data fetching (queries), and other reusable logic.

### `useAuth.tsx`
*   **Role:** The main, high-level "facade" hook for authentication.
*   **What it does:** This hook composes several lower-level hooks (`useAuthState`, `useProfile`, `usePendingListing`) into a single interface. It contains the core `useEffect` that orchestrates what happens when a user's session changes, such as fetching their profile or publishing a pending listing they created as a guest.
*   **What it returns:** A comprehensive object with `user`, `session`, `profile`, `loading`, `isAuthenticated`, and the `signOut` function.
*   **Where it's used:** Intended for broad use in any component that needs to know the user's auth status or display their profile information.

### `auth/useAuthState.ts`
*   **Role:** A low-level hook that directly tracks the Supabase authentication state.
*   **What it does:** This is the foundational auth hook. It subscribes to Supabase's `onAuthStateChange` event to get real-time updates on the user's session. It also provides a robust `signOut` function that clears all browser storage and reloads the page.
*   **What it returns:** The raw `user` and `session` objects from Supabase, a `loading` state, and the `signOut` function.
*   **Where it's used:** It is primarily consumed by the main `useAuth` hook.

### `auth/useProfile.ts`
*   **Role:** A hook to manage the user's public profile data from the `profiles` table.
*   **What it does:** It handles fetching a user's profile by their ID and updating it. It includes a clever retry mechanism in `fetchProfile` to handle the slight delay for new user profile creation via database triggers.
*   **What it returns:** The `profile` object, `loading` state, and functions to `fetchProfile` and `updateProfile`.
*   **Where it's used:** It's a core part of the `useAuth` hook and is also used on the `Profile` page to save changes.

### `auth/usePendingListing.ts`
*   **Role:** A specialized hook to handle publishing a listing that was created by a guest and saved to `localStorage`.
*   **What it does:** This hook retrieves the pending listing data from storage, validates it, maps it to the database schema, and inserts it into the `flat_listings` table, associating it with the newly authenticated user.
*   **What it returns:** An `isPublishingPending` flag and the `publishPendingListing` function.
*   **Where it's used:** It is consumed exclusively by the main `useAuth` hook, which calls it automatically after a user signs in.

### `useSignup.ts`
*   **Role:** Encapsulates the logic for signing up a new user.
*   **What it does:** It validates the input, then calls `supabase.auth.signUp()`. It correctly passes extra profile information (full name, role, etc.) in the `options.data` field, which is then used by a database trigger to create a corresponding row in the `profiles` table. It provides detailed user feedback via toasts.
*   **What it returns:** The `signUp` function and an `isLoading` boolean.
*   **Where it's used:** Used by `SignUpForm.tsx`.

### `useSignin.ts`
*   **Role:** Encapsulates the logic for signing in a user with an email and password.
*   **What it does:** It validates the input, calls `supabase.auth.signInWithPassword()`, and provides specific error feedback based on the API response. On success, it calls an `onSuccess` callback or navigates to the homepage.
*   **What it returns:** The `signIn` function and an `isLoading` boolean.
*   **Where it's used:** Used by `SignInForm.tsx`.

### `useForgotPassword.ts`
*   **Role:** Encapsulates the logic for the entire two-step password reset flow.
*   **What it does:** It provides two functions: `sendResetEmail` (which calls `supabase.auth.resetPasswordForEmail`) and `resetPassword` (which calls `supabase.auth.updateUser` to set the new password).
*   **What it returns:** The `sendResetEmail` and `resetPassword` functions, along with an `isLoading` boolean.
*   **Where it's used:** Used by `ForgotPasswordForm.tsx` and `ResetPasswordForm.tsx`.

### `useOAuth.ts`
*   **Role:** Encapsulates the logic for signing in with a third-party OAuth provider.
*   **What it does:** It calls `supabase.auth.signInWithOAuth()`, which handles the redirect to the provider and back. The hook manages a per-provider loading state and provides detailed error feedback for common issues like pop-up blockers.
*   **What it returns:** The `signInWithProvider` function and an `isLoading` object.
*   **Where it's used:** Used by `OAuthButtons.tsx`.

### `useCredits.ts`
*   **Role:** A comprehensive hook to manage all logic related to user credits and referrals.
*   **What it does:** This is a complex hook that uses React Query to fetch the user's credit balance and referral history. It provides a `checkContactAccess` function that performs an optimistic UI update and then calls a server-side RPC function to atomically decrement credits. It also provides a mutation for creating new referrals. It returns many helper functions and computed values for easy UI integration.
*   **What it returns:** A large object with credit/referral data, loading states, action functions, and computed values.
*   **Where it's used:** Used on the `Profile` page and in any component that deals with credits or referrals.

### `useRateLimit.ts`
*   **Role:** Provides client-side functions to interact with server-side security features.
*   **What it does:** It provides a `checkRateLimit` function that calls a Supabase RPC to check if a user has performed an action too many times. It also provides a `logSecurityEvent` function to log important events to the database.
*   **What it returns:** The `checkRateLimit` and `logSecurityEvent` functions.
*   **Where it's used:** `checkRateLimit` is used in the `useCredits` hook.

### `queries/useListings.ts`
*   **Role:** The central hub for all data fetching and mutations related to listings, using React Query.
*   **What it does:** This file defines a query key factory (`listingKeys`) for consistency, and a suite of custom hooks for every data operation:
    *   **Queries:** `useListings`, `useListing(id)`, `useOwnerListings(ownerId)`, etc. These wrap `useQuery` and pair a key with a fetcher function from `ListingService`.
    *   **Mutations:** `useCreateListing`, `useUpdateListing`, `useDeleteListing`, etc. These wrap `useMutation` and handle the API calls. Critically, their `onSuccess` callbacks perform intelligent cache invalidation and updates, providing a seamless UX.
*   **What it returns:** Standard React Query hook return objects (`data`, `isLoading`, `mutate`, etc.).
*   **Where it's used:** Used across the entire application wherever listing data is needed or modified.

---

## `src/services` and `src/integrations`

This section covers modules that directly interact with the backend or provide data transformation logic.

### `src/integrations/supabase/client.ts`
*   **Role:** Creates and exports the singleton, type-safe Supabase client instance.
*   **What it does:** It calls the `createClient` function from the Supabase library, passing in the project's URL and public key. It also uses a generic `Database` type (from an auto-generated file) to provide strong TypeScript support for all database operations.
*   **Where it's used:** This client is imported and used by nearly every hook and service that communicates with the backend.

### `src/services/listingService.ts`
*   **Role:** The data access layer for all listing-related database operations.
*   **What it does:** This service centralizes all Supabase queries for listings. It provides static methods for fetching, creating, updating, and deleting listings. It also contains critical data transformation functions (`transformToFlatListing` and `transformToDbInsert`) that act as an anti-corruption layer between the frontend data structures and the backend database schema.
*   **Where it's used:** This service is the workhorse for the hooks defined in `useListings.ts`.

---

## `src/lib`, `src/utils`, `src/store`, and `src/types`

This section covers the various utility and type definition files that support the application.

### `src/lib/utils.ts`
*   **Role:** Provides a utility function `cn` for conditionally merging Tailwind CSS classes.
*   **What it does:** It combines the `clsx` and `tailwind-merge` libraries. `clsx` allows for flexible conditional class application, and `tailwind-merge` intelligently resolves conflicting Tailwind classes (e.g., `p-2` and `p-4` becomes just `p-4`).
*   **Where it's used:** Used extensively in UI components to manage dynamic styles.

---

## `supabase` Directory

This directory contains all the backend assets for the project, managed by the Supabase CLI.

### `functions/mapbox-token/index.ts`
*   **Role:** A serverless Edge Function to securely provide the Mapbox access token.
*   **What it does:** Instead of hardcoding the Mapbox token in the frontend code (which is insecure), the frontend calls this function. The function, running on the server, reads the token from a secure environment variable (`Deno.env.get()`) and returns it to the client.
*   **Where it's used:** Called by the `LocationMap.tsx` component during its initialization.

### Database Schema Summary

This is a consolidated summary of the final database schema, based on an analysis of all migration files.

#### Core Tables

*   **`profiles`**: Stores public user profile information.
    *   **Purpose**: To hold data about users that can be displayed publicly or to other users, separate from the private `auth.users` table.
    *   **Key Columns**: `id` (links to `auth.users.id`), `full_name`, `email`, `phone_number`, `profile_picture_url`, `role` (`flat_seeker` or `flat_owner`).
    *   **RLS Policies**: Users can view and update their own profile. A special policy allows limited access to a profile *only if* the viewing user has spent a credit to unlock contact details for one of that profile's listings. This is a critical security policy.

*   **`flat_listings`**: The central table for all property listings.
    *   **Purpose**: To store all details about the properties listed on the platform.
    *   **Key Columns**: `id`, `owner_id` (FK to `profiles.id`), `title`, `description`, `property_type`, `monthly_rent`, `amenities` (array), `images` (array), `status` (`active`, `rented`, etc.).
    *   **RLS Policies**: Anyone can view active listings. Users can only insert, update, or delete listings where they are the owner.

*   **`locations`**: Stores location data for listings. *(Note: The schema seems to have moved away from a separate `locations` table towards embedding location data directly in `flat_listings`, but the table and some foreign keys may still exist).*

*   **`user_favorites`**: A simple join table to track which users have favorited which listings.
    *   **Purpose**: To manage the many-to-many relationship between users and listings for the "favorites" feature.
    *   **Key Columns**: `user_id`, `listing_id`.
    *   **RLS Policies**: Users can only manage their own favorites.

#### Feature-Specific Tables

*   **Messaging System (`conversations`, `messages`, `message_attachments`)**:
    *   **Purpose**: To enable a full-featured, private messaging system between users, typically initiated from a listing.
    *   **RLS Policies**: Users can only view or participate in conversations where they are one of the two participants.

*   **Credits & Referrals (`user_credits`, `referrals`, `credit_transactions`, `contact_access_log`)**:
    *   **Purpose**: A comprehensive system to manage the platform's monetization and growth loop.
    *   **`user_credits`**: Tracks the number of credits each user has.
    *   **`referrals`**: Tracks referral codes sent by users to others.
    *   **`credit_transactions`**: An audit log of every time credits are earned or spent.
    *   **`contact_access_log`**: Records when a user spends a credit to unlock contact information for a specific listing.
    *   **RLS Policies**: All tables are strictly protected so users can only see and manage their own credit and referral data.

*   **Platform & Analytics (`listing_views`, `user_activity_log`, `property_reports`, `listing_boosts`, `trending_searches`, `security_audit_log`, `rate_limits`)**:
    *   **Purpose**: A suite of tables for analytics, moderation, and security.
    *   **Key Features**: Tracks listing views, logs user actions, allows users to report listings, enables paid "boosts" for listings, tracks popular search terms, and provides tables for security auditing and rate limiting.
    *   **RLS Policies**: Generally, users can only view their own data (e.g., their own activity log). Admins would have broader access.

#### Key Database Functions & Triggers

*   **`handle_new_user()` (Trigger)**: This is a critical trigger that runs *after* a new user is created in `auth.users`. It automatically creates a corresponding row for them in the public `profiles` table, copying over metadata like their full name that was provided during signup.
*   **`handle_referral_completion()` (Trigger)**: Runs after a new profile is created. It checks if the new user's email matches a pending referral, and if so, completes the referral and awards credits to both the referrer and the new user.
*   **`consume_credit_for_contact()` (RPC Function)**: A `SECURITY DEFINER` function that safely and atomically decrements a user's credits and logs the contact access event. Using an RPC for this is a robust way to handle transactions.
*   **`check_rate_limit()` (RPC Function)**: A server-side function to check if a user has performed an action too many times, used to prevent spam.
*   **Full-Text Search (`update_listing_search_vector`, `search_listings`)**: The database uses a `tsvector` column on `flat_listings` to enable efficient full-text search. The `update_listing_search_vector` trigger automatically keeps this column up-to-date, and the `search_listings` function provides a powerful and ranked search interface.
*   **Security (`SET search_path = ''`)**: The later migration files systematically add `SET search_path = ''` to all `SECURITY DEFINER` functions. This is a critical security best practice in PostgreSQL that prevents a malicious user from temporarily creating their own functions in a different schema to hijack the logic of a privileged function.

### `src/utils/storageUtils.ts`
*   **Role:** Provides a safe interface for interacting with the browser's `localStorage`.
*   **What it does:** It contains functions to save, get, and clear a "pending" listing created by a guest user. The `savePendingListingData` function is particularly robust, as it checks the size of the data *before* attempting to save it to prevent exceeding the browser's storage quota.
*   **Where it's used:** Used by the `PreviewSection` component (to save data) and the `usePendingListing` hook (to get and clear data).

### `src/utils/imageUtils.ts`
*   **Role:** Provides client-side helper functions for image processing.
*   **What it does:** Includes a `compressImage` function that uses the `Canvas` API to resize and compress user-uploaded images before they are saved or uploaded. Also includes helpers to calculate the size of base64-encoded images.
*   **Where it's used:** Used by the `ImageUpload` component and `storageUtils.ts`.

### `src/utils/inputValidation.ts`
*   **Role:** Provides client-side functions for input validation and sanitization.
*   **What it does:** It includes a `sanitizeInput` function to strip potentially malicious code from user input. It also has various `validate...` functions for specific data types (email, phone number, etc.). It even contains a simple client-side rate-limiting utility.
*   **Where it's used:** Intended for use in form components to ensure data integrity and security.

### `src/store/favoritesStore.ts`
*   **Role:** A global state management store for user favorites, built with `Zustand`.
*   **What it does:** This store manages the set of favorited listing IDs. It uses `zustand/persist` middleware to save the state to `localStorage`. It provides async actions (`addToFavorites`, `removeFromFavorites`) that perform database operations and then update the local state.
*   **Where it's used:** Consumed by the `useFavoritesStore` hook, which is used in components like `FavoriteButton.tsx` and `ProfileTabFavorites.tsx`.

### `src/store/uiStore.ts`
*   **Role:** A global `Zustand` store for various shared UI states.
*   **What it does:** It manages a wide variety of transient UI state, such as modal visibility, theme preferences, search filters, and a custom notification system. Unlike the favorites store, this one is not persisted to `localStorage`.
*   **Where it's used:** Used across the application by any component that needs to read or modify shared UI state.

### `src/types/flat.ts`
*   **Role:** Defines the central TypeScript interface for a listing.
*   **What it does:** It exports the `FlatListing` interface, which describes the shape of a listing object as it's used throughout the frontend (e.g., in component props and hook states).
*   **Where it's used:** Imported and used in dozens of files across the application to ensure type safety.
