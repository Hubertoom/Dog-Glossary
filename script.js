const content = document.getElementById('content');
const buttonRandomDog = document.getElementById('button-random-dog');
const buttonBreedDog = document.getElementById('button-show-breed');
const buttonSubBreeds = document.getElementById('button-show-sub-breed');
const buttonShowAll = document.getElementById('button-show-all');
const breedInput = document.getElementById('input-breed');

buttonRandomDog.addEventListener('click', fetchImage);
buttonBreedDog.addEventListener('click', fetchImage);
buttonSubBreeds.addEventListener('click', fetchSubBreed);
buttonShowAll.addEventListener('click', showAll);

async function showAll() {
    try {
        const response = await fetch('https://dog.ceo/api/breeds/list/all');
        const data = await response.json();
        if (data.status !== 'success') throw new Error('Breed not found!');
        if (data.message.length === 0) throw new Error('No sub-breeds found!');
        let olMain = document.createElement('ol');

        Object.keys(data.message).forEach(key => {
                let liMain = document.createElement('li');
                liMain.textContent = key
                olMain.appendChild(liMain);
            if (data.message[key].length > 0) {
                let ulSub = document.createElement('ul');
                for (let i in data.message[key]) {
                    let liSub = document.createElement('li');
                    liSub.textContent = data.message[key][i];
                    ulSub.appendChild(liSub);
                }
                liMain.appendChild(ulSub)
                olMain.appendChild(liMain);
            }
        });
        content.innerHTML = olMain.outerHTML;
    } catch (error) {

    }
}

async function fetchSubBreed() {
    try {
        let breed = breedInput.value.toLowerCase();
        const response = await fetch(`https://dog.ceo/api/breed/${breed}/list`);
        const data = await response.json();
        if (data.status !== 'success') throw new Error('Breed not found!');
        if (data.message.length === 0) throw new Error('No sub-breeds found!');
        let ol = document.createElement('ol');
        for (let index in data.message) {
            let li = document.createElement('li');
            li.textContent = data.message[index];
            ol.appendChild(li);
        }
        content.innerHTML = ol.outerHTML;
    } catch (error) {
        content.innerHTML = `<p>${error.message}</p>`;
    }
}

async function fetchImage(event) {
    let url;
    if (event.target.id === 'button-random-dog') {
        url = 'https://dog.ceo/api/breeds/image/random';
    } else {
        url = `https://dog.ceo/api/breed/${breedInput.value.toLowerCase()}/images/random`;
    }
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status !== 'success') {
            throw new Error('Breed not found!');
        }

        let img = document.createElement('img');
        img.id = 'dogImage';
        img.src = data['message'];
        img.alt = 'photo of doge';

        let description = document.createElement('p');
        description.id = 'description';
        description.textContent = data.message.split(/\//)[4].split(/-/)[0];

        content.innerHTML = img.outerHTML;
        content.appendChild(description);
        breedInput.value = description.textContent;
    } catch (error) {
        content.innerHTML = `<p>${error.message}</p>`;
    }
}