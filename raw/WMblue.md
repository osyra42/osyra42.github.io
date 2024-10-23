# Generic Process for Developing an Overlay App on Android Studio

## Overview

This document outlines a generic process for developing an Android overlay application using Android Studio. The app will overlay on top of a specific target app, capture specific data (e.g., UPC numbers) by reading the screen, and store this data in a local database. After capturing the UPC number, a prompt will appear at the top of the screen asking if the parcel was used or not. This information will also be stored in the database. Each scan will check for this input, and if found, the screen will display a green border if the parcel is used (true) and a red border if the parcel is not used (false). If no input is found, no border will be displayed.

## Technologies Used

- **Android Studio**: The official Integrated Development Environment (IDE) for Android app development.
- **Java/Kotlin**: Programming languages for Android app development.
- **SQLite**: A lightweight, disk-based database for local storage.
- **Android Overlay Service**: For creating an overlay on top of another app.
- **Permissions**: For managing necessary permissions required for overlay functionality.

## Features

- **Overlay Functionality**: The app will overlay on top of a specific target app.
- **Screen Reading**: The app will read the screen to capture specific data (e.g., UPC numbers).
- **Local Storage**: The app will store captured data in a local SQLite database.
- **User Interface**: A simple UI to display the history of captured data.
- **Prompt for Parcel Usage**: A prompt will ask if the parcel was used or not.
- **Border Display**: The screen will display a green border if the parcel is used (true) and a red border if the parcel is not used (false).

## Setup and Installation

### Prerequisites

- Android Studio
- Java/Kotlin Development Kit (JDK)
- Android SDK

### Steps

1. **Install Android Studio**: Download and install Android Studio from the official website.

2. **Create a New Project**:
   - Open Android Studio.
   - Select "New Project".
   - Choose "Empty Activity" and click "Next".
   - Name your project (e.g., "OverlayApp").
   - Select the language (Java/Kotlin).
   - Click "Finish".

3. **Set Up Dependencies**:
   - Open `build.gradle` (Module: app) file.
   - Add necessary dependencies for SQLite and other required libraries.

   ```gradle
   dependencies {
       implementation 'androidx.appcompat:appcompat:1.3.1'
       implementation 'com.google.android.material:material:1.4.0'
       implementation 'androidx.constraintlayout:constraintlayout:2.1.0'
       implementation 'androidx.sqlite:sqlite:2.1.0'
       // Add other necessary dependencies
   }
   ```

4. **Project Structure**:

   ```
   overlay_app/
   │
   ├── app/
   │   ├── src/
   │   │   ├── main/
   │   │   │   ├── java/
   │   │   │   │   ├── com/
   │   │   │   │   │   ├── overlayapp/
   │   │   │   │   │   │   ├── MainActivity.java/kt
   │   │   │   │   │   │   ├── OverlayService.java/kt
   │   │   │   │   │   │   ├── ScreenReaderService.java/kt
   │   │   │   │   │   │   ├── DatabaseHelper.java/kt
   │   │   │   │   │   │   ├── PromptDialog.java/kt
   │   │   │   │   │   │   └── ...
   │   │   │   ├── res/
   │   │   │   │   ├── layout/
   │   │   │   │   │   ├── activity_main.xml
   │   │   │   │   │   ├── overlay_layout.xml
   │   │   │   │   │   └── ...
   │   │   │   └── AndroidManifest.xml
   │   └── build.gradle
   └── build.gradle
   ```

5. **Implementation Details**:

   1. **Overlay Functionality**:
      - **Permissions**: Request necessary permissions in `AndroidManifest.xml`.

        ```xml
        <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW"/>
        <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
        <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
        ```

      - **Overlay Service**: Implement the overlay logic in `OverlayService.java/kt`.

   2. **Screen Reading**:
      - **Screen Reader Service**: Implement the screen reading logic in `ScreenReaderService.java/kt`.
      - **Capture Method**: Use methods to capture and read the screen to find the UPC numbers.

   3. **Local Storage**:
      - **Database Helper**: Implement database operations in `DatabaseHelper.java/kt`.
      - **Database Operations**: Use SQLite for local storage.

   4. **User Interface**:
      - **Layouts**: Design UI layouts in `res/layout/`.
      - **Activities**: Implement activities for different screens (e.g., `MainActivity.java/kt`).

   5. **Prompt for Parcel Usage**:
      - **Prompt Dialog**: Implement a dialog to ask if the parcel was used or not in `PromptDialog.java/kt`.
      - **Store Response**: Store the response in the database.

   6. **Border Display**:
      - **Check Database**: After each scan, check the database for the parcel usage status.
      - **Set Border Color**: Set the border color based on the parcel usage status (green for true, red for false).

6. **Running the App**:
   - **Start the App**: Run the app on an Android device or emulator.
   - **Test Overlay**: Ensure the overlay functionality works as expected.

## Conclusion

This generic process provides a framework for developing an Android overlay app using Android Studio. By following these steps, you can create an app that overlays on a specific target app, captures specific data by reading the screen, stores it locally, and provides a prompt for parcel usage, offering a seamless user experience on Android devices.