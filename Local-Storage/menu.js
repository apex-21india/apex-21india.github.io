const date = new Date();

const menu = {
    items: JSON.parse(localStorage.getItem('items')) || [],

    deleted: JSON.parse(localStorage.getItem('deleted')) || [],

    trash: JSON.parse(localStorage.getItem('trash')) || [],

    displayItems: function () {
        if(this.items.length === 0){
            console.log('No items live here!');
            return;
        };
        console.log('Your Food: ');
        this.items.forEach(function(item){
            console.log(item.itemName);
        })
    },
    
    addItem: function(item){
        this.items.push({
            itemName: item,
            done: false,
            added: `${date.getDate()}/${date.getMonth()}/${date.getYear() + 1900}`, 
            completed: ''          
        });
    },

    deleteItem: function(position){
        if(this.items[position].done)
            this.updateDeleted(this.items[position]);
        else{
            this.trash.push(this.items[position]);
            localStorage.setItem('trash', JSON.stringify(this.trash));
        }
        this.items.splice(position, 1);
    },

    toggleItem: function (position) {
        const item = this.items[position];
        item.done = !item.done;
        if(item.done){
            const date = new Date();
            item.completed = `${date.getDate()}/${date.getMonth()}/${date.getYear() + 1900}` 
        }
        else{
            item.completed = '';
        }
    },

    toggleAll: function () {
        const totalItems = this.items.length;
        let doneItems = 0;

        this.items.forEach(function(item){
            if(item.done)
                doneItems++;
        })

        if(doneItems === totalItems){
            this.items.forEach(function(item){
                item.done = false;
                item.completed = '';
            })
        }
        else{
            this.items.forEach(function (item){
                if(!item.done){
                    item.done = true;
                    const date = new Date();
                    item.completed = `${date.getDate()}/${date.getMonth()}/${date.getYear() + 1900}`
                }
            })
        }
    },

    deleteChecked: function () {
        this.items = this.items.filter(function(item){
           if(item.done){
                this.updateDeleted(item);
           }
           return !item.done;
        }, this);
        // this.items.forEach(function(item, index){
        //     if(item.done){
        //         this.deleteItem(index);
        //     }
        // }, this)
    },
    
    updateDeleted: function (item) {
        this.deleted.push(item);
        localStorage.setItem('deleted', JSON.stringify(this.deleted));
    },

    deleteDeleted: function (position){
        this.deleted.splice(position, 1);
        localStorage.setItem('deleted', JSON.stringify(this.deleted));
    },

    clearDeleted: function () {
        this.deleted = [];
        localStorage.setItem('deleted', JSON.stringify(this.deleted));
    },

    clearTrash: function () {
        this.trash = [];
        localStorage.setItem('trash', JSON.stringify(this.trash));
    }

}

const handlers = {
    addItem: function () {
        const addItemInput = addItemsForm.item;
        menu.addItem(addItemInput.value);
        addItemsForm.reset();
        view.displayItems();
    },

    toggleAll: function (e) {
        e.preventDefault();
        menu.toggleAll();
        view.displayItems();
    },

    deleteChecked: function (e){
        e.preventDefault();
        menu.deleteChecked();
        view.displayItems();
    }
}

const toggleAllButton = document.querySelector('.toggle-all-button');
toggleAllButton.addEventListener('click', handlers.toggleAll);


const deleteCheckedButton = document.querySelector('.delete-checked-button');
deleteCheckedButton.addEventListener('click', handlers.deleteChecked);

const addItemsForm = document.querySelector('.add-items');

addItemsForm.addEventListener('submit', function (e){
    e.preventDefault();
    handlers.addItem();
});


var view = {
    populateList: function (list, items) {
        list.innerHTML = items.map(function (item, i){
            return `<li class="menu__item" data-index="${i}">
                <input type="checkbox" id="item${i}" ${item.done ? 'checked' : ''}>
                <label ${item.done ? 'class="faded"'  : ''} for="item${i}">${item.itemName}</label>
                <button class="delete-button">Delete</button>
            </li>`
        }).join('');
        localStorage.setItem('items', JSON.stringify(menu.items));
    },

    displayItems: function () {
        const menuList = document.querySelector('.menu');
        this.populateList(menuList, menu.items);
    },

    setUpEventListeners: function () {
        const menuList = document.querySelector('.menu');
        const view = this;
        menuList.addEventListener('click', function (e) {
            if(e.target.matches('input')) {
              const elementClicked = e.target;
              const index = elementClicked.parentNode.dataset.index;
              menu.toggleItem(index);
              //kind -of confused over display or localStorage but i'll go with local for now
              view.displayItems();
            }
            else if(e.target.matches('button')){
                const elementClicked = e.target;
                const index = elementClicked.parentNode.dataset.index;
                menu.deleteItem(index);
                view.displayItems();
            }
        })
    }

}

view.displayItems();
view.setUpEventListeners();