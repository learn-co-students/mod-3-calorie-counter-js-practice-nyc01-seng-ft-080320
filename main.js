// your code here, it may be worth it to ensure this file only runs AFTER the dom has loaded.
const BASE_URL = "http://localhost:3000/api/v1/calorie_entries/"

    document.addEventListener("DOMContentLoaded", e =>{
        getCalories();
        submitHandler();
        clickHandler();
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
            
            if (event.target[2].classList.contains("add")){
                createEntry(event.target);

            }
            if (event.target[2].classList.contains("update")){   
                const autoClose = document.querySelector(".uk-close")
              
                foodPatch(event.target)
                autoClose.click();
            }
            else if (event.target[3].classList.contains('bmr')){
                calculateBmr(event.target)
                
            }
        })
    }

    function calculateProgress(){
        
            const elements = (document.getElementsByTagName("strong"));
            let sum = 0
            for (let element of elements) {
                sum += parseInt(element.innerText)
            };
            console.log(sum)
            document.querySelector(".uk-progress").value = sum
    }

    const clickHandler = () => {
        document.addEventListener("click", e => {
            
            if (e.target.matches(`[data-svg="trash"]`)) {
                clickDeleter(e.target.closest("li"));
            }
            if (e.target.matches(`[data-svg="pencil"]`)) {
                const editForm = document.querySelector("#edit-calorie-form")
                
                editForm.calories.value = (e.target.closest("li").querySelector("strong").textContent)
                editForm.notes.value = (e.target.closest("li").querySelector("em").textContent)
                editForm.dataset.foodId = e.target.closest("li").dataset.id
            }
        })
    }


    const calculateBmr = target => {
       
        const weight = parseInt(target[0].value);
        const height = parseInt(target[1].value);
        const age = parseInt(target[2].value);

        const lowerBmr = document.querySelector("span#lower-bmr-range");
        const upperBmr = document.querySelector("span#higher-bmr-range");
        
        lowerBmr.textContent = 655 + (4.35 * weight) + (4.7 * height) - (4.7 * age);
        upperBmr.textContent = 66 + (6.23 * weight) + (12.7 * height) - (6.8 * age);

        let avgBmr = (parseInt(lowerBmr.textContent) + parseInt(upperBmr.textContent))/2
        console.dir(document.querySelector(".uk-progress"))
        document.querySelector(".uk-progress").setAttribute("max", `${avgBmr}`)
        
        calculateProgress()
    }
    
    // * forumla for lower-range: `BMR = 655 + (4.35 x weight in pounds) + (4.7 x height in inches) - (4.7 x age in years)`
    // * formula for upper-range: `BMR = 66 + (6.23 x weight in pounds) + (12.7 x height in inches) - (6.8 x age in years)`

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















// document.addEventListener('DOMContentLoaded', () => {
//     baseUrl = 'http://localhost:3000/api/v1/calorie_entries/'
//     //1. get request
//     //2. render List

//     const fetchCalories = (url) => {
        
//         fetch(url)
//         .then(resp => resp.json())
//         .then(calorieEntries => renderEntries(calorieEntries))
//     }
    
//     const renderEntries = entries => {
        
//         for(entry of entries){
//             renderEntry(entry)
//         }
//     }

//     const renderEntry = entry => {
//         const li = document.createElement('li')
//         li.className = "calories-list-item"
//         li.dataset.entryId = entry.entryId

//         li.innerHTML = `
//             <div class="uk-grid">
//             <div class="uk-width-1-6">
//                 <strong>${entry.calorie}</strong>
//                 <span>kcal</span>
//             </div>
//             <div class="uk-width-4-5">
//                  <em class="uk-text-meta">${entry.note}</em>
//             </div>
//             </div>
//             <div class="list-item-menu">
//                 <a class="edit-button" uk-toggle="target: #edit-form-container" uk-icon="icon: pencil"></a>
//                 <a class="delete-button" uk-icon="icon: trash"></a>
//             </div>
//         `
//         const entryUl = document.querySelector('#calories-list')
//         entryUl.append(li)
//     }

//     const submitHandler = () => {
//         document.addEventListener('submit', e => {
//             e.preventDefault()
//             if(e.target.matches('#new-calorie-form')){
//                 addEntry(e.target)
//             }
            
//         })
//     }

//     const addEntry = target => {
//         const entryForm = target
        
        
//         const calories = entryForm.calories.value
//         const note = entryForm.note.value

//         let options = {
//             method: "POST",
//             headers: {
//                 "content-type": "application/json",
//                 "accept": "application/json"
//             },
//             body: JSON.stringify({
//                 calorie: calories,
//                 note: note
//             })
//         }

//         fetch(baseUrl, options)
//         .then(resp => resp.json())
//         .then(entry => renderEntry(entry))
//         entryForm.reset()
//     }


//     submitHandler()
//     fetchCalories(baseUrl)
// })