import { sendHttpRequest } from './util.js';

const URL =
	'https://gist.githubusercontent.com/al3xback/f652babaaf6e8170560976dace32b89a/raw/5165f39dad0d7fbe64b97f35fd22f01ecc1602df/article-preview-data.txt';

const cardWrapperEl = document.querySelector('.card-wrapper');
const cardTemplate = document.getElementById('card-template');
const cardImageTemplate = document.getElementById('card-image-template');
const cardShareButtonTemplate = document.getElementById(
	'card-share-button-template'
);
const cardContentTemplate = document.getElementById('card-content-template');
const loadingEl = document.querySelector('.loading');

const removeLoading = () => {
	loadingEl.parentElement.removeChild(loadingEl);
};

const handleError = (msg) => {
	removeLoading();

	const errorEl = document.createElement('p');
	errorEl.className = 'error';
	errorEl.textContent = msg;

	cardWrapperEl.appendChild(errorEl);
};

const renderCardContent = (data) => {
	const [title, description, image, authorInfo, ...socialLinks] =
		data.split('\n');
	const [authorName, authorImage, authorPostDate] = authorInfo.split(' | ');
	const transformedSocialLinks = socialLinks
		.filter((link) => Boolean(link))
		.map((link) => link.split(': '));

	const cardTemplateNode = document.importNode(cardTemplate.content, true);
	const cardEl = cardTemplateNode.querySelector('.card');

	/* [card image] */
	const cardImageTemplateNode = document.importNode(
		cardImageTemplate.content,
		true
	);
	const cardImageEl = cardImageTemplateNode.querySelector('.card__image img');
	cardImageEl.src = './images/' + image;
	cardImageEl.alt = image.substring(0, image.indexOf('.'));

	/* [card content] */
	const cardContentTemplateNode = document.importNode(
		cardContentTemplate.content,
		true
	);
	const cardContentEl =
		cardContentTemplateNode.querySelector('.card__content');

	const cardTitleEl = cardContentEl.querySelector('.card__title');
	cardTitleEl.textContent = title;

	const cardDescEl = cardContentEl.querySelector('.card__desc');
	cardDescEl.textContent = description;

	const cardAuthorImageEl = cardContentEl.querySelector('.card__author-img');
	cardAuthorImageEl.src = './images/' + authorImage;
	cardAuthorImageEl.alt = authorName;

	const cardAuthorNameEl = cardContentEl.querySelector('.card__author-name');
	cardAuthorNameEl.textContent = authorName;

	const cardAuthorPostDateEl = cardContentEl.querySelector(
		'.card__author-post-date'
	);
	cardAuthorPostDateEl.textContent = authorPostDate;

	const cardShareButtonsEl = cardContentEl.querySelector(
		'.card__share-action-buttons'
	);

	for (const socialLink of transformedSocialLinks) {
		const [name, url] = socialLink;

		const cardShareButtonTemplateNode = document.importNode(
			cardShareButtonTemplate.content,
			true
		);
		const cardShareButtonEl =
			cardShareButtonTemplateNode.querySelector('a');
		cardShareButtonEl.href = url;
		cardShareButtonEl.title = 'Share on ' + name.toLowerCase();

		const cardShareButtonIconEl = cardShareButtonEl.querySelector('i');
		cardShareButtonIconEl.className = 'icon-' + name.toLowerCase();

		cardShareButtonsEl.appendChild(cardShareButtonTemplateNode);
	}

	/* [init] */
	removeLoading();
	cardEl.appendChild(cardImageTemplateNode);
	cardEl.appendChild(cardContentTemplateNode);
	cardWrapperEl.appendChild(cardTemplateNode);
};

sendHttpRequest('GET', URL, renderCardContent, handleError);
