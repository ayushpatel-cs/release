# ReLease Frontend

Frontend application for ReLease - a platform for subleasing properties with an auction-based system.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google Maps API Key

## Tech Stack

- React 18
- React Router v6
- Tailwind CSS
- Google Maps API
- Axios for API calls

## Setup

1. **Install Dependencies**

```bash
npm install
```

2. **Environment Variables**
Create a `.env` file in the root directory:
```
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

3. **Development Server**

```bash
npm start
```

## Project Structure
```
release/
├── public/                # Static files
├── src/
│   ├── components/       # React components
│   │   ├── Auth/        # Authentication components
│   │   ├── Homepage/    # Homepage components
│   │   ├── Listing/     # Property listing components
│   │   └── shared/      # Shared/reusable components
│   ├── contexts/        # React contexts
│   ├── hooks/           # Custom hooks
│   ├── services/        # API services
│   ├── utils/           # Utility functions
│   └── App.js           # Root component
```

## Key Features

### Homepage
- Property search functionality

### Property Listings
- Detailed property view
- Image gallery
- Google Maps integration
- Amenities display
- Bidding system

### Seller Dashboard
- Property management
- Bid monitoring
- Property details editing

## Available Scripts

- `npm start` - Run development server
- `npm build` - Build for production
- `npm run deploy` - Deploy to production

## Environment Variables

| Variable | Description | Required |
|----------|-------------|-----------|
| REACT_APP_API_URL | Backend API URL | Yes |
| REACT_APP_GOOGLE_MAPS_API_KEY | Google Maps API Key | Yes |

## Deployment

Our application is configured for deployment to GitHub Pages. The production URL is set to:
```
https://releasesubleasing.live
```

To deploy:
1. Ensure all changes are committed
2. Run `npm run deploy`

## Development Guidelines

### Component Structure
- Use functional components with hooks
- Implement proper error handling
- Use TypeScript interfaces where applicable
- Follow the established folder structure

### Styling
- Use Tailwind CSS for styling
- Follow the established color scheme and design system
- Ensure responsive design for all components

### State Management
- Use React Context for global state
- Implement proper loading states
- Handle error states appropriately

## Contributing

1. Create a new branch
2. Make your changes
3. Submit a pull request

## License

[Your License Here]
