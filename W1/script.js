const products = [
    { id: 1, name: "Mobile Phone", category: "Electronics", price: "$500", img: "product.png" },
    { id: 2, name: "Laptop", category: "Electronics", price: "$1000", img: "product.png" },
    { id: 3, name: "Headphones", category: "Electronics", price: "$100", img: "product.png" },
    { id: 4, name: "Watch", category: "Fashion", price: "$200", img: "product.png" },
    { id: 5, name: "Tablet", category: "Electronics", price: "$400", img: "product.png" },
    { id: 6, name: "Notebook", category: "Stationery", price: "$5", img: "product.png" },
    { id: 7, name: "Pen Set", category: "Stationery", price: "$10", img: "product.png" },
    { id: 8, name: "Backpack", category: "Travel", price: "$50", img: "product.png" },
    { id: 9, name: "Water Bottle", category: "Home", price: "$15", img: "product.png" },
    { id: 10, name: "Coffee Mug", category: "Home", price: "$8", img: "product.png" },
    { id: 11, name: "Desk Lamp", category: "Home", price: "$25", img: "product.png" },
    { id: 12, name: "USB Cable", category: "Accessories", price: "$10", img: "product.png" },
    { id: 13, name: "Mouse", category: "Accessories", price: "$20", img: "product.png" },
    { id: 14, name: "Keyboard", category: "Accessories", price: "$30", img: "product.png" },
    { id: 15, name: "Camera", category: "Electronics", price: "$600", img: "product.png" },
];

const itemsPerPage = 10;
let currentPage = 1;

function displayProducts(page) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedItems = products.slice(start, end);

    const tbody = document.getElementById('productBody');
    tbody.innerHTML = paginatedItems.map(p => `
        <tr>
            <td><strong>#${p.id}</strong></td>
            <td><img src="${p.img}" alt="${p.name}" class="product-img"></td>
            <td>${p.name}</td>
            <td><span class="badge">${p.category}</span></td>
            <td><strong>${p.price}</strong></td>
        </tr>
    `).join('');

    updatePagination();
}

function updatePagination() {
    const pageCount = Math.ceil(products.length / itemsPerPage);
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    for (let i = 1; i <= pageCount; i++) {
        const btn = document.createElement('button');
        btn.innerText = i;
        btn.classList.toggle('active', i === currentPage);
        btn.onclick = () => {
            currentPage = i;
            displayProducts(i);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
        pagination.appendChild(btn);
    }
}

// Initial Call
displayProducts(currentPage);
