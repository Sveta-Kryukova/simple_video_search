let currentPage = 1;
var videosPerPage = 10;
var totalVideos = 0;
var videosData = [];

function debounce(func, delay) {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

document.getElementById('search-input').addEventListener('input', debounce(function() {
  var searchQuery = document.getElementById('search-input').value;
  if (searchQuery.length > 0) {
    document.getElementById('next-button').disabled = false;
    document.querySelector('.navigation-container').style.display = 'block';
  } else {
    document.getElementById('next-button').disabled = true;
  }
  searchVideos(searchQuery);
}, 300));

document.getElementById('prev-button').addEventListener('click', function() {
  if (currentPage > 1) {
    currentPage--;
    displayVideos();
  }
});

document.getElementById('next-button').addEventListener('click', function() {
  var totalPages = Math.ceil(totalVideos / videosPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    displayVideos();
  }
});

document.querySelector('.navigation-container').style.display = 'none';

function searchVideos(query) {
  var apiKey = 'AIzaSyCIDWuR611S6xBzXeK2rwEnHmyx_DXBbYU';
  var url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&maxResults=50&type=video&key=${apiKey}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      var videoIds = data.items.map(item => item.id.videoId);
      var statisticsUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds.join(',')}&key=${apiKey}`;
      var contentDetailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds.join(',')}&key=${apiKey}`;

      Promise.all([fetch(statisticsUrl).then(response => response.json()), fetch(contentDetailsUrl).then(response => response.json())])
        .then(responses => {
          var statisticsData = responses[0];
          var contentDetailsData = responses[1];

          var videos = data.items.map((item, index) => {
            var statisticsItem = statisticsData.items[index];
            var contentDetailsItem = contentDetailsData.items[index];
            var duration = parseDuration(contentDetailsItem.contentDetails.duration);

            return {
              title: item.snippet.title,
              url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
              thumbnail: item.snippet.thumbnails.default.url,
              category: 'music',
              viewCount: statisticsItem.statistics.viewCount,
              channelTitle: item.snippet.channelTitle,
              duration: duration
            };
          });

          var filteredVideos = videos.filter(function(video) {
            return video.category === 'music';
          });

          var sortedVideos = filteredVideos.sort(function(a, b) {
            return b.viewCount - a.viewCount;
          });

          videosData = sortedVideos;
          totalVideos = sortedVideos.length;
          currentPage = 1;

          displayVideos();
        })
        .catch(error => {
          console.log('Error:', error);
        });
    })
    .catch(error => {
      console.log('Error:', error);
    });
}

function parseDuration(duration) {
  var match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

  var hours = parseInt(match[1]) || 0;
  var minutes = parseInt(match[2]) || 0;
  var seconds = parseInt(match[3]) || 0;

  var formattedDuration = '';

  if (hours > 0) {
    formattedDuration += `${hours}:`;
  }

  formattedDuration += `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return formattedDuration;
}

function displayVideos() {
  var resultsContainer = document.getElementById('results-container');
  resultsContainer.innerHTML = '';

  var start = (currentPage - 1) * videosPerPage;
  var end = start + videosPerPage;
  var videosToDisplay = videosData.slice(start, end);
  var pageInfoElement = document.getElementById('page-info');
  pageInfoElement.textContent = currentPage;
  var totalPages = Math.ceil(totalVideos / videosPerPage);
  
  if (currentPage > 1) {
    pageInfoElement.textContent = currentPage;
    pageInfoElement.style.display = 'block';
  } else {
    pageInfoElement.style.display = 'none';
  }

  videosToDisplay.forEach(function(video) {
    var videoElement = document.createElement('div');
    videoElement.classList.add('video-item');

    var thumbnailElement = document.createElement('img');
    thumbnailElement.src = video.thumbnail;
    thumbnailElement.alt = video.title;
    thumbnailElement.classList.add('video-thumbnail');

    var videoDetailsElement = document.createElement('div');
    videoDetailsElement.classList.add('video-details');

    var titleElement = document.createElement('h3');
    var truncatedTitle = video.title.length > 45 ? video.title.slice(0, 42) + '...' : video.title;
    titleElement.textContent = truncatedTitle;
    titleElement.classList.add('video-title');

    var channelElement = document.createElement('p');
    channelElement.textContent = video.channelTitle;
    channelElement.classList.add('video-group');

    var youtubeBlock = document.createElement('div');
    youtubeBlock.classList.add('youtube-block');

    var youtubeLogoElement = document.createElement('img');
    youtubeLogoElement.src = './images/youtube.png';
    youtubeLogoElement.alt = 'YouTube Logo';
    youtubeLogoElement.classList.add('youtube-logo');

    var youtubeTextElement = document.createElement('p');
    youtubeTextElement.textContent = 'YouTube.com';
    youtubeTextElement.classList.add('youtube-text');

    youtubeBlock.appendChild(youtubeLogoElement);
    youtubeBlock.appendChild(youtubeTextElement);

    youtubeBlock.appendChild(youtubeLogoElement);
    youtubeBlock.appendChild(youtubeTextElement);

    var viewCountElement = document.createElement('p');
    viewCountElement.textContent = formatViewCount(video.viewCount);
    viewCountElement.classList.add('video-view-count');

    var detailsBlock = document.createElement('div');
    detailsBlock.classList.add('video-details-block');
    detailsBlock.appendChild(youtubeBlock);
    detailsBlock.appendChild(viewCountElement);

    var durationElement = document.createElement('p');
    durationElement.textContent = video.duration;
    durationElement.classList.add('video-duration');

    videoElement.appendChild(thumbnailElement);
    videoElement.appendChild(durationElement);
    videoDetailsElement.appendChild(durationElement);
    videoDetailsElement.appendChild(titleElement);
    videoDetailsElement.appendChild(channelElement);
    videoDetailsElement.appendChild(detailsBlock);
    videoElement.appendChild(videoDetailsElement);
    resultsContainer.appendChild(videoElement);

    videoElement.addEventListener('click', function() {
      openPreviewOverlay(video);
    });
  });
  var currentPageInfo = document.getElementById('current-page-info');

  updateNavigationButtons();
  document.querySelector('.navigation-container').style.display = 'block';
}

function updateNavigationButtons() {
  var prevButton = document.getElementById('prev-button');
  var nextButton = document.getElementById('next-button');
  var totalPages = Math.ceil(totalVideos / videosPerPage);
  var buttonContainer = document.getElementById('button-container');

  if (currentPage === 1) {
    prevButton.style.display = 'none';
    currentPageInfo.style.display = 'none';
    buttonContainer.style.display = 'block';
  } else if (currentPage === totalPages) {
    prevButton.style.display = 'inline-block';
    nextButton.style.display = 'none';
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'space-evenly';
  } else {
    prevButton.style.display = 'inline-block';
    nextButton.style.display = 'inline-block';
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'space-evenly';
  }

  prevButton.disabled = (currentPage === 1);
  nextButton.disabled = (currentPage === totalPages);
}

function formatViewCount(count) {
  if (count >= 1e12) {
    return (count / 1e12).toFixed(0).replace(/\.0$/, '') + 'T views';
  } else if (count >= 1e9) {
    return (count / 1e9).toFixed(0).replace(/\.0$/, '') + 'B views';
  } else if (count >= 1e6) {
    return (count / 1e6).toFixed(0).replace(/\.0$/, '') + 'M views';
  } else if (count >= 1e3) {
    return (count / 1e3).toFixed(0).replace(/\.0$/, '') + 'K views';
  } else {
    return count.toString() + ' views';
  }
}

function openPreviewOverlay(video) {
  var previewOverlay = document.getElementById('preview-overlay');
  var previewContent = document.createElement('div');
  previewContent.classList.add('preview-content');

  var videoPreview = document.createElement('div');
  videoPreview.classList.add('video-preview');
  videoPreview.style.width = '360px';
  videoPreview.style.height = '277px';
  videoPreview.style.backgroundImage = `url('${video.thumbnail}')`;
  videoPreview.style.backgroundSize = 'cover';
  videoPreview.style.backgroundPosition = 'center';
  videoPreview.style.marginBottom = '20px';

  var youtubeLogoElement = document.createElement('div');
youtubeLogoElement.classList.add('preview-youtube-logo');

// var youtubeLogoImage = document.createElement('img');
// youtubeLogoImage.src = './images/youtube-logo.png';
// youtubeLogoImage.alt = 'YouTube Logo';

// youtubeLogoElement.appendChild(youtubeLogoImage);

  var previewTitle = document.createElement('div');
  previewTitle.classList.add('preview-title');
  previewTitle.textContent = video.title;

  var previewDetails = document.createElement('div');
  previewDetails.classList.add('preview-details');

  var youtubeLogo = document.createElement('div');
  youtubeLogo.classList.add('preview-logo');

  var channelName = document.createElement('div');
  channelName.classList.add('preview-channel');
  channelName.textContent = video.channelTitle;

  var dot = document.createElement('div');
  dot.classList.add('preview-dot');
  dot.style.borderRadius = '50%';
  dot.style.marginRight = '11px';

  var viewCount = document.createElement('div');
  viewCount.classList.add('preview-view-count');
  var dotContainer = document.createElement('div');
dotContainer.classList.add('dot-container');

for (var i = 0; i < 3; i++) {
  var dotElement = document.createElement('div');
  dotElement.classList.add('dot');
  dotElement.style.width = '4px';
  dotElement.style.height = '4px';
  dotElement.style.borderRadius = '50%';
  dotElement.style.backgroundColor = '#FFFFFF';
  dotContainer.appendChild(dotElement);
}
  viewCount.textContent = formatViewCount(video.viewCount);

  previewDetails.appendChild(youtubeLogo);
  previewDetails.appendChild(channelName);
  previewDetails.appendChild(dot);
  previewDetails.appendChild(viewCount);
  previewDetails.appendChild(dotContainer);

  var previewButtons = document.createElement('div');
  previewButtons.classList.add('preview-buttons');

  var visitButton = document.createElement('button');
  visitButton.textContent = 'Visit';
  visitButton.style.width = '80px';
  visitButton.style.height = '34px';
  visitButton.style.background = '#2A8CFF';
  visitButton.style.borderRadius = '20px';
  visitButton.style.color = '#fff';
  visitButton.addEventListener('click', function() {
    window.open(video.url, '_blank');
    closePreviewOverlay();
  });

  var closeButton = document.createElement('button');
  closeButton.textContent = 'Close';
  closeButton.style.width = '87px';
  closeButton.style.height = '34px';
  closeButton.style.background = '#5D6067';
  closeButton.style.borderRadius = '20px';
  closeButton.style.color = '#fff';

  closeButton.addEventListener('click', function() {
    closePreviewOverlay();
  });

  previewButtons.appendChild(visitButton);
  previewButtons.appendChild(closeButton);
  previewContent.appendChild(youtubeLogoElement);
  previewContent.appendChild(videoPreview);
  previewContent.appendChild(dotContainer);;
  previewContent.appendChild(previewTitle);
  previewContent.appendChild(previewDetails);
  previewContent.appendChild(previewButtons);
  previewOverlay.appendChild(previewContent);

  previewOverlay.style.display = 'flex';
}

function closePreviewOverlay() {
  var previewOverlay = document.getElementById('preview-overlay');
  var previewContent = document.querySelector('.preview-content');

  previewOverlay.style.display = 'none';
  previewContent.remove();
}
