document.addEventListener('DOMContentLoaded', e => {
  const baseURL = 'http://localhost:3000/api/v1/calorie_entries';
  const entriesUl = document.querySelector('#calories-list');
  let totalCalories = 0;

  const getEntries = () => {
    fetch(baseURL)
      .then(resp => resp.json())
      .then(json => renderEntries(json));
  };

  const renderEntries = (entries) => {
    clearEntries();
    for (let entry of entries) {
      renderEntry(entry);
    }
    
  };

  const renderEntry = (entry) => {
    const newLi = document.createElement('li');
    newLi.className = 'calories-list-item';
    newLi.dataset.id = entry.id;

    const newGridDiv = document.createElement('div');
    newGridDiv.className = 'uk-grid';

    const newCalDiv = document.createElement('div');
    newCalDiv.className = 'uk-width-1-6';

    const newCalNum = document.createElement('strong');
    newCalNum.textContent = entry.calorie;

    const newCalUnit = document.createElement('span');
    newCalUnit.textContent = 'kcal';

    newCalDiv.append(newCalNum);
    newCalDiv.append(newCalUnit);

    const newInfoDiv = document.createElement('div');
    newInfoDiv.className = 'uk-width-4-5';

    const newEntryNote = document.createElement('em');
    newEntryNote.className = 'uk-text-meta';
    newEntryNote.textContent = entry.note;

    newInfoDiv.append(newEntryNote);

    newGridDiv.append(newCalDiv);
    newGridDiv.append(newInfoDiv);

    const newMenuDiv = document.createElement('div');
    newMenuDiv.className = 'list-item-menu';

    const newEditButton = document.createElement('a');
    newEditButton.className = 'edit-button';
    newEditButton.setAttribute('uk-icon', 'icon: pencil');
    newEditButton.setAttribute('uk-toggle', 'target: #edit-form-container');


    const newDeleteButton = document.createElement('a');
    newDeleteButton.className = 'delete-button';
    newDeleteButton.setAttribute('uk-icon', 'icon: trash');

    newMenuDiv.append(newEditButton);
    newMenuDiv.append(newDeleteButton);

    newLi.append(newGridDiv);
    newLi.append(newMenuDiv);

    entriesUl.append(newLi);

    totalCalories += entry.calorie;
    document.querySelector('.uk-progress').value = totalCalories;
  };

  const clearEntries = () => {
    while (entriesUl.firstElementChild) {
      entriesUl.firstElementChild.remove();
    }
  };

  const deleteEntry = (deleteButton) => {
    const entryId = parseInt(deleteButton.parentElement.parentElement.dataset.id, 10);

    fetch(`${baseURL}/${entryId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({})
    })
      .then(resp => resp.json())
      .then(() => getEntries());
  };

  const calculateBMR = (weight, height, age) => {
    const lowerRange = Math.round(655 + (4.35 * weight) + (4.7 * height) - (4.7 * age));
    const higherRange = Math.round(66 + (6.23 * weight) + (12.7 * height) - (6.8 * age));
    setProgress(lowerRange, higherRange);
  };

  const setProgress = (lowerRange, higherRange) => {
    const lower = document.querySelector('#lower-bmr-range');
    lower.textContent = lowerRange;
    const higher = document.querySelector('#higher-bmr-range');
    higher.textContent = higherRange;

    const bar = document.querySelector('.uk-progress');
    bar.setAttribute('max', Math.round((lowerRange + higherRange) / 2));

  };

  const clickHandler = () => {
    document.addEventListener('click', e => {
      if (e.target.parentElement.matches('.delete-button')) {
        deleteEntry(e.target.parentElement);
      } else if (e.target.matches('button')) {
        e.preventDefault();
        
        const weightInput = e.target.parentElement.firstElementChild.nextElementSibling.firstElementChild;
        const heightInput = weightInput.parentElement.nextElementSibling.firstElementChild;
        const ageInput = heightInput.parentElement.nextElementSibling.firstElementChild;
        const weight = parseInt(weightInput.value, 10);
        const height = parseInt(heightInput.value, 10);
        const age = parseInt(ageInput.value, 10);

        calculateBMR(weight, height, age);
        
      }
    });
  };

  getEntries();
  clickHandler();
});