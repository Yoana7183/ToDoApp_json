const dom = {

    todosList: document.getElementById("displayTodos"),
    input: document.getElementById('inputValue'),
    btnAdd: document.getElementById('addTodos'),
    delete: document.getElementById('deleteTodo')
}

function renderTodos(todos) {
    var text = "";

    todos.forEach(todo => {
        dom.todosList.innerHTML = '';
        if (!todo.completed) {
            text += `
            <li data-id="${todo.id}" data-name="${todo.title}"> ${todo.title}
            <button id="deleteTodo" type="button" onclick="deleteTodo()">Delete</button>
            <button id="completeTodo" type="button" onclick="completeTodo()">Done</button>
            </li>`
        } else {
            text += `
	        <li data-id="${todo.id}" style="text-decoration: line-through" data-name="${todo.title}"> ${todo.title}
            <button id="deleteTodo" type="button" onclick="deleteTodo()">Delete</button>
            <button id="uncompleteTodo" type="button" onclick="uncompleteTodo()">Undone</button>
            </li>`
        }
    })

    dom.todosList.innerHTML = text;
}

function fetchTodos(url) {
    fetch(url)
        .then(r => {
            if (r.ok) {
                return r.json()
            }
        })
        .then(data => {
            todos = data;
            renderTodos(todos)
        })
}

function addTodo(url, title) {

    const newTodo = {
        "title": title,
        "completed": false
    };



    fetch(url, {
        method: 'post',
        body: JSON.stringify(newTodo),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(r => r.json())
        .then(data => {
            todos.push(data);
            window.localStorage.setItem('Added todo', JSON.stringify(todos))
            fetchTodos(baseUrl + '/todos')
        })

}

dom.btnAdd.addEventListener("click", addTodo);

function deleteTodo() {

    const btn = event.target;
    const index = parseInt(btn.parentElement.getAttribute("data-id"));

    url = baseUrl + '/todos/' + index;
    window.localStorage.setItem('Deleted todo', JSON.stringify(todos))
    fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json'
        },
    })
        .then(res => {
            if (res.ok) { console.log('delete request successful') }
            else { console.log('unsuccessful'); }
            return res
        })
        .then(data => {

            todos.splice(data);
            fetchTodos(baseUrl + '/todos')

        })

}

function completeTodo() {

    const btn = event.target;
    const index = parseInt(btn.parentElement.getAttribute("data-id"));
    const todoTitle = btn.parentElement.getAttribute("data-name");

    url = baseUrl + '/todos/' + index;
    let doneTodods = {
        "completed": true,
        "title": todoTitle
    };
    fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doneTodods)

    })
        .then(res => {
            if (res.ok) { console.log('Successful Update JSON DB TRUE to FALSE') }
            else { console.log('Error! Information wasn\'t updated'); }
            return res
        })
    window.localStorage.setItem('Completed todo', JSON.stringify(todos))
    fetchTodos(baseUrl + '/todos')

}

function uncompleteTodo() {

    const btn = event.target;
    const index = parseInt(btn.parentElement.getAttribute("data-id"));
    const todoTitle = btn.parentElement.getAttribute("data-name");

    url = baseUrl + '/todos/' + index;

    fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
            {
                "completed": false,
                "title": todoTitle

            }
        )
    })
        .then(res => {
            if (res.ok) { console.log('Successful Update JSON DB False to True') }
            else { console.log('Error! Information wasn\'t updated'); }
            return res
        })
    window.localStorage.setItem('Uncompleted todo', JSON.stringify(todos))
    fetchTodos(baseUrl + '/todos')

}

const baseUrl = 'http://localhost:3000';
fetchTodos(baseUrl + '/todos');
let todos;

dom.btnAdd.addEventListener('click', function (e) {
    const todoTitle = dom.input.value;
    addTodo(baseUrl + '/todos', todoTitle);
})
dom.input.addEventListener('keypress', function (e) {
    if (e.keyCode === 13) {
        addTodo()
    };
})
