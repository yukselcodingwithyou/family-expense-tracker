# Family Expense Tracker

This repository contains a cross‑platform mobile application for tracking
household expenses. The app is built with [React Native](https://reactnative.dev/)
and uses Firebase for authentication and data storage. It allows users to:

* Create an account or sign in with email/password.
* Add expenses with an amount, category and optional description.
* View a realtime list of expenses belonging to the signed‑in user.
* Sign out of the application.

The application uses the following libraries:

* **@react‑navigation/native** and **@react‑navigation/native‑stack** for
  navigation.
* **@react‑native‑firebase/app**, **auth** and **firestore** for Firebase
  integration. Firestore provides realtime updates so multiple users can see
  changes instantly.

## Getting Started

1. Install Expo CLI globally if you haven’t already:

   ```sh
   npm install -g expo-cli
   ```

2. Clone this repository and install dependencies:

   ```sh
   git clone https://github.com/yourusername/family-expense-tracker.git
   cd family-expense-tracker
   npm install
   ```

3. Configure Firebase:

   * Create a new Firebase project at <https://console.firebase.google.com/>.
   * Enable **Email/Password** authentication.
   * Create a **Firestore** database in production mode.
   * Download the Firebase configuration files and place them in the native
     projects (`google-services.json` for Android, `GoogleService-Info.plist` for
     iOS) according to the [React Native Firebase installation
     docs](https://rnfirebase.io/).

4. Start the development server:

   ```sh
   npm start
   ```

   Use the prompts to run the app on iOS or Android emulators/devices.

5. Build production apps and publish them using the Expo EAS workflow or
   standard React Native build tools.

## Notes

* The current implementation stores expenses per user. Extending the data model
  to support multiple members in a family (e.g. grouping users by `familyId` in
  Firestore) and aggregating expenses across members is recommended for
  production use.
* Push notifications, receipt scanning, multi‑currency support and other
  advanced features can be added by extending the components and integrating
  additional Firebase services or third‑party APIs.
