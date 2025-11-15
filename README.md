# Budget Planner Application

A modern, responsive budget planner application that helps you manage your finances effectively. Track income from multiple sources and monitor spending across various categories.

## Features

- **Multi-Person Income Setup**: Configure income from multiple people in your household
- **Comprehensive Budget Categories**: 
  - Housing
  - Utilities
  - Food & Groceries
  - Transportation
  - Insurance
  - Healthcare
  - Entertainment
  - Shopping
  - Education
  - Savings
  - Debt Payments
  - Other Expenses

- **Interactive Dashboard**: 
  - Visual overview of income, budgeted, and spent amounts
  - Category-wise breakdown with progress indicators
  - Status badges (Under Budget, On Track, Over Budget)
  - Budget utilization tracking

- **Data Persistence**: All data is saved to localStorage for easy access

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository or navigate to the project directory
2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Building for Production

To create a production build:

```bash
npm run build
```

This creates an optimized build in the `build` folder.

## Deployment to Netlify

### Option 1: Deploy via Netlify CLI

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Build the project:
```bash
npm run build
```

3. Deploy:
```bash
netlify deploy --prod
```

### Option 2: Deploy via Netlify Dashboard

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [Netlify](https://www.netlify.com)
3. Click "New site from Git"
4. Connect your repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
6. Click "Deploy site"

The `netlify.toml` file is already configured for automatic deployment.

## Usage

1. **Set Up Income**: Enter the number of people contributing to household income and their individual monthly incomes
2. **Configure Budget**: Allocate your income across different expense categories by setting budgeted and spent amounts
3. **View Dashboard**: Monitor your financial health with visual indicators and category breakdowns
4. **Edit Anytime**: Click "Edit Budget" to update your financial information

## Technologies Used

- React 18
- CSS3 (with modern features like Grid and Flexbox)
- LocalStorage API for data persistence

## License

This project is open source and available for personal use.

