# Project Structure

This document outlines the structure of the project, including directories, files, and their purposes.

## Directories and Files

### `/app`

- Contains the main application pages and components.

#### `/app/gallery`

- `page.tsx`: The gallery page component. Displays a gallery of images with filtering options based on competitions.

#### `/app/page.tsx`

- The main home page component. Displays the homepage with a carousel, features, and upcoming events.

#### `/app/competitions`

- Contains pages related to competitions.

##### `/app/competitions/[id]`

- `page.tsx`: The competition details page component. Displays details of a specific competition.

##### `/app/competitions/[id]/register`

- `page.tsx`: The competition registration page component. Allows users to register for a specific competition.

#### `/app/register`

- `page.tsx`: The registration page component. Allows users to create a new account.

#### `/app/login`

- `page.tsx`: The login page component. Allows users to log into their account.

#### `/app/calendar`

- `page.tsx`: The calendar page component. Displays a calendar of events.

#### `/app/news`

- `page.tsx`: The news page component. Displays news articles and updates.

#### `/app/profile`

- `page.tsx`: The profile page component. Allows users to view and edit their profile information.

### `/components`

- Contains reusable UI components.

#### `/components/AutoCarousel.tsx`

- Autoplay carousel component. Displays a carousel of images with autoplay functionality.

### `/components/ui`

- Contains UI-specific components.

#### `/components/ui/card.tsx`

- Card component for displaying content in a card layout.

#### `/components/ui/carousel.tsx`

- Carousel component for creating carousels.

#### `/components/ui/select.tsx`

- Select component for dropdown menus.

### `/firebase`

- Contains Firebase configuration and initialization files.

#### `/firebase/firebase.ts`

- Firebase configuration and initialization. Sets up the connection to Firebase services.

### `/interfaces`

- Contains TypeScript interfaces for type definitions.

#### `/interfaces/index.ts`

- TypeScript interfaces for the project. Defines the structure of data used throughout the project.

### `/public`

- Contains static assets like images.

#### `/public/images`

- Directory for image assets. Stores images used in the project.

### `/styles`

- Contains global styles and CSS files.

#### `/styles/globals.css`

- Global CSS styles for the project. Defines common styles used across the application.

## Firebase Configuration

The project uses Firebase for backend services. The configuration file is located at `/firebase/firebase.ts`.

### Firebase Services Used

- Firestore: For storing and retrieving data.
- Authentication: For user authentication and management.

## Components

### AutoCarousel

- A carousel component that automatically plays through a set of images. Located at `/components/AutoCarousel.tsx`.

### Card

- A UI component for displaying content in a card layout. Located at `/components/ui/card.tsx`.

### Carousel

- A UI component for creating carousels. Located at `/components/ui/carousel.tsx`.

### Select

- A UI component for dropdown menus. Located at `/components/ui/select.tsx`.

## Pages

### Home Page (`/app/page.tsx`)

- Landing page featuring:
  - Hero section with auto-playing carousel
  - Latest news and announcements
  - Upcoming competitions (next 2 competitions)
  - Club features and benefits
  - Quick access links to important sections
  - Contact information
  - Integration with Firebase for real-time data

### Gallery Page (`/app/gallery/page.tsx`)

- Photo gallery system featuring:
  - Grid layout of competition photos
  - Filtering by competition/event
  - Lightbox view for full-size images
  - Admin features:
    - Upload new photos
    - Delete photos
    - Organize photos by competition
  - Firebase Storage integration for image hosting
  - Real-time updates using Firestore

### Competition Pages

#### `/app/competitions`

- `page.tsx`: Main competitions listing page
  - Displays all competitions in a grid layout
  - Shows competition details like name, date, location, and entry fee
  - Admin users can see additional options to add new competitions
  - Each competition card has links to view details and participants (for admins)
  - Competitions are fetched from Firebase Firestore

#### `/app/competitions/new`

- `page.tsx`: Create new competition page (Admin only)
  - Form for creating new competitions with fields:
    - Name
    - Date
    - First Start Time
    - Location
    - Entry Fee
    - Age Groups (configurable for male/female categories)
    - Description
    - File attachment (PDF)
  - Age groups are predefined:
    - Male: м14, м16, м19, м21, м40, м50, м60, м70
    - Female: ж14, ж16, ж19, ж21, ж35, ж50
  - Saves competition data to Firebase Firestore

#### `/app/competitions/[id]`

- `page.tsx`: Competition details page
  - Displays complete competition information
  - Registration button for logged-in users
  - Shows registration status
  - Registration closes 2 days before the competition
  - Admin features:
    - Edit competition
    - View participants
    - Delete competition
  - Unsubscribe option for registered users (until 2 days before)

#### `/app/competitions/[id]/register`

- `page.tsx`: Competition registration page
  - Shows registration form for logged-in users
  - Pre-fills user information
  - Age group selection based on:
    - User's gender
    - User's age
    - Available competition age groups
  - Validation rules:
    - Checks if user's age matches selected group
    - Verifies group is available in competition
    - Prevents duplicate registrations
  - Updates both competition and user documents in Firestore

#### `/app/competitions/[id]/participants`

- `page.tsx`: Competition participants page (Admin view)
  - Lists all registered participants
  - Groups participants by age category
  - Shows detailed participant information:
    - Full name
    - Email
    - Birth date
    - Age group
  - Displays total participant count
  - Sortable by age groups

#### `/app/competitions/[id]/edit`

- `page.tsx`: Competition edit page (Admin only)
  - Pre-filled form with current competition data
  - Same fields as creation form
  - Updates competition document in Firestore
  - Validation for required fields
  - Success/error notifications

#### `/app/competitions/manage`

- `page.tsx`: Competition management page (Admin only)
  - Lists all competitions in table format
  - Quick actions:
    - Delete competitions
    - View details
    - Edit competitions
  - Add new competition form
  - Manages competition data in Firestore

### Profile Page (`/app/profile/page.tsx`)

- User profile management:
  - Personal information display and editing
  - Competition history:
    - Upcoming competitions (registered)
    - Past competitions
  - Age group management:
    - Current age group
    - Automatic age group suggestions
  - Account settings:
    - Email preferences
    - Password change
    - Profile picture
  - Admin panel access (for admin users)
  - Firebase Authentication integration

### Calendar Page (`/app/calendar/page.tsx`)

- Interactive calendar featuring:
  - Monthly view of all events
  - Competition dates highlighted
  - Event details on click:
    - Competition name
    - Location
    - Start time
    - Registration status
  - Filter options:
    - By competition type
    - By age group
    - By location
  - Integration with competition data from Firestore
  - Export calendar functionality

### News Page (`/app/news/page.tsx`)

- Club news and updates:
  - Latest announcements
  - Competition results
  - Training schedules
  - Club achievements
  - Admin features:
    - Create new posts
    - Edit existing posts
    - Delete posts
    - Pin important announcements
  - Rich text editor for content
  - Image embedding
  - Firebase Firestore for content storage

### Registration Page (`/app/register/page.tsx`)

- New user registration:
  - Form fields:
    - Full name
    - Email
    - Password
    - Birth date
    - Gender
  - Age group auto-assignment
  - Email verification
  - Terms and conditions acceptance
  - Firebase Authentication integration
  - Automatic profile creation in Firestore
  - Welcome email sending

### Login Page (`/app/login/page.tsx`)

- User authentication:
  - Email/password login
  - Remember me option
  - Password reset functionality
  - Error handling:
    - Invalid credentials
    - Account not verified
    - Account locked
  - Redirect to previous page after login
  - Session management
  - Firebase Authentication integration

### Admin Dashboard (`/app/admin/page.tsx`)

- Administrative features:
  - User management:
    - View all users
    - Edit user roles
    - Manage age groups
  - Competition management:
    - Create/Edit/Delete competitions
    - Manage registrations
    - View statistics
  - Gallery management:
    - Upload/Delete photos
    - Organize albums
  - News management:
    - Create/Edit/Delete posts
  - System statistics:
    - User counts
    - Registration statistics
    - Popular competitions
  - Access control based on admin role

### Data Structures

### Competition Data Structure

```typescript
interface Competition {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  location: string;
  entryFee: number;
  ageGroups: string[];
  participants: string[];
}
```

### Age Group Structure

The system uses predefined age groups for both male and female categories:

- Male groups: м14, м16, м19, м21, м40, м50, м60, м70
- Female groups: ж14, ж16, ж19, ж21, ж35, ж50

Age group assignment rules:

- Groups are assigned based on participant's age and gender
- Users under 21 can only register for groups up to their age
- Users over 21 can register for groups matching or above their age

### User Interface

```typescript
interface User {
  id: string;
  fullName: string;
  email: string;
  birthDate: string;
  gender: string;
  ageGroup: string;
  role: string;
  createdAt: string;
}
```

### News Post Interface

```typescript
interface NewsPost {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  isPinned: boolean;
  imageUrls: string[];
}
```

### Gallery Item Interface

```typescript
interface GalleryItem {
  id: string;
  imageUrl: string;
  competitionId: string;
  competitionName: string;
  caption: string;
  createdAt: string;
}
```

## Summary

This structure helps in organizing the project into logical sections, making it easier to manage and scale. Each directory and file has a specific purpose, contributing to the overall functionality of the application.
