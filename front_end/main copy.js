const dom = {

    todos: document.getElementById("displayTodos"),
    input: document.getElementById('inputValue'),
    btnAdd: document.getElementById('addTodos'),
    delete: document.getElementById('deleteTodo')

}

function renderNOTcompletedTodos(todos) {

    dom.todos.innerHTML = "";
    todos.forEach(todo => {
        dom.todos.innerHTML += `
		<li data-id="${todo.id}" data-name="${todo.title}"> ${todo.title}
        <button id="deleteTodo" type="button" onclick="deleteTodo()">Delete</button>
        <button id="completeTodo" type="button" onclick="completeTodo()">Done</button>
        </li>`


    })
}
function renderCompletedTodos(todos) {


    dom.todos.innerHTML = "";
    todos.forEach(todo => {
        dom.todos.innerHTML += `
	<li data-id="${todo.id}"style="text-decoration: line-through" data-name="${todo.title}"> ${todo.title}
    <button id="deleteTodo" type="button" onclick="deleteTodo()">Delete</button>
    <button id="uncompleteTodo" type="button" onclick="uncompleteTodo()">Undone</button>
    </li>`

    })
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
            renderNOTcompletedTodos(todos)

        })
}

function addTodo(url, title) {
    dom.todos.innerHTML = '';
    const newTodo = {
        "title": title,
        "completed": true
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
            fetchTodos(baseUrl + '/todos')
        })



    }
dom.btnAdd.addEventListener("click", addTodo);

function deleteTodo() {

    const btn = event.target;
    const index = parseInt(btn.parentElement.getAttribute("data-id"));

    url = baseUrl + '/todos/' + index;

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
            if (res.ok) { console.log('Successful Update JSON DB TRUE to FALSE') }
            else { console.log('Error! Information wasn\'t updated'); }
            return res
        })
        .then(data => {
            renderCompletedTodos(todos)

        })



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
                "completed": true,
                "title": todoTitle

            }
        )
    })
        .then(res => {
            if (res.ok) { console.log('Successful Update JSON DB False to True') }
            else { console.log('Error! Information wasn\'t updated'); }
            return res
        })
        .then(data => {
            fetchTodos(baseUrl + '/todos')
        })



}

const baseUrl = 'http://localhost:3000';
fetchTodos(baseUrl + '/todos');
let todos;



dom.btnAdd.addEventListener('click', function (e) {
    const todoTitle = dom.input.value;
    addTodo(baseUrl + '/todos', todoTitle);
})
// func workd, but the completed function cheked as a completed all todos. In db is correct cheked only the target obj.