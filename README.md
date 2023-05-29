<h1>Video Search Engine</h1>
This is a simple web application that allows users to search for videos on YouTube based on a search query. The application fetches data from the YouTube Data API to retrieve relevant video information such as title, thumbnail, channel, view count, and duration. The search results are displayed in a paginated format, with 10 videos per page.

<h3>Features</h3>
Search videos: Users can enter a search query in the input field to search for videos on YouTube.
Pagination: The search results are displayed in pages, and users can navigate between pages using the previous and next buttons.
Video preview: Clicking on a video in the search results opens a preview overlay with additional details about the video, including the video thumbnail, title, channel, view count, and buttons to visit the video on YouTube or close the preview.
<h3>Technologies Used</h3>
<ul>
  <li>HTML: The structure and layout of the web page are created using HTML.</li>
  <li>CSS: The styling and presentation of the web page are done using CSS.</li>
<li>JavaScript: The functionality of the web page, including fetching data from the YouTube API, handling user interactions, and dynamically updating the page, is implemented using JavaScript.</li>
<li>YouTube Data API: The YouTube Data API is used to fetch video data based on user search queries.</li>
  </ul>
<h3>Getting Started</h3>
To run the Video Search Engine application, follow these steps:

Clone the repository: git clone https://github.com/your-username/video-search-engine.git
Navigate to the project directory: cd video-search-engine
Open the index.html file in a web browser.
Enter a search query in the search input field and press Enter or wait for the debounce delay (300ms) to trigger the search.
Browse through the search results and click on a video to open the preview overlay.
In the preview overlay, you can click the "Visit" button to open the video on YouTube or click the "Close" button to close the preview.
Use the previous and next buttons to navigate between search result pages.
License
The Video Search Engine application is open source and available under the MIT License.

Acknowledgements
The Video Search Engine application uses the YouTube Data API to fetch video data.
