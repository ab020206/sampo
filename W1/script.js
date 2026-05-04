const products = [
    { id: 1, name: "Premium Smartphone", category: "Electronics", price: "$699", img: "https://via.placeholder.com/60" },
    { id: 2, name: "Wireless Headphones", category: "Electronics", price: "$199", img: "https://via.placeholder.com/60" },
    { id: 3, name: "Smart Watch", category: "Wearables", price: "$249", img: "https://via.placeholder.com/60" },
    { id: 4, name: "Laptop Pro", category: "Electronics", price: "$1299", img: "https://via.placeholder.com/60" },
    { id: 5, name: "Coffee Maker", category: "Home", price: "$89", img: "https://via.placeholder.com/60" },
    { id: 6, name: "Running Shoes", category: "Sports", price: "$120", img: "https://via.placeholder.com/60" },
    { id: 7, name: "Yoga Mat", category: "Sports", price: "$40", img: "https://via.placeholder.com/60" },
    { id: 8, name: "Backpack", category: "Travel", price: "$75", img: "https://via.placeholder.com/60" },
    { id: 9, name: "Desk Lamp", category: "Office", price: "$35", img: "https://via.placeholder.com/60" },
    { id: 10, name: "Bluetooth Speaker", category: "Electronics", price: "$59", img: "https://via.placeholder.com/60" },
    { id: 11, name: "Mechanical Keyboard", category: "Electronics", price: "$110", img: "https://via.placeholder.com/60" },
    { id: 12, name: "Gaming Mouse", category: "Electronics", price: "$65", img: "https://via.placeholder.com/60" },
    { id: 13, name: "Monitor 27-inch", category: "Electronics", price: "$299", img: "https://via.placeholder.com/60" },
    { id: 14, name: "External SSD", category: "Electronics", price: "$150", img: "https://via.placeholder.com/60" },
    { id: 15, name: "Power Bank", category: "Electronics", price: "$45", img: "https://via.placeholder.com/60" }
];

const itemsPerPage = 10;
let currentPage = 1;

function displayProducts(page) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedItems = products.slice(start, end);

    const tbody = document.getElementById('productBody');
    tbody.innerHTML = '';

    paginatedItems.forEach(product => {
        const row = `
            <tr>
                <td><img src="${product.img}" alt="${product.name}" class="product-img"></td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>${product.price}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });

    renderPagination();
}

function renderPagination() {
    const pageCount = Math.ceil(products.length / itemsPerPage);
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    for (let i = 1; i <= pageCount; i++) {
        const button = document.createElement('button');
        button.innerText = i;
        if (i === currentPage) button.classList.add('active');
        
        button.addEventListener('click', () => {
            currentPage = i;
            displayProducts(currentPage);
        });
        
        pagination.appendChild(button);
    }
}

// Initial call
displayProducts(currentPage);
