const categories = ["7天前", "6天前", "5天前", "4天前", "3天前", "2天前", "1天前", "今天", "明天"];
const meals = ["早餐", "午餐", "晚餐"];
let menuData = JSON.parse(localStorage.getItem('menuData')) || {};

// 获取日期偏移
function getDateOffset(offset) {
    const today = new Date();
    today.setDate(today.getDate() + offset);
    return today.toISOString().slice(0, 10); // 格式化为YYYY-MM-DD
}

// 更新菜单显示
function updateMenuDisplay() {
    const menuContainer = document.getElementById('menu-container');
    menuContainer.innerHTML = "";

    categories.forEach((category, index) => {
        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('menu-category');

        // 添加类别背景颜色
        const classNames = ['category-9', 'category-8', 'category-7', 'category-6', 'category-5', 'category-4', 'category-3', 'category-2', 'category-1'];
        categoryContainer.classList.add(classNames[index]);

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
                        itemElement.innerText = itemKey; // 在分类中显示菜单项名称
                        itemElement.onclick = () => removeMenuItem(itemKey, item.date, item.meal);
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

// 添加菜单项
function addMenuItem() {
    const dateInput = document.getElementById('menu-date').value;
    const menuItem = document.getElementById('menu-item').value;
    const mealType = document.getElementById('meal-type').value;

    if (dateInput && menuItem) {
        const formattedDate = new Date(dateInput).toISOString().slice(0, 10);

        // 允许的日期范围
        const today = new Date().toISOString().slice(0, 10);
        const minDate = getDateOffset(-7);
        const maxDate = getDateOffset(1);

        if (formattedDate < minDate || formattedDate > maxDate) {
            alert('日期超出范围！');
            return;
        }

        // 如果 menuData 中不存在该菜单项，则初始化一个数组
        if (!menuData[menuItem]) {
            menuData[menuItem] = [];
        }

        // 添加当前菜单项到对应的数组中
        menuData[menuItem].push({ date: formattedDate, meal: mealType });
        localStorage.setItem('menuData', JSON.stringify(menuData));
        updateMenuDisplay();
    } else {
        alert('请输入日期和菜单项目！');
    }
}

// 删除菜单项
function removeMenuItem(item, date, meal) {
    if (menuData[item]) {
        const itemArray = menuData[item];
        // 找到对应的菜单项并删除
        const index = itemArray.findIndex(entry => entry.date === date && entry.meal === meal);
        if (index > -1) {
            itemArray.splice(index, 1); // 删除该项
            if (itemArray.length === 0) {
                delete menuData[item]; // 如果数组空了，删除该菜单项
            }
        }
    }

    localStorage.setItem('menuData', JSON.stringify(menuData));
    updateMenuDisplay();
}

// 自动清理过期菜单
function cleanUpExpiredMenus() {
    const today = new Date().toISOString().slice(0, 10);
    const minDate = getDateOffset(-7);
    const maxDate = getDateOffset(1);

    Object.keys(menuData).forEach(itemKey => {
        const itemArray = menuData[itemKey];
        // 过滤掉过期的菜单项
        menuData[itemKey] = itemArray.filter(entry => entry.date >= minDate && entry.date <= maxDate);
        // 如果过滤后数组为空，则删除该菜单项
        if (menuData[itemKey].length === 0) {
            delete menuData[itemKey];
        }
    });
    localStorage.setItem('menuData', JSON.stringify(menuData));
}

// 初始化时清理过期菜单并更新显示
cleanUpExpiredMenus();
document.getElementById('add-menu').onclick = addMenuItem;
updateMenuDisplay();
