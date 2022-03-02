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

const search = async () => {
    try {
        toggleSearchSpinner();
        resetPhonesGrid();
        resetPhoneAndLoadMoreState();

        const searchTerm = searchBarInput.value;
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

const phoneItemHTMLGenerator = (phone) => {
    const {brand, phone_name, slug, image} = phone;

    return (`
        <div
            class="group relative bg-gray-50 rounded-md shadow-md hover:shadow-lg hover:-translate-y-1 transition duration-300 ease-in-out">
            <div
                class="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none transition duration-300 ease-in-out">
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
                <button id="view-details" type="button"
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition duration-200 ease-in-out">View
                    Details</button>
            </div>
        </div>
    `);
}

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

const renderPhones = (phones) => {
    phones.forEach((phone) => {
        phonesGrid.insertAdjacentHTML('beforeend', phoneItemHTMLGenerator(phone));
    });
}


/* Event-listeners */
searchBarBtn.addEventListener('click', search);
loadMoreBtn.addEventListener('click', onClickLoadMore);
searchBarInput.addEventListener('keypress', event => {
    // On enter key press search
    if (event.keyCode === 13) {
        search();
    }
});
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