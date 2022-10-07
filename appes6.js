class Book{
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI{
    addBookToList(book){
        const list = document.getElementById('book-list');
        // Create tr element
        const row = document.createElement('tr');
        // Insert cols
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="delete">X</a></td>
        `;
    
        list.appendChild(row);
    }
    showAlert(message, className){
        // Create div
        const div = document.createElement('div');
        // Add classes
        div.className = `alert ${className}`;
        // Add text
        div.appendChild(document.createTextNode(message));
        // Get parent
        const container = document.querySelector('.container');
        // Get form
        const form = document.querySelector('#book-form');
        // Insert alert
        container.insertBefore(div, form);

        // Timeout after 3 sec
        setTimeout(function(){
            document.querySelector('.alert').remove();
        }, 3000);
    }
    deleteBook(target){
        if(target.className === 'delete'){ // if you did indeed click on the x
            target.parentElement.parentElement.remove();
            this.showAlert('Book Removed!', 'success'); // show message
        }
    }
    clearFields(){
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }
}

// Local Storage Class
class Store {
    static getBooks(){ // fetch from local storage
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        }
        else{
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }
    static displayBooks(){
        const books = Store.getBooks();

        books.forEach(function(book){
            const ui = new UI;
            // Add book to UI
            ui.addBookToList(book);
        });
    }
    static addBook(book){
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }
    static removeBook(isbn){
        const books = Store.getBooks();

        books.forEach(function(book, index){
            if(book.isbn === isbn){
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}

// DOM Load Event
document.addEventListener('DOMContentLoaded', Store.displayBooks);

// Event Listener for add book
document.getElementById('book-form').addEventListener('submit', 
    function(e){ // event parameter; this function calls as soon as the submit event is picked up by the event listener
        //Get form values
        const title = document.getElementById('title').value,
        author = document.getElementById('author').value,
        isbn = document.getElementById('isbn').value;

        // Instantiate book
        const book = new Book(title, author, isbn);

        // Instantiate UI
        const ui = new UI();

        // Validate
        if(title === '' || author === '' || isbn === ''){
            // Error alert
            ui.showAlert('Please fill in all fields', 'error');
        }
        else{
            // Add book to list
            ui.addBookToList(book);

            // Add to local storage
            Store.addBook(book);

            // Show success
            ui.showAlert('Book Added!', 'success');

            // Clear fields
            ui.clearFields();
        }

        e.preventDefault();
    });

// Event Listener for delete
document.getElementById('book-list').addEventListener('click', function(e){ // need to grab a parent
    // Instantiate UI
    const ui = new UI();
    let correctClick; // tracks to make sure you clicked on x since we attached
                      // the event listener to the entire book list

    // Delete book
    correctClick = ui.deleteBook(e.target);

    // Remove from local storage
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent); // passes the isbn
    
    e.preventDefault();
});