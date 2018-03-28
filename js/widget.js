var showArticles = function() {
	var articlesContainer = document.querySelector('.articles');
	var articlesTemplate = document.querySelector('.articles-container');
	var articlesFragment = document.createDocumentFragment();
	
	var data = {
		rss_url: 'https://medium.com/feed/@botgaming'
	};

	$.get('https://api.rss2json.com/v1/api.json', data, function (response) {
		response.items.slice(0,3).forEach(function(item, index) {
			var newArticleElement = articlesTemplate.children[0].cloneNode(true);
	
			var tagIndex = item.description.indexOf('<img'); // Find where the img tag starts
			var srcIndex = item.description.substring(tagIndex).indexOf('src=') + tagIndex; // Find where the src attribute starts
			var srcStart = srcIndex + 5; // Find where the actual image URL starts; 5 for the length of 'src="'
			var srcEnd = item.description.substring(srcStart).indexOf('"') + srcStart; // Find where the URL ends
			var src = item.description.substring(srcStart, srcEnd); // Extract just the URL
	
			newArticleElement.querySelector('.blog__img').setAttribute('src', src)
			newArticleElement.querySelector('.blog__link').setAttribute('href', item.link)
			newArticleElement.querySelector('.blog__link').textContent = item.title;

			var date = new Date(item.pubDate);
			var months = Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
			var fullDate = date.getDate() + " " + months[date.getMonth()] + ", " + date.getFullYear()


			newArticleElement.querySelector('.blog__date').textContent = fullDate;
	
			var yourString = item.description.replace(/<[^>]*>/g,""); //replace with your string.
			var maxLength = 120 // maximum number of characters to extract
			//trim the string to the maximum length
			var trimmedString = yourString.substr(0, maxLength);
			//re-trim if we are in the middle of a word
			trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")))
	
			newArticleElement.querySelector('.blog__text').textContent = trimmedString + '...';		
			newArticleElement.querySelector('.btn_more').setAttribute('href', item.link)
			
			articlesFragment.appendChild(newArticleElement); 
			
		})
		articlesContainer.appendChild(articlesFragment);
	});
};

showArticles();