# SOHS Calendar Sync

A modern web application that allows South Oldham High School students, parents, and staff to sync all school events to their Google Calendar. Never miss important school activities, sports events, or deadlines again!

## Features

- 🔗 **Google Calendar Integration** - Seamlessly sync events to your Google Calendar
- 📅 **Comprehensive Event Coverage** - Fetches events from multiple sources:
  - District calendar events
  - School-specific events
  - Athletic events and schedules
  - Administrative announcements
- 🎯 **Smart Event Categorization** - Events are categorized as Academic, Athletic, Extracurricular, or Administrative
- ✅ **Selective Sync** - Choose which events to sync to your calendar
- 🔄 **Real-time Updates** - Automatic event fetching and sync status tracking
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- A Google Cloud Project with Calendar API enabled
- Google OAuth 2.0 credentials

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd calendar
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Google OAuth:**
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the Google Calendar API
   - Create OAuth 2.0 credentials:
     - Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
     - Set application type to "Web application"
     - Add authorized redirect URIs:
       - `http://localhost:3000/api/auth/google/callback` (for development)
       - `https://yourdomain.com/api/auth/google/callback` (for production)

4. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your Google OAuth credentials:
   ```env
   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_random_secret_here
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## How It Works

### Event Sources

The application automatically fetches events from multiple South Oldham High School sources:

1. **District Calendar** (`oldham.kyschools.us/view-all-events`)
   - District-wide events and holidays
   - Administrative announcements
   - School closure dates

2. **School Website** (`sohs.oldham.kyschools.us`)
   - School-specific academic events
   - Extracurricular activities
   - Parent-teacher conferences

3. **Athletics Website**
   - Sports schedules and games
   - Athletic events and tournaments
   - Team activities

### Event Categories

Events are automatically categorized for easy filtering:

- **Academic**: Classes, exams, academic events
- **Athletic**: Sports games, tournaments, athletic activities
- **Extracurricular**: Clubs, dances, non-academic activities
- **Administrative**: Holidays, closures, district announcements

### Sync Process

1. **Connect Google Calendar**: Authenticate with your Google account
2. **Browse Events**: View all upcoming school events with filtering options
3. **Select Events**: Choose which events you want to sync
4. **Sync to Calendar**: Events are automatically added to your Google Calendar with proper categorization and details

## Technical Details

### Built With

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Modern, responsive styling
- **Google Calendar API** - Calendar integration
- **Cheerio** - Web scraping for event data
- **date-fns** - Date manipulation and formatting

### API Routes

- `/api/scrape-events` - Fetches events from school sources
- `/api/auth/google` - Google OAuth authentication
- `/api/auth/google/callback` - OAuth callback handler
- `/api/auth/status` - Check authentication status
- `/api/sync-calendar` - Sync selected events to Google Calendar

### Event Data Structure

Events include the following information:
- Title and description
- Date and time
- Location
- Category (academic, athletic, etc.)
- Source (district, school, athletics)
- Sync status

## Deployment

### Vercel (Recommended)

1. Push your code to a Git repository
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Update Google OAuth redirect URIs to include your production domain
5. Deploy!

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Heroku
- DigitalOcean App Platform

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

### Development Guidelines

1. Follow TypeScript best practices
2. Use Tailwind CSS for styling
3. Ensure responsive design
4. Add proper error handling
5. Include JSDoc comments for complex functions

## Privacy & Security

- User authentication is handled securely through Google OAuth 2.0
- Access tokens are stored in HTTP-only cookies
- No sensitive school data is stored permanently
- Events are fetched from public school websites only

## Support

For questions or issues:
1. Check the GitHub Issues page
2. Review the troubleshooting section below
3. Contact the development team

## Troubleshooting

### Common Issues

**"No events found"**
- Check if school websites are accessible
- Verify event scraping logic is working
- Try refreshing events

**"Authentication failed"**
- Verify Google OAuth credentials
- Check redirect URIs match exactly
- Ensure Calendar API is enabled

**"Sync failed"**
- Check Google Calendar permissions
- Verify access token is valid
- Try disconnecting and reconnecting Google account

## License

This project is built for educational purposes to serve the South Oldham High School community.

---

Built with ❤️ for the South Oldham High School community