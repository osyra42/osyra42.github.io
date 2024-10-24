# JS Local Storage Password Manager

## Overview

This project is a JavaScript-based password manager that utilizes local storage for data persistence. It includes features for managing passwords, enabling/disabling a master password, categorizing passwords, and customizing the interface with themes and icons.

## Features

### 1. **Local Storage**

- **Data Persistence**: All user data is stored locally in the browser's local storage.
- **Export/Import**: Users can export their data as a `.zip` file with a `.QL7` extension and import it back into the application.

### 2. **Password Management**

- **New Password Form**: A form for users to add new passwords.
- **Master Password**: Users can enable or disable a master password to secure their data.

### 3. **Categories**

- **Categorization**: Passwords can be organized into different categories for easier management.

### 4. **Icons**

- **Icon Support**: Icons are allowed for categories and other elements.
- **Icon Size**: All icons are resized to a maximum of 256px.
- **Icon Editing**: Users can crop, zoom, and add shadows to icons, with automatic handling of cutoff areas.
- **Icon Format**: All icons are saved as 256px PNG files.

### 5. **Export/Import**

- **Export**: Data can be exported as a `.zip` file with a `.QL7` extension.
- **Import**: The application looks for `.QL7` files during import.

### 6. **User Interface**

- **Desktop Style Icons**: Icons are styled to resemble desktop icons.
- **Theme Customization**: Users can customize the application's theme.
- **Default Theme**: The default theme is a dark neon pastel.

### 7. **Icon Packs**

- **Icon Packs**: The application may include or allow users to include icon packs for additional customization.

## Usage

### Adding a New Password

1. Navigate to the "New Password" form.
2. Enter the required details (e.g., website, username, password).
3. Optionally, assign a category and add an icon.
4. Save the new password.

### Managing Categories

1. Create new categories to organize your passwords.
2. Assign icons to categories for easy identification.

### Customizing Icons

1. Upload an icon for a category or password.
2. Use the built-in tools to crop, zoom, and add shadows.
3. Save the edited icon.

### Exporting Data

1. Go to the "Export" section.
2. Click "Export" to download a `.zip` file with a `.QL7` extension.

### Importing Data

1. Go to the "Import" section.
2. Upload a `.QL7` file.
3. Click "Import" to load your data.

### Customizing Themes

1. Navigate to the "Theme" settings.
2. Choose from available themes or customize your own.
3. Apply the new theme.

## Installation

No installation is required as this is a browser-based application. Simply open the HTML file in your browser to start using the password manager.

## Contributing

Feel free to contribute to this project by submitting pull requests or reporting issues.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

---

**Note**: This application stores data locally and does not sync across devices. Ensure you regularly export your data to avoid loss.
