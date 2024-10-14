let form = document.getElementById('task')
let formOpenBtn = document.getElementById('openTaskForm')
let disTask = document.getElementById('disTask')
let titleInput = document.getElementById('title')
let descriptionInput = document.getElementById('description')
let selectTag = document.getElementById('sorting')
let editIdx = null

function openForm(){form.style.display='flex',formOpenBtn.style.display='none'}

function setTask(event){
    event.preventDefault()

    form.style.display='none'
    formOpenBtn.style.display='block'
    let title = titleInput.value
    let description = descriptionInput.value 
    let status = false

    if (!title || !description){
        alert('All Fields Are Mandatory')
        return
    }

    let tasks = JSON.parse(localStorage.getItem('tasks')) || []

    if(editIdx == null){
        tasks.push({title,description,status})
    }

    else{
        tasks[editIdx].title = title
        tasks[editIdx].description = description
        editIdx = null
    }


    localStorage.setItem('tasks',JSON.stringify(tasks))

    fetchTaskData()
    form.reset()
    
}


function fetchTaskData(){

    let tasks = JSON.parse(localStorage.getItem('tasks')) || []

    disTask.innerHTML = ''

    tasks.forEach((item,idx)=>{
        disTask.append(createCard(item,idx))
    })
}


function createCard({title,description,status},idx){

    let div = document.createElement('div')
    let h3 = document.createElement('h3')
    let des = document.createElement('p')
    let statusP = document.createElement('p')
    let statusToggle = document.createElement('button')
    let edit = document.createElement('button')
    let del = document.createElement('button')

    h3.textContent = title
    des.textContent  = description
    statusP.textContent = `Status: ${status?'Completed':'Pending'}`
    edit.textContent = 'Edit'
    del.textContent = 'Delete'
    statusToggle.textContent = 'Toggle Status'

    statusToggle.addEventListener('click',()=>{
        status = !status
        statusP.textContent = `Status: ${status?'Completed':'Pending'}`

        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks[idx].status = status; 
        localStorage.setItem('tasks', JSON.stringify(tasks));
    })

    edit.addEventListener('click',()=>{
        populateTheData(title,description,idx)
    })
        

    del.addEventListener('click',()=>{
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        if(idx >= 0 && idx < tasks.length){
            tasks.splice(idx,1)
        }
        localStorage.setItem('tasks', JSON.stringify(tasks));
        div.remove()
    })

    div.append(h3,des,statusP,statusToggle,edit,del)
    return div    
}


function populateTheData(title,description,idx){
    editIdx = idx
    titleInput.value = title
    descriptionInput.value = description
    form.style.display='flex'
    formOpenBtn.style.display='none'
}


selectTag.addEventListener('change',()=>{
    
    let filterTaskData;

    let tasks = JSON.parse(localStorage.getItem('tasks')) || []

    if(selectTag.value === 'pending'){
        filterTaskData = tasks.filter(item=>item.status==false)
    }
    else if(selectTag.value === 'completed'){
        filterTaskData = tasks.filter(item=>item.status)
    }
    else{
        filterTaskData = tasks
    }

    disTask.innerHTML = ''

    filterTaskData.forEach((item,idx)=>{
        disTask.append(createCard(item,idx))
    })

})


form.addEventListener('submit',setTask)

fetchTaskData()

