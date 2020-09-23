// your code here, it may be worth it to ensure this file only runs AFTER the dom has loaded.
const BASE_URL = "http://localhost:3000/api/v1/calorie_entries/"

    document.addEventListener("DOMContentLoaded", e =>{
        getCalories();
        submitHandler();
        clickHandler();
        const elements = (document.getElementsByTagName("strong"))[0]
        console.log(elements)        
        
    })

    function getCalories(){
        fetch(BASE_URL)
        .then(resp => resp.json())
        .then(foodObjs => {
            const caloriesList = document.querySelector("#calories-list")
            caloriesList.innerHTML = ""    
            for (food of foodObjs){
                renderFood(food)
            }
        })
    }


    function renderFood(food){
        const caloriesList = document.querySelector("#calories-list")
        const caloriesLi = document.createElement("li")
        caloriesLi.classList.add("calories-list-item")
        caloriesLi.dataset.id = food.id
        const liBody = `
            <div class="uk-grid">
                <div class="uk-width-1-6">
                    <strong>${food.calorie}</strong>
                    <span>kcal</span>
                </div>
                <div class="uk-width-4-5">
                    <em class="uk-text-meta">${food.note}</em>
                </div>
            </div>
            <div class="list-item-menu">
                <a class="edit-button" uk-icon="icon: pencil" uk-toggle="target: #edit-form-container"></a>
                <a class="delete-button" uk-icon="icon: trash"></a>
            </div>
        `
        caloriesLi.innerHTML= liBody
        caloriesList.append(caloriesLi)
    }

    function submitHandler(){
        document.addEventListener('submit', event => {
            event.preventDefault();
            console.dir(event.target)
            if (event.target[2].classList.contains("add")){
                createEntry(event.target);

            }
            if (event.target[2].classList.contains("update")){   
                const autoClose = document.querySelector(".uk-close")
                console.log(autoClose)
                foodPatch(event.target)
                autoClose.click();
            };
        })
    }

    const clickHandler = () => {
        document.addEventListener("click", e => {
            
            if (e.target.matches(`[data-svg="trash"]`)) {
                clickDeleter(e.target.closest("li"));
            }
            if (e.target.matches(`[data-svg="pencil"]`)) {
                const editForm = document.querySelector("#edit-calorie-form")
                // console.log
                editForm.calories.value = (e.target.closest("li").querySelector("strong").textContent)
                editForm.notes.value = (e.target.closest("li").querySelector("em").textContent)
                editForm.dataset.foodId = e.target.closest("li").dataset.id
            }
        })
    }



    const clickDeleter = (foodDelete) => {
        const foodId = foodDelete.dataset.id;
        
        fetch(BASE_URL + foodId, {
        method: "DELETE"
        }).then(response => response.json())
        .then(data => {
            foodDelete.remove()});
    }

   
    const foodPatch = (patchingFood) => {
        const foodId = patchingFood.dataset.foodId 
        const foodCalories = patchingFood.calories.value
        const foodNotes = patchingFood.notes.value
        
        const options = {
            method: "PATCH",
            
            headers: {
                'content-type': 'application/json',
                'accepts': 'application/json'
            },

            body: JSON.stringify({
                calorie: foodCalories,
                note: foodNotes
            })
        }
        fetch(BASE_URL + foodId, options)
        .then(response => response.json())
        .then(updatedFood => {
            getCalories()
        })

    }

    function createEntry(form){
        const calories = form.calories.value
        const notes = form.notes.value
        console.log (calories, notes)

        const options = {

            method: "POST",

            headers: {
                "content-type": "application/json",
                "accepts": "application/json"
            }, 
            body: JSON.stringify({
                calorie: calories,
                note: notes
            })
        } 

        fetch(BASE_URL, options)
        .then(response => response.json())
        .then(newFood => renderFood(newFood))

}
