import { createRandomBag, shuffleArray } from './utils/random.js';
import { CARE_BEARS } from './constants/careBears.js';

// Const
const initialBears = shuffleArray(CARE_BEARS)
const getNextBear = createRandomBag(initialBears, (bear) => bear.name)
const selectedBear = getNextBear();
let isBookOpen = false;
let isLetterExtracted = false;

// functions
const getBearGradient = (bear) => {
    if (!bear || !bear.colors) return 'none'
    const hexList = bear.colors.map((c) => c.hex).join(', ')
    return `linear-gradient(135deg, ${hexList})`
}

// Toggle book state
function setBookState(open) {
    isBookOpen = open;
    if (isBookOpen) {
        book.classList.add('open');
    } else {
        book.classList.remove('open');
        isLetterExtracted = false;
        letterSlide.classList.remove('extracted');
    }
}

// Toggle letter state
function setLetterState(extracted) {
    isLetterExtracted = extracted;
    if (isLetterExtracted) {
        letterSlide.classList.add('extracted');
    } else {
        letterSlide.classList.remove('extracted');
    }
}


// ELements
const body = document.body;
const book = document.getElementById('book');
const scene = document.getElementById('scene');
const images = Array.from(scene.querySelectorAll('img'));
const loading = document.getElementById('loading');
const envelopeImg = document.getElementById('envelopeImg');
const letterSlide = document.getElementById('letterSlide');

//promise
const allImagesLoaded = images.map((img) => {
  return new Promise((resolve) => {
    // is already on cache
    if (img.complete) {
      resolve();
    } else {
      img.onload = () => resolve();
      img.onerror = () => resolve();
    }
  });
});

// Events
document.addEventListener('DOMContentLoaded', () => {
    // set background
    body.style.backgroundImage = getBearGradient(selectedBear);
    letterSlide.style.background = selectedBear.bgCard;
    loading.style.background = `${selectedBear.bgCard}90`;
    
    Promise.all(allImagesLoaded).then(() => {
        loading.classList.remove("flex");
        loading.classList.add("hidden");
        scene.classList.remove("hidden");
        scene.classList.add("flex");
    });
})

// Click on book / cover flips the card open/close
book.addEventListener('click', (e) => {
    // Prevent toggling book when clicking the envelope or letter directly
    if (e.target === envelopeImg || envelopeImg.contains(e.target)) return;
    if (letterSlide.contains(e.target)) {
        setLetterState(false);
        return;
    }

    setBookState(!isBookOpen);
});

// Click on envelope opens the letter inside right page
envelopeImg.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!isBookOpen) {
        setBookState(true);
    }
    setLetterState(!isLetterExtracted);
});

// Click outside closes the book
document.addEventListener('click', (e) => {
    if (!book.contains(e.target) && isBookOpen) {
        setBookState(false);
    }
});