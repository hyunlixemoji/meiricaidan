const categories = ["7天前", "6天前", "5天前", "4天前", "3天前", "2天前", "1天前", "今天", "明天"];
const meals = ["早餐", "午餐", "晚餐"];
let menuData = JSON.parse(localStorage.getItem('menuData')) || {};

function getDateOffset(offset) {
    const today = new Date();
    today.setDate(today.getDate() + offset);
    return today.toISOString().slice(0, 10);
}

function updateMenuDisplay() {
    const menuContainer = document.getElementById('menu-container');
    menuContainer.innerHTML = "";

    categories.forEach((category, index) => {
        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('menu-category');
        categoryContainer.classList.add(`category-${9 - index}`);

        const categoryTitle = document.createElement('h2');
        categoryTitle.innerText = category;
        categoryContainer.appendChild(categoryTitle);

        meals.forEach(meal => {
            const mealContainer = document.createElement('div');
            mealContainer.classList.add('menu-title');
            mealContainer.innerText = meal;

            const mealItemsContainer = document.createElement('div');

            Object.keys(menuData).forEach(itemKey => {
                const itemArray = menuData[itemKey];
                itemArray.forEach(item => {
                    if (item.meal === meal && item.date === getDateOffset(index - 7)) {
                        const itemElement = document.createElement('div');
                        itemElement.classList.add('menu-item');
                        itemElement.innerText = itemKey;
                        itemElement.ondblclick = () => removeMenuItem(itemKey, item.date, item.meal); // 修改为双击删除
                        mealItemsContainer.appendChild(itemElement);
                    }
                });
            });

            mealContainer.appendChild(mealItemsContainer);
            categoryContainer.appendChild(mealContainer);
        });

        menuContainer.appendChild(categoryContainer);
    });
}

function addMenuItem() {
    const dateInput = document.getElementById('menu-date').value;
    const menuItem = document.getElementById('menu-item').value;
    const mealType = document.getElementById('meal-type').value;

    if (dateInput && menuItem) {
        const formattedDate = new Date(dateInput).toISOString().slice(0, 10);
        const minDate = getDateOffset(-7);
        const maxDate = getDateOffset(1);

        if (formattedDate < minDate || formattedDate > maxDate) {
            alert('日期超出范围！');
            return;
        }

        if (!menuData[menuItem]) {
            menuData[menuItem] = [];
        }

        menuData[menuItem].push({ date: formattedDate, meal: mealType });
        localStorage.setItem('menuData', JSON.stringify(menuData));
        updateMenuDisplay();
    } else {
        alert('请输入日期和菜单项目！');
    }
}

function removeMenuItem(item, date, meal) {
    if (menuData[item]) {
        const index = menuData[item].findIndex(entry => entry.date === date && entry.meal === meal);
        if (index > -1) {
            menuData[item].splice(index, 1);
            if (menuData[item].length === 0) {
                delete menuData[item];
            }
        }
    }

    localStorage.setItem('menuData', JSON.stringify(menuData));
    updateMenuDisplay();
}

function cleanUpExpiredMenus() {
    const minDate = getDateOffset(-7);
    const maxDate = getDateOffset(1);

    Object.keys(menuData).forEach(itemKey => {
        menuData[itemKey] = menuData[itemKey].filter(entry => entry.date >= minDate && entry.date <= maxDate);
        if (menuData[itemKey].length === 0) {
            delete menuData[itemKey];
        }
    });
    localStorage.setItem('menuData', JSON.stringify(menuData));
}

cleanUpExpiredMenus();
document.getElementById('add-menu').onclick = addMenuItem;
updateMenuDisplay();
