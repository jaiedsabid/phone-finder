/* Globals */
let loadMoreBtnState = false;
let phonesArray = [];

/* API URLs */
const searchAPI = `https://openapi.programming-hero.com/api/phones?search=`;
const detailsAPI = `https://openapi.programming-hero.com/api/phone/`;

/* Search Section */
const searchBarInput = document.getElementById('search-input');
const searchBarBtn = document.getElementById('search-btn');
const searchBarBtnSpinner = document.getElementById('search-spinner');

/* Phones Grid */
const phonesGrid = document.getElementById('phones-grid');

/* Load-more Section */
const loadMoreBtn = document.getElementById('load-more-btn');
const loadMoreBtnSpinner = document.getElementById('load-more-spinner');

/* Slider */
const slider = document.getElementById('slider');
const toggleSliderBtn = document.getElementById('toggle-slider-btn');

/* Slider Displays */
const sliderTitle = document.getElementById('slider-title');
const phoneImage = document.getElementById('phone-image');
const phoneBrand = document.getElementById('phone-brand');
const phoneReleaseDate = document.getElementById('release-date');
const phoneStorage = document.getElementById('storage');
const phoneDisplaySize = document.getElementById('display-size');
const phoneChipset = document.getElementById('chipset');
const phoneMemory = document.getElementById('memory');
const phoneSensors = document.getElementById('sensors');
const otherFeatures = document.getElementById('other-features');

/* Functions */

/* Toggle search spinner */
const toggleSearchSpinner = () => {
    searchBarBtnSpinner.classList.toggle('hidden');
}

/* Toggle load more spinner */
const toggleLoadMoreSpinner = () => {
    loadMoreBtnSpinner.classList.toggle('hidden');
}

/* Toggle load more button */
const toggleLoadMoreBtn = () => {
    loadMoreBtn.classList.toggle('hidden');
}

/* Toggle slider */
const toggleSlider = () => {
    if ( slider.classList.contains('slide-enter') ) {
        slider.classList.remove('slide-enter');
        slider.classList.add('slide-leave');
    } else {
        slider.classList.remove('slide-leave');
        slider.classList.add('slide-enter');
    }
}

/* Reset toggle button state */
const resetPhoneAndLoadMoreState = () => {
    phonesArray = [];
    loadMoreBtnState = false;
    loadMoreBtn.classList.add('hidden');
}

/* Reset search bar input value */
const resetSearchBarInputValue = () => {
    searchBarInput.value = '';
}

/* Generate random price */
const generateRandomPrice = () => {
    return Math.floor(Math.random() * 2000) + 100;
}

/* Reset Grid */
const resetPhonesGrid = () => {
    phonesGrid.innerHTML = '';
}

/* On clock load more button */
const onClickLoadMore = () => {
    toggleLoadMoreSpinner();
    displayPhonesByCondition();
    toggleLoadMoreSpinner();
}

/* Search and generate result */
const search = async () => {
    try {
        const searchTerm = searchBarInput.value;

        // Return if search term is empty
        if ( ! searchTerm.length ) {
            return;
        }

        toggleSearchSpinner();
        resetPhonesGrid();
        resetPhoneAndLoadMoreState();

        const response = await fetch(searchAPI + searchTerm);
        const phones = await response.json();
        
        if (!!phones.status) {
            phonesArray = await phones.data;
            
            if (phonesArray.length === 0) {
                // Render No items found message
                phonesGrid.insertAdjacentHTML('beforeend', noItemFoundMessageGenerator());
            } else {
                // Render phones by condition
                await displayPhonesByCondition();
            }
        } else {
            // Render No items found message
            phonesGrid.insertAdjacentHTML('beforeend', noItemFoundMessageGenerator());
        }

        toggleSearchSpinner();
        resetSearchBarInputValue();

    } catch (error) {
        console.error(error);
    }
}

/* No result found message HTML generator */
const noItemFoundMessageGenerator = () => {
    return (`
        <div></div>
        <div>
            <h3 class="text-center text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
                No Result found</h3>
            <p class="mt-2 text-center text-sm sm:text-base text-slate-400 tracking-tight">Please search with
                relevant
                keyword</p>
        </div>
        <div></div>
    `);
}

/* Phone card HTML Generator */
const phoneItemHTMLGenerator = (phone) => {
    const {brand, phone_name, slug, image} = phone;

    return (`
        <div
            class="group relative bg-gray-50 rounded-md shadow-md hover:shadow-lg hover:-translate-y-1 transition duration-300 ease-in-out">
            <div
                class="rounded-t-md w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none transition duration-300 ease-in-out">
                <img src="${image}"
                    alt="${phone_name}"
                    class="w-full h-full object-center object-contain rounded-t-md lg:w-full lg:h-full">
            </div>
            <div class="h-20 flex justify-between px-6 pt-3 pb-4 group-hover:invisible">
                <div>
                    <h3 class="text-md font-semibold text-gray-700">
                        <div>
                            <span aria-hidden="true" class="absolute inset-0"></span>
                            ${phone_name}
                        </div>
                    </h3>
                    <p class="mt-1 text-md text-gray-500">${brand}</p>
                </div>
                <p class="text-md font-medium text-gray-900">$${generateRandomPrice()}</p>
            </div>
            <div
                class="absolute bottom-2 right-0 left-0 mt-4 h-16 flex justify-center p-2 invisible group-hover:visible">
                <button id="${slug}" type="button" onclick="renderFeatures('${slug}')"
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition duration-200 ease-in-out">View
                    Details</button>
            </div>
        </div>
    `);
}

/* Render phones by conditions */
const displayPhonesByCondition = () => {
    const loadMore = phonesArray.length > 20;

    if (phonesArray.length > 20) {
        if ( loadMore && !loadMoreBtnState ) {
            renderPhones(phonesArray.slice(0, 20));
            toggleLoadMoreBtn();
            loadMoreBtnState = true;
        } else {
            renderPhones(phonesArray.slice(20));
            toggleLoadMoreBtn();
            phonesArray = [];
            loadMoreBtnState = false; 
        }
    } else {
        renderPhones(phonesArray);
        phonesArray = [];
    }
}

/* Render phone card */
const renderPhones = (phones) => {
    phones.forEach((phone) => {
        phonesGrid.insertAdjacentHTML('beforeend', phoneItemHTMLGenerator(phone));
    });
}

/* Render phone specifications */
const renderFeatures = async (slug) => {
    try {
        const response = await fetch(detailsAPI + slug);
        const features = await response.json();

        if (!!features.status) {
            const {mainFeatures, name, releaseDate, brand, image, others} = features.data;

            // Set basic info
            sliderTitle.innerText = name;
            phoneImage.src = image;
            phoneBrand.innerText = brand;
            phoneReleaseDate.innerText = releaseDate || 'N/A';

            // Set main features
            const { storage, displaySize, chipSet, memory, sensors } = mainFeatures;
            phoneStorage.innerText = storage || 'N/A';
            phoneDisplaySize.innerText = displaySize || 'N/A';
            phoneChipset.innerText = chipSet || 'N/A';
            phoneMemory.innerText = memory || 'N/A';

            // Set sensors
            phoneSensors.innerHTML = ''; // Reset first
            sensors.forEach((sensor) => {
                const listElement = document.createElement('li');
                listElement.innerText = sensor;
                phoneSensors.appendChild(listElement);
            });

            // Set others
            otherFeatures.innerHTML = ''; // Reset first
            if ( !!others && Object.keys(others).length > 0 ) {
                for(const key in others) {
                    otherFeaturesHTMLGenerate(key, others[key]);
                }
            } else {
                otherFeatures.innerHTML = '<span class="text-sm font-semibold">N/A</span>';
            }

            // Open Slider
            toggleSlider();
        }
    } catch (error) {
        console.error(error);
    }
}

/* Other features HTML generator */
const otherFeaturesHTMLGenerate = (key, value) => {
    otherFeatures.insertAdjacentHTML('beforeend', `
        <tr>
            <td class="text-sm font-semibold inline-block w-28">${key}: </td>
            <td class="text-sm font-medium inline">${value}</td>
        </tr>
    `);
}


/* Event-listeners */
searchBarBtn.addEventListener('click', search);
loadMoreBtn.addEventListener('click', onClickLoadMore);
searchBarInput.addEventListener('keypress', event => {
    // On enter key press search
    if (event.key === 'Enter') {
        search();
    }
});
toggleSliderBtn.addEventListener('click', toggleSlider);
/* Fix initial height */
window.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementsByTagName('header')[0];
    const main = document.getElementsByTagName('main')[0];
    const footer = document.getElementsByTagName('footer')[0];

    const headerHeight = header.offsetHeight;
    const mainHeight = main.offsetHeight;
    const footerHeight = footer.offsetHeight;
    const documentHeight = document.documentElement.clientHeight;

    if (documentHeight > (headerHeight + mainHeight + footerHeight)) {
        main.style.minHeight = `${documentHeight - (headerHeight + footerHeight)}px`;
    }

});