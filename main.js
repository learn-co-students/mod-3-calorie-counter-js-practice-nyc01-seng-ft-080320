document.addEventListener('DOMContentLoaded', () => {
const url = "http://localhost:3000/calories_list_items/"

const getItemsAndRenderToDom = () => {
    fetch(url)
    .then(response => response.json())
    .then(items => {
        renderItems(items)
    })
}

const renderItems = items => {
    let totalCalories = 0
    for(const item of items){
        totalCalories += item.calories
        renderItem(item)    
    }
    const progress = document.querySelector('progress')
    progress.value = totalCalories
}

const renderItem = item => {
    const itemUl = document.querySelector('#calories-list')
    const itemLi = document.createElement('li')
    itemLi.classList.add('calories-list-item')
    itemLi.dataset.itemId = item.id
    itemLi.innerHTML = `
    <div class="uk-grid">
        <div class="uk-width-1-6">
            <strong>${item.calories}</strong>
            <span>kcal</span>
        </div>
        <div class="uk-width-4-5">
            <em class="uk-text-meta">${item.note}</em>
        </div>
    </div>
    <div class="list-item-menu">
        <a class="edit-button" uk-toggle="target: #edit-form-container" uk-icon="icon: pencil"></a>
        <a class="delete-button" uk-icon="icon: trash"></a>
    </div>
    `
    itemUl.append(itemLi)
}

const clickHandler = () => {
    document.addEventListener('click', e => {
        if(e.target.matches('.add-item-button')){
            e.preventDefault()
            addNewItem(e.target)
        } else if(e.target.matches(`svg[data-svg="trash"]`)){
            deleteItem(e.target)
        } else if(e.target.matches(`svg[data-svg="pencil"]`)){
            prepopulateEditForm(e.target)
        } else if(e.target.matches('.update-button')){
            e.preventDefault()
            updateItem(e.target)
        } else if(e.target.matches('.bmr-button')){
            e.preventDefault()
            const bmrForm = e.target.closest('form')
            const heightString = bmrForm.querySelector('input.height').value
            const weightString = bmrForm.querySelector('input.weight').value
            const ageString = bmrForm.querySelector('input.age').value

            const height = parseInt(heightString)
            const weight = parseInt(weightString)
            const age = parseInt(ageString)
            calculateBmr(height, weight, age)
            bmrForm.reset()
        }

    })
}
const calculateBmr = (height, weight, age) => {
    // span#lower-bmr-range and span#higher-bmr-range with the appropriate values
 const bmrLower = 655 + (4.35 * weight) + (4.7 * height) - (4.7 * age )
 const bmrUpper = 66 + (6.23 * weight) + (12.7 * height) - (6.8 * age)

 const average = (bmrLower + bmrUpper)/2
 const progressBar = document.querySelector('progress')
 progressBar.max = average

 const lowerSpan = document.querySelector('#lower-bmr-range')
 const upperSpan = document.querySelector('#higher-bmr-range')
 lowerSpan.innerHTML = Math.ceil(bmrLower)
 upperSpan.innerHTML = Math.ceil(bmrUpper)
}

const updateItem = el => {
    const form = el.closest('form')
    const itemId = form.dataset.currentItemId
    const calories = form.querySelector('input').value
    const note = form.querySelector('textarea').value

    const itemObj = {
        calories: parseInt(calories),
        note: note
    }

    const options = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(itemObj)
    }

    fetch(url + itemId, options)
    .then(response => response.json())
    .then(item => {
        resetPage()
    })
}

const prepopulateEditForm = el => {
    const itemLi = el.closest('li')
    const itemId = itemLi.dataset.itemId
    const calsString = itemLi.querySelector('strong').innerText
    const calories = parseInt(calsString)
    const notes = itemLi.querySelector('em').innerText
    
    const editForm = document.querySelector('#edit-calorie-form')
    const calInput = editForm.querySelector('input')
    const noteInput = editForm.querySelector('textarea')
    calInput.value = calories
    noteInput.value = notes
    editForm.dataset.currentItemId = itemId
}

const deleteItem = el => {
    const itemLi = el.closest('li')
    const itemId = itemLi.dataset.itemId
    
    const options = {
        method: "DELETE",
        headers: {
            "Accept": "application/json"
        }
    }

    fetch(url + itemId, options)
    .then(response => response.json())
    .then(() => {
        itemLi.remove()
        resetPage()
    })
}

const addNewItem = el => {
    const caloriesInput = el.parentElement.querySelector('input')
    let calories = caloriesInput.value
    calories = parseInt(calories)
    const noteInput = el.parentElement.querySelector('textarea')
    const note = noteInput.value

    const itemObj = {
        calories: calories,
        note: note
    }

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(itemObj)
    }

    fetch(url, options)
    .then(response => response.json())
    .then(item => {
        resetPage()
        const caloriesInput = el.parentElement.querySelector('input')
        caloriesInput.value = ""
        const noteInput = el.parentElement.querySelector('textarea')
        noteInput.value = ""
    })
}

const resetPage = () => {
    const itemUl = document.querySelector('#calories-list')
    itemUl.innerHTML = ''
    getItemsAndRenderToDom()
}

clickHandler()
getItemsAndRenderToDom()
})