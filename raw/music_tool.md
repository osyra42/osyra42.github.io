# Music Downloader App

## Overview
This app allows users to search for songs by title and artist, select a song from the search results, and save it as an MP3 file with metadata including title, artist, year, and album art. The saved file will be named in the format `title ~ artist (year).mp3`.

## Features
1. **Search Functionality**: Users can type in a song title and artist to search for the song.
2. **Search Results**: The app displays a few options from the search results.
3. **Selection and Download**: Users can select a song from the options and download it as an MP3 file.
4. **Metadata**: The downloaded MP3 file includes metadata such as title, artist, year, and album art.
5. **File Naming**: The saved file is named in the format `title ~ artist (year).mp3`.

## Technologies Used
- **Python**: For backend logic and handling file operations.
- **Flask/Django**: For web framework (optional, depending on the user interface).
- **Requests**: For making HTTP requests to music databases or APIs.
- **Mutagen**: For handling MP3 metadata.
- **Pillow**: For handling and resizing album art.

## Setup and Installation

### Prerequisites
- Python 3.x
- Flask or Django (optional)
- Requests
- Mutagen
- Pillow

### Steps
1. **Install Python**: Ensure Python 3.x is installed on your system.
2. **Install Required Libraries**:
   ```bash
   pip install flask requests mutagen pillow

music_downloader/
│
├── main.py            # Main application file
├── templates/         # HTML templates (if using Flask/Django)
│   └── index.html
├── static/            # Static files (CSS, JS, images)
│   └── style.css
├── requirements.txt   # List of dependencies
└── README.md          # Project documentation