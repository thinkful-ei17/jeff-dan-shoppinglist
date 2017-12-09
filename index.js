'use strict';

const STORE = {
  items: [
    {name: 'apples', checked: false},
    {name: 'oranges', checked: false},
    {name: 'milk', checked: true},
    {name: 'bread', checked: false}
  ],
  hideCheckedItems: false,
  SearchItemSubmitted: false
};


function generateItemElement(item, itemIndex, template) {
  return `
    <li class="js-item-index-element" data-item-index="${itemIndex}">
      <span class="shopping-item js-shopping-item ${item.checked ? 'shopping-item__checked' : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
      </div>
    </li>`;
}


function generateShoppingItemsString(shoppingList) {
  console.log('Generating shopping list element');

  const items = shoppingList.map((item, index) => generateItemElement(item, index));
  
  return items.join('');
}


function renderShoppingList(searchItem) {
  // render the shopping list in the DOM
  console.log('`renderShoppingList` ran');
  console.log(searchItem);
  let shoppingListItemsString;
  //if search item submitted === true;
  //Render function for search items filter button
  //Render function for Hide Completed toggle button
  if (STORE.SearchItemSubmitted === true){
    const searchItemsArr = STORE.items.filter(item => item.name === searchItem);
    console.log(searchItemsArr);
    shoppingListItemsString = generateShoppingItemsString(searchItemsArr); 
  }
  else if (STORE.hideCheckedItems === true) {
    console.log('hideCheckedItems works!');
    const checkedItemsArr = STORE.items.filter(item => item.checked === false); 
    console.log(checkedItemsArr);
    shoppingListItemsString = generateShoppingItemsString(checkedItemsArr);
  }
  else {
    shoppingListItemsString = generateShoppingItemsString(STORE.items);
  }
  //if hideCheckeditem is set to true, filter store.items.checked that are 
  //set to true and hide them
  
  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
}

//adds the value that the user entered into the STORE.
function addItemToShoppingList(itemName) {
  console.log(`Adding "${itemName}" to shopping list`);
  STORE.items.push({name: itemName, checked: false});
}
//user submits new item to list and clicks "Add item" button. This grabs the item from the submit field and stores it to variable newItemName, then invokes addItemtoShopping List. 
function handleNewItemSubmit() {
  $('#js-shopping-list-form').submit(function(event) {
    event.preventDefault();
    console.log('`handleNewItemSubmit` ran');
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    addItemToShoppingList(newItemName);
    renderShoppingList();
  });
}



//user enters a filter item to search for and clicks submit
function handleFilterSubmit(){
  $('#js-shopping-list-filter-form').submit(function(event) {
    event.preventDefault();
    console.log('`handleFilterSubmit` ran');
    const filterItemName = $('.js-shopping-list-filter').val();
    $('.js-shopping-list-filter').val('');
    STORE.SearchItemSubmitted = true;    
    renderShoppingList(filterItemName);
    STORE.SearchItemSubmitted = false;        
  });      
}

function toggleCheckedForListItem(itemIndex) {
  console.log('Toggling checked property for item at index ' + itemIndex);
  STORE.items[itemIndex].checked = !STORE.items[itemIndex].checked;
}


function getItemIndexFromElement(item) {
  const itemIndexString = $(item)
    .closest('.js-item-index-element')
    .attr('data-item-index');
  return parseInt(itemIndexString, 10);
}

function handleItemCheckClicked() {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    console.log('`handleItemCheckClicked` ran');
    const itemIndex = getItemIndexFromElement(event.currentTarget);
    toggleCheckedForListItem(itemIndex);
    renderShoppingList();
  });
}


function deleteItem(itemIndex) {
  STORE.items.splice(itemIndex, 1);
}

function handleDeleteItemClicked() {
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    console.log('`handleDeleteItemClicked` ran');
    const itemIndex= getItemIndexFromElement(event.currentTarget);
    deleteItem(itemIndex);
    renderShoppingList();
  }); 
}

function handleFilterToggle() {
  $('#js-filter-toggle').on('click', event => {
    console.log('handleFilterToggle ran');
    //Update checkToggled to be true for matching items in 
    // console.log(checkedItemsArr);
    STORE.hideCheckedItems = !STORE.hideCheckedItems;
    console.log(STORE.hideCheckedItems);
    renderShoppingList();    
  });
}

//Search Items User Story
//1. User enters filter term in filter text box.
//2. Reference store for matching item that matches user input
//3. Page re-renders with other items removed that don't match user input

//1. Record user behavior (event listener, optional) -> Complete
//2. Interacting with the store 
//3. Re-Render the shopping list



// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
  renderShoppingList();
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleFilterToggle();
  handleFilterSubmit();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);