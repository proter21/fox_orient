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

### Home Page

- The main landing page of the application. Displays a welcome message, features, and upcoming events. Located at `/app/page.tsx`.

### Gallery Page

- A page that displays a gallery of images with filtering options based on competitions. Located at `/app/gallery/page.tsx`.

### Competition Details Page

- A page that displays details of a specific competition. Located at `/app/competitions/[id]/page.tsx`.

### Competition Registration Page

- A page that allows users to register for a specific competition. Located at `/app/competitions/[id]/register/page.tsx`.

### Registration Page

- A page that allows users to create a new account. Located at `/app/register/page.tsx`.

### Login Page

- A page that allows users to log into their account. Located at `/app/login/page.tsx`.

### Calendar Page

- A page that displays a calendar of events. Located at `/app/calendar/page.tsx`.

### News Page

- A page that displays news articles and updates. Located at `/app/news/page.tsx`.

### Profile Page

- A page that allows users to view and edit their profile information. Located at `/app/profile/page.tsx`.

## Interfaces

### Competition

- Defines the structure of a competition object. Located at `/interfaces/index.ts`.

### GalleryItem

- Defines the structure of a gallery item object. Located at `/app/gallery/page.tsx`.

## Summary

This structure helps in organizing the project into logical sections, making it easier to manage and scale. Each directory and file has a specific purpose, contributing to the overall functionality of the application.
