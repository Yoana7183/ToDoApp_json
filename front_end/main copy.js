
var input = document.getElementById('inputValue');
let todos;
const baseUrl = 'http://localhost:3000';

fetchTodos(baseUrl + '/todos');
function fetchTodos(url) {
    fetch(url)
        .then(r => {
            if (r.ok) {
                return r.json()
            }
        })
        .then(data => {
            todos = data;
            render(todos)
        })
}
const addTodo = (url, title) => {

    var title = input.value;

    if (title === "") {
        console.log('ad');
    } else {
        const newTodo = {
            "title": title,
            "completed": false
        };

        fetch(url, {
            method:'post',
            body:JSON.stringify(newTodo),
            headers:{
                "Content-Type":"application/json"
            }
        })
        .then(r=>r.json())
        .then(data=>{
            todos.push(data);
            render(todos)
        })
    }
}

const deleteTodo = () => {

    const btn = event.target;
    const index = parseInt(btn.parentElement.getAttribute("idx"));
    todoArr.splice(index, 1);

    render();
}




document.getElementById('addTodos').addEventListener("click", addTodo);



function render(todos) {

            dom.todos.innerHTML = "";
            todos.forEach(todo=>{
                dom.todos.innerHTML += `
                <li data-id="${todo.id}">${todo.id} <span>${todo.title}</span><span>[${todo.completed}]</span></li>`
            } )
        }
//    ` <li style="text-decoration: line-through"
//      id="comp" idx="${i}"> ${i + 1}. ${todos}</div> <button id="deleteTodo"type="button" onclick="deleteTodo()">Delete</button>
//             <button id="completeTodo"type="button" onclick="completeTodo()">Undone</button></li>`});
//         } else {
//         todos = todos + `<li id="comp" idx="${i}">  ${i + 1}. ${todo.todo}</div> <button id="deleteTodo"type="button" onclick="deleteTodo()">Delete</button>
//             <button id="completeTodo"type="button" onclick="completeTodo()">Done</button></li>`;
//     }
// };

const dom = {

todos: document.getElementById("displayTodos"),
input :document.getElementById('inputValue'),
addBtn: document.getElementById('addTodos')

}
dom.btnAdd.addEventListener('click', function(e) {
	const todoTitle = dom.input.value;
	addTodo(baseUrl+'/todos', todoTitle);
}) 